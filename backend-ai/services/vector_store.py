from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import numpy as np
from motor.motor_asyncio import AsyncIOMotorDatabase


class IVectorStore(ABC):
    """Adapter pattern: abstracts vector storage backend.
    Implementations can be MongoDB Atlas Vector Search, Qdrant, or in-memory."""
    
    @abstractmethod
    async def upsert(self, doc_id: str, embedding: List[float], metadata: dict) -> None:
        ...
    
    @abstractmethod
    async def search(self, query_embedding: List[float], top_k: int = 20,
                     min_score: float = 0.3) -> List[Dict[str, Any]]:
        ...
    
    @abstractmethod
    async def delete(self, doc_id: str) -> None:
        ...
    
    @abstractmethod
    async def count(self) -> int:
        ...


class MongoAtlasVectorStore(IVectorStore):
    """Uses MongoDB Atlas $vectorSearch aggregation pipeline.
    Requires an Atlas Vector Search index named 'idea_vector_index' on the
    'IdeaEmbeddings' collection with the 'embedding' field.
    
    Index definition (create via Atlas UI or CLI):
    {
        "type": "vectorSearch",
        "fields": [{
            "type": "vector",
            "path": "embedding",
            "numDimensions": 384,
            "similarity": "cosine"
        }]
    }
    """
    
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["IdeaEmbeddings"]
    
    async def upsert(self, doc_id: str, embedding: List[float], metadata: dict) -> None:
        await self.collection.update_one(
            {"idea_id": doc_id},
            {"$set": {
                "idea_id": doc_id,
                "embedding": embedding,
                "metadata": metadata
            }},
            upsert=True
        )
    
    async def search(self, query_embedding: List[float], top_k: int = 20,
                     min_score: float = 0.3) -> List[Dict[str, Any]]:
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "idea_vector_index",
                    "path": "embedding",
                    "queryVector": query_embedding,
                    "numCandidates": top_k * 10,
                    "limit": top_k
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "idea_id": 1,
                    "metadata": 1,
                    "score": {"$meta": "vectorSearchScore"}
                }
            }
        ]
        
        results = []
        async for doc in self.collection.aggregate(pipeline):
            if doc.get("score", 0) >= min_score:
                results.append({
                    "idea_id": doc["idea_id"],
                    "score": doc["score"],
                    "metadata": doc.get("metadata", {})
                })
        return results
    
    async def delete(self, doc_id: str) -> None:
        await self.collection.delete_one({"idea_id": doc_id})
    
    async def count(self) -> int:
        return await self.collection.count_documents({})


class InMemoryVectorStore(IVectorStore):
    """Fallback for local development without Atlas Vector Search.
    Stores embeddings in-memory and uses brute-force cosine similarity."""
    
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}
    
    async def upsert(self, doc_id: str, embedding: List[float], metadata: dict) -> None:
        self._store[doc_id] = {
            "embedding": np.array(embedding),
            "metadata": metadata
        }
    
    async def search(self, query_embedding: List[float], top_k: int = 20,
                     min_score: float = 0.3) -> List[Dict[str, Any]]:
        if not self._store:
            return []
        
        query_vec = np.array(query_embedding)
        query_norm = np.linalg.norm(query_vec)
        if query_norm == 0:
            return []
        
        results = []
        for doc_id, data in self._store.items():
            emb = data["embedding"]
            emb_norm = np.linalg.norm(emb)
            if emb_norm == 0:
                continue
            score = float(np.dot(query_vec, emb) / (query_norm * emb_norm))
            if score >= min_score:
                results.append({
                    "idea_id": doc_id,
                    "score": score,
                    "metadata": data["metadata"]
                })
        
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]
    
    async def delete(self, doc_id: str) -> None:
        self._store.pop(doc_id, None)
    
    async def count(self) -> int:
        return len(self._store)

import logging
from typing import Optional
from sentence_transformers import SentenceTransformer
from motor.motor_asyncio import AsyncIOMotorDatabase
from services.vector_store import IVectorStore

logger = logging.getLogger(__name__)


class EmbeddingSyncService:
    """Syncs idea embeddings from the Ideas collection into the vector store.
    Called on startup to backfill, and can be called periodically to refresh."""
    
    def __init__(self, db: AsyncIOMotorDatabase, model: SentenceTransformer, vector_store: IVectorStore):
        self.db = db
        self.model = model
        self.vector_store = vector_store
    
    def _build_idea_text(self, idea: dict) -> str:
        industry = idea.get("Industry", idea.get("industry", ""))
        stage = idea.get("Stage", idea.get("stage", ""))
        problem = idea.get("Problem", idea.get("problem", ""))
        solution = idea.get("Solution", idea.get("solution", ""))
        title = idea.get("Title", idea.get("title", ""))
        return f"{title}. Startup in {industry} at {stage} stage. Problem: {problem}. Solution: {solution}."
    
    async def sync_all(self) -> int:
        """Backfill all active ideas into the vector store."""
        cursor = self.db.Ideas.find({})
        count = 0
        async for idea in cursor:
            idea_id = str(idea["_id"])
            text = self._build_idea_text(idea)
            embedding = self.model.encode(text).tolist()
            metadata = {
                "industry": idea.get("Industry", idea.get("industry", "")),
                "stage": idea.get("Stage", idea.get("stage", "")),
                "title": idea.get("Title", idea.get("title", ""))
            }
            await self.vector_store.upsert(idea_id, embedding, metadata)
            count += 1
        
        logger.info(f"Synced {count} idea embeddings to vector store.")
        return count
    
    async def sync_single(self, idea_id: str) -> bool:
        """Sync a single idea by ID."""
        from bson import ObjectId
        try:
            idea = await self.db.Ideas.find_one({"_id": idea_id})
            if idea is None:
                # Try with ObjectId
                idea = await self.db.Ideas.find_one({"_id": ObjectId(idea_id)})
            if idea is None:
                return False
            
            text = self._build_idea_text(idea)
            embedding = self.model.encode(text).tolist()
            metadata = {
                "industry": idea.get("Industry", idea.get("industry", "")),
                "stage": idea.get("Stage", idea.get("stage", "")),
                "title": idea.get("Title", idea.get("title", ""))
            }
            await self.vector_store.upsert(str(idea["_id"]), embedding, metadata)
            return True
        except Exception as e:
            logger.error(f"Failed to sync idea {idea_id}: {e}")
            return False

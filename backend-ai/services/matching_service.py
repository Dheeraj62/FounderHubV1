import os
from sentence_transformers import SentenceTransformer
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from services.vector_store import IVectorStore, InMemoryVectorStore, MongoAtlasVectorStore
from services.embedding_sync_service import EmbeddingSyncService
import logging

load_dotenv()
logger = logging.getLogger(__name__)


class MatchingService:
    def __init__(self):
        model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
        print(f"Loading sentence-transformers model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        self.db_client = None
        self.db = None
        self.vector_store: IVectorStore = InMemoryVectorStore()  # Default fallback
        self.sync_service: EmbeddingSyncService = None

    async def initialize(self):
        # Connect to MongoDB
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        db_name = os.getenv("DATABASE_NAME", "FounderHub")
        self.db_client = AsyncIOMotorClient(mongo_uri)
        self.db = self.db_client[db_name]
        print(f"Connected to MongoDB '{db_name}' successfully.")
        
        # Initialize vector store based on configuration
        use_atlas = os.getenv("USE_ATLAS_VECTOR_SEARCH", "false").lower() == "true"
        if use_atlas:
            self.vector_store = MongoAtlasVectorStore(self.db)
            logger.info("Using MongoDB Atlas Vector Search.")
        else:
            self.vector_store = InMemoryVectorStore()
            logger.info("Using in-memory vector store (local dev mode).")
        
        # Sync all existing ideas into the vector store
        self.sync_service = EmbeddingSyncService(self.db, self.model, self.vector_store)
        count = await self.sync_service.sync_all()
        print(f"Initialized vector store with {count} idea embeddings.")

    async def calculate_matches(self, investor_id: str):
        # 1. Fetch Investor Profile
        investor_profile = await self.db.InvestorProfiles.find_one({"userId": investor_id})
        if not investor_profile:
            raise Exception("Investor profile not found.")
        
        # 2. Construct Investor Preference Text for embedding
        industries = ", ".join(investor_profile.get("industries", 
            investor_profile.get("preferredIndustries", [])))
        stages = ", ".join(investor_profile.get("investmentStage",
            investor_profile.get("preferredStages", [])))
        thesis = investor_profile.get("investmentThesis", "")
        
        investor_text = (f"Investor looking for startups in {industries}. "
                        f"Preferred stages: {stages}. Thesis: {thesis}")
        investor_embedding = self.model.encode(investor_text).tolist()
        
        # 3. Vector search — O(log n) with HNSW index vs O(n) brute force
        matches = await self.vector_store.search(
            query_embedding=investor_embedding,
            top_k=20,
            min_score=0.3
        )
        
        # 4. Build response
        results = []
        for match in matches:
            score = match["score"]
            metadata = match.get("metadata", {})
            industry = metadata.get("industry", "")
            stage = metadata.get("stage", "")
            
            if score > 0.7:
                reason = f"Excellent match! High alignment with your thesis in {industry}."
            else:
                reason = f"Strong match in {industry} + {stage} stage based on your thesis."
            
            results.append({
                "ideaId": match["idea_id"],
                "matchScore": round(score, 3),
                "reason": reason
            })
        
        return results

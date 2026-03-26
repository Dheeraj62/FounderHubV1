import os
from sentence_transformers import SentenceTransformer
from motor.motor_asyncio import AsyncIOMotorClient
import numpy as np
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class MatchingService:
    def __init__(self):
        # Using a fast, lightweight model for dense vector embeddings
        model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
        print(f"Loading sentence-transformers model: {model_name}...")
        self.model = SentenceTransformer(model_name)
        self.db_client = None
        self.db = None
        
        # In-memory cache for Idea embeddings to prevent recalculating every request
        # Format: { idea_id: { "embedding": np.ndarray, "text": str } }
        self.idea_cache = {}

    async def initialize(self):
        # Connect to MongoDB
        mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
        db_name = os.getenv("DATABASE_NAME", "FounderHub")
        self.db_client = AsyncIOMotorClient(mongo_uri)
        self.db = self.db_client[db_name]
        print(f"Connected to MongoDB '{db_name}' successfully.")

    def _cosine_similarity(self, v1, v2):
        dot_product = np.dot(v1, v2)
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)
        if norm_v1 == 0 or norm_v2 == 0:
            return 0.0
        return float(dot_product / (norm_v1 * norm_v2))

    async def calculate_matches(self, investor_id: str):
        # 1. Fetch Investor Profile
        investor_profile = await self.db.InvestorProfiles.find_one({"userId": investor_id})
        if not investor_profile:
            raise Exception("Investor profile not found.")
            
        # 2. Construct Investor Preference Text
        industries = ", ".join(investor_profile.get("industries", []))
        stages = ", ".join(investor_profile.get("investmentStage", []))
        thesis = investor_profile.get("investmentThesis", "")
        
        investor_text = f"Investor looking for startups in {industries}. Preferred stages: {stages}. Thesis: {thesis}"
        investor_embedding = self.model.encode(investor_text)

        # 3. Fetch all active Ideas
        # In a massive production system, we'd use a Vector DB (Qdrant/Milvus). 
        # For MVP-5, we'll cache them in memory.
        ideas_cursor = self.db.Ideas.find({"status": "Active"})
        ideas = await ideas_cursor.to_list(length=1000)
        
        results = []
        for idea in ideas:
            idea_id = str(idea["_id"])
            idea_industry = idea.get("industry", "")
            idea_stage = idea.get("stage", "")
            idea_problem = idea.get("problem", "")
            idea_solution = idea.get("solution", "")
            
            idea_text = f"Startup in {idea_industry} at {idea_stage} stage. Problem: {idea_problem}. Solution: {idea_solution}."
            
            # Check cache to save inference time
            if idea_id in self.idea_cache and self.idea_cache[idea_id]["text"] == idea_text:
                idea_embedding = self.idea_cache[idea_id]["embedding"]
            else:
                idea_embedding = self.model.encode(idea_text)
                self.idea_cache[idea_id] = {
                    "embedding": idea_embedding,
                    "text": idea_text
                }
                
            # 4. Compute Similarity
            score = self._cosine_similarity(investor_embedding, idea_embedding)
            
            # Normalize score logic (optional thresholding)
            if score > 0.3:  # Only return somewhat relevant matches
                reason = f"Strong match in {idea_industry} + {idea_stage} stage based on your thesis."
                if score > 0.7:
                    reason = f"Excellent match! High alignment with your thesis in {idea_industry}."
                    
                results.append({
                    "ideaId": idea_id,
                    "matchScore": round(score, 3),
                    "reason": reason
                })
                
        # 5. Sort by Top Scores and limit to 20
        results.sort(key=lambda x: x["matchScore"], reverse=True)
        return results[:20]

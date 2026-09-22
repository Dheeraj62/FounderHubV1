import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from services.matching_service import MatchingService
import uvicorn

app = FastAPI(title="FounderHub AI Matchmaker")
matching_service = MatchingService()

class MatchRequest(BaseModel):
    investorId: str

class MatchResponse(BaseModel):
    ideaId: str
    matchScore: float
    reason: str

@app.on_event("startup")
async def startup_event():
    await matching_service.initialize()

@app.post("/api/ai-matches", response_model=List[MatchResponse])
async def get_ai_matches(request: MatchRequest):
    try:
        matches = await matching_service.calculate_matches(request.investorId)
        return matches
    except Exception as e:
        print(f"Error calculating matches: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sync-embeddings")
async def sync_embeddings():
    """Trigger a full re-sync of all idea embeddings."""
    try:
        count = await matching_service.sync_service.sync_all()
        return {"synced": count}
    except Exception as e:
        print(f"Error syncing embeddings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sync-embedding/{idea_id}")
async def sync_single_embedding(idea_id: str):
    """Sync a single idea's embedding after create/update."""
    try:
        success = await matching_service.sync_service.sync_single(idea_id)
        if not success:
            raise HTTPException(status_code=404, detail="Idea not found")
        return {"status": "synced"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error syncing embedding: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

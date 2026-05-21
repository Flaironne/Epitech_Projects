from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.models.schemas import PathfinderRequest, PathfinderResponse
from app.workers.background import process_and_callback
from app.services.pathfinder_service import run_pathfinder

router = APIRouter()

@router.post("/api/analyze", response_model=PathfinderResponse)
async def analyze(payload: PathfinderRequest, background_tasks: BackgroundTasks):
    if payload.voice_analysis_id:
        background_tasks.add_task(process_and_callback, payload)
        return PathfinderResponse(
            status="processing"
        )

    try:
        analysis = run_pathfinder(payload.departure, payload.destination)

        return PathfinderResponse(
            status="completed",
            analysis=analysis
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "ambiguous_sentence",
                "message": str(e)
            }
        )
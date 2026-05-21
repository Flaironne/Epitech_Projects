from app.services.pathfinder_service import run_pathfinder
from app.services.callback_service import notify_success, notify_error
from app.models.schemas import PathfinderRequest

async def process_and_callback(payload: PathfinderRequest):
    if not payload.voice_analysis_id:
        raise ValueError("voice_analysis_id is required")

    print("Starting background processing for voice_analysis_id:", payload.voice_analysis_id)

    try:
        pathfinder_analysis = run_pathfinder(payload.departure, payload.destination)

        await notify_success(
            payload.voice_analysis_id,
            pathfinder_analysis
        )
        
    except ValueError as e:
        await notify_error(
            payload.voice_analysis_id,
            "pathfinder_crashed",
            str(e)
        )

    except Exception as e:
        await notify_error(
            payload.voice_analysis_id,
            "pathfinder_crashed",
            str(e)
        )
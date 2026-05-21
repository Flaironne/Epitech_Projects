from fastapi import APIRouter, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse

from app.schemas.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.predictor_service import Predictor
from app.workers.background import process_and_callback

router = APIRouter()
predictor = Predictor()


@router.post("/api/analyze")
def analyze(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    print("Received analyze request with voice_request_id:", req.voice_request_id)

    if req.voice_request_id:
        background_tasks.add_task(process_and_callback, req)
        return AnalyzeResponse(
            status="processing"
        )

    try:
        res = predictor.predict(req.raw_transcript, measure_emissions=True)

        if not res.get("is_valid", False):
            return JSONResponse(
                status_code=400,
                content={
                    "error": {
                        "code": "invalid_request",
                        "message": "The request does not seem to be a valid trip request."
                    }
                }
            )

        return AnalyzeResponse(
            status="completed",
            analysis={
                "departure": (res.get("departure") or "").lower(),
                "destination": (res.get("arrival") or "").lower(),
                "stops": [],
                "confidence_score": round(float(res.get("confidence", 0.0)), 3),
                "confidence_details": res.get("confidence_details", {})
            },
            metrics=res.get("metrics", {})
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "invalid_request",
                    "message": str(e)
                }
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "nlp_crashed",
                    "message": str(e)
                }
            }
        )
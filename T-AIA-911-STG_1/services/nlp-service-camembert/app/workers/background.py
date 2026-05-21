import asyncio

from app.services.callback_service import notify_success, notify_error
from app.services.predictor_service import Predictor
from app.schemas.schemas import AnalyzeRequest

CONFIDENCE_THRESHOLD = 0.30

async def process_and_callback(payload: AnalyzeRequest):
    if not payload.voice_request_id:
        raise ValueError("voice_request_id is required")

    try:
        predictor = Predictor()

        res = await asyncio.to_thread(
            predictor.predict,
            payload.raw_transcript,
            True
        )

        if not res.get("is_valid", False):
            await notify_error(
                payload.voice_request_id,
                "invalid_request",
                "The request does not seem to be a valid trip request."
            )
            return

        conf = float(res.get("confidence", 0.0))

        if conf < CONFIDENCE_THRESHOLD:
            await notify_error(
                payload.voice_request_id,
                "low_confidence",
                f"The confidence level is insufficient to validate the analysis of the voice request ({conf} - {CONFIDENCE_THRESHOLD}). Departure: {res.get('departure')}, Arrival: {res.get('arrival')}."
            )
            return

        await notify_success(
            payload.voice_request_id,
            {
                "departure": (res.get("departure") or "").lower(),
                "destination": (res.get("arrival") or "").lower(),
                "stops": [],
                "confidence_score": round(conf, 3),
                "confidence_details": res.get("confidence_details", {})
            },
            res.get("metrics", {})
        )

    except ValueError as e:
        await notify_error(
            payload.voice_request_id,
            "invalid_request",
            str(e)
        )

    except Exception as e:
        await notify_error(
            payload.voice_request_id,
            "nlp_crashed",
            str(e)
        )
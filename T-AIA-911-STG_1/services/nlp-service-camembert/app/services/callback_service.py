import httpx
import os
from dotenv import load_dotenv

load_dotenv()

API_CALLBACK_URL = os.environ.get("API_CALLBACK_URL")
API_CALLBACK_TOKEN = os.environ.get("API_CALLBACK_TOKEN")


def ensure_callback_configured(url: str | None, token: str | None):
    if not url:
        raise RuntimeError("API_CALLBACK_URL is not set")
    if not token:
        raise RuntimeError("API_CALLBACK_TOKEN is not set")
    return url, token


async def notify_success(
    voice_request_id: str,
    analysis: dict,
    metrics: dict,
):
    try:
        url, token = ensure_callback_configured(
            API_CALLBACK_URL,
            API_CALLBACK_TOKEN,
        )

        print("Sending success callback for voice_request_id", voice_request_id)

        payload = {
            "voice_request_id": voice_request_id,
            "status": "processed",
            "analysis": analysis,
            "metrics": metrics,
        }

        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(
                url,
                json=payload,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Service-Token": token,
                },
            )

        print("Successfully sent callback for voice_request_id", voice_request_id)

    except Exception as e:
        print("Failed to send success callback for voice_request_id", voice_request_id, ":", repr(e))

        await notify_error(
            voice_request_id,
            "callback_failed",
            f"Failed to send success callback: {repr(e)}",
        )

async def notify_error(
    voice_request_id: str,
    code: str,
    message: str,
):
    try:
        url, token = ensure_callback_configured(
            API_CALLBACK_URL,
            API_CALLBACK_TOKEN,
        )

        print("Sending error callback for voice_request_id", voice_request_id, "with code", code)

        payload = {
            "voice_request_id": voice_request_id,
            "status": "failed",
            "error": {
                "code": code,
                "message": message,
            },
        }

        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(
                url,
                json=payload,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Service-Token": token,
                },
            )

        print("Successfully sent error callback for voice_request_id", voice_request_id)

    except Exception as e:
        print(f"Failed to send error callback for voice_request_id={voice_request_id}, code={code}, message={message}. Error: {repr(e)}")
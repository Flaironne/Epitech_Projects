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
    voice_analysis_id: str,
    analysis: dict
):
    try:
        url, token = ensure_callback_configured(
            API_CALLBACK_URL,
            API_CALLBACK_TOKEN,
        )

        print(f"Sending success callback for voice_analysis_id={voice_analysis_id} to {url}")

        payload = {
            "voice_analysis_id": voice_analysis_id,
            "status": "processed",
            "analysis": analysis,
        }

        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.post(
                url,
                json=payload,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Service-Token": token,
                },
            )

            print(f"Received response: {response.status_code} - {response.text}")

        print(f"Successfully sent callback for voice_analysis_id={voice_analysis_id}")

    except Exception as e:
        print(f"Failed to send callback for voice_analysis_id={voice_analysis_id}: {repr(e)}")

        await notify_error(
            voice_analysis_id,
            "callback_failed",
            f"Failed to send success callback: {repr(e)}",
        )

async def notify_error(
    voice_analysis_id: str,
    code: str,
    message: str,
):
    try:
        url, token = ensure_callback_configured(
            API_CALLBACK_URL,
            API_CALLBACK_TOKEN,
        )

        print(f"Sending error callback for voice_analysis_id={voice_analysis_id} to {url} with code={code} and message={message}")

        payload = {
            "voice_analysis_id": voice_analysis_id,
            "status": "failed",
            "error": {
                "code": code,
                "message": message,
            },
        }

        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.post(
                url,
                json=payload,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Service-Token": token,
                },
            )

            print(f"Received response: {response.status_code} - {response.text}")

        print(f"Successfully sent error callback for voice_analysis_id={voice_analysis_id}")

    except Exception as e:
        print(f"Failed to send error callback for voice_analysis_id={voice_analysis_id}: {repr(e)}")
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Union

class AnalyzeRequest(BaseModel):
    voice_request_id: Optional[Union[str, int]] = Field(
        default=None,
        description="Identifiant de la requête voix"
    )
    raw_transcript: str = Field(..., description="Transcription brute (texte)")
    language_code: Optional[str] = Field(
        default="fr_FR",
        description="Langue (optionnel, défaut fr_FR)"
    )


class AnalyzeResponse(BaseModel):
    status: str
    voice_request_id: Optional[Union[str, int]] = None
    analysis: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    error: Optional[Dict[str, str]] = None
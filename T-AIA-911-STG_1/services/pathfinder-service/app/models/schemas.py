from pydantic import BaseModel
from typing import Optional, Dict, Any

class PathfinderRequest(BaseModel):
    departure: str
    destination: str
    voice_analysis_id: Optional[str] = None


class PathfinderResponse(BaseModel):
    status: str
    analysis: Optional[Dict[str, Any]] = None
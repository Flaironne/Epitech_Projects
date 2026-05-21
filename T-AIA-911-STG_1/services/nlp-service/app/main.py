from fastapi import FastAPI
from app.routes.analyze import router

app = FastAPI(title="NLP Train Service", version="1.0.0")
app.include_router(router)

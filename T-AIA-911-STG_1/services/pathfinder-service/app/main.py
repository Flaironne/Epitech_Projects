from fastapi import FastAPI
from app.routes.analyze import router

app = FastAPI(title="Pathfinder Service", version="1.0.0")
app.include_router(router)

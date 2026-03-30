from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.core.settings import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    )


@app.get('/')
def read_root():
    return {'message': f'{settings.app_name} is running'}

app.include_router(health_router)
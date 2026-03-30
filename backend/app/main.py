from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.users import router as users_router
from app.core.settings import settings
from app.db.init_db import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

@app.on_event('startup')
def on_startup():
    init_db()


@app.get('/')
def read_root():
    return {'message': f'{settings.app_name} is running'}

app.include_router(health_router)
app.include_router(users_router)
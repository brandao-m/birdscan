from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.analyses import router as analyses_router
from app.api.routes.found_birds import router as found_birds_router
from app.api.routes.auth import router as auth_router
from app.api.routes.birds import router as birds_router
from app.api.routes.health import router as health_router
from app.api.routes.users import router as users_router
from app.api.routes.uploads import router as uploads_router
from app.core.settings import settings
from app.db.init_db import init_db

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('startup')
def on_startup():
    init_db()


@app.get('/')
def read_root():
    return {'message': f'{settings.app_name} is running'}

app.include_router(health_router)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(birds_router)
app.include_router(analyses_router)
app.include_router(found_birds_router)
app.include_router(uploads_router)
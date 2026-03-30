from fastapi import FastAPI

from app.api.routes.health import router as health_router

app = FastAPI(title='BirdScan API')

@app.get('/')
def read_root():
    return {'message': 'Birdscan API is running'}

app.include_router(health_router)
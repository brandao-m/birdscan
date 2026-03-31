from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.upload import AudioUploadResponse

router = APIRouter(prefix='/uploads', tags=['Uploads'])

UPLOAD_DIR = Path('uploads')
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post('/audio', response_model=AudioUploadResponse, status_code=201)
def upload_audio(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail='Nenhum arquivo fornecido')
    
    allowed_content_types = {
        'audio/mpeg',
        'audio/wav',
        'audio/x-wav',
        'audio/mp3',
        'audio/ogg',
        'audio/webm',
    }

    if file.content_type not in allowed_content_types:
        raise HTTPException(status_code=400, detail='Tipo de arquivo invalido')
    
    file_extension = Path(file.filename).suffix
    unique_filename = f'{uuid4()}{file_extension}'
    file_path = UPLOAD_DIR / unique_filename

    with file_path.open('wb') as buffer:
        buffer.write(file.file.read())

    return AudioUploadResponse(
        filename=file.filename,
        file_path=str(file_path),
        content_type=file.content_type or 'unknown',
    )
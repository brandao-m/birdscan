from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.dependencies import get_db
from app.models.analysis import Analysis
from app.models.bird import Bird
from app.models.user import User
from app.schemas.analysis import AnalysisCreate, AnalysisResponse
from app.schemas.analysis_upload import AnalysisUploadResponse
from app.schemas.bird import BirdSummary
from app.services.found_bird_service import update_found_birds
from app.services.bird_identification_service import identify_bird_from_audio

router = APIRouter(prefix='/analyses', tags=['Analyses'])

UPLOAD_DIR = Path('uploads')
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post('/', response_model=AnalysisResponse, status_code=201)
def create_analysis(analysis_data: AnalysisCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == analysis_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='Usuario não encontrado')
    
    bird = db.query(Bird).filter(Bird.id == analysis_data.bird_id).first()
    if not bird:
        raise HTTPException(status_code=404, detail='Ave não encontrada')
    
    new_analysis = Analysis(
        user_id=analysis_data.user_id,
        bird_id=analysis_data.bird_id,
        audio_path=analysis_data.audio_path,
        confidence=analysis_data.confidence,
        alternatives=analysis_data.alternatives,
    )

    db.add(new_analysis)

    update_found_birds(
        db=db,
        user_id=analysis_data.user_id,
        bird_id=analysis_data.bird_id,
    )

    db.commit()
    db.refresh(new_analysis)

    return new_analysis


@router.post('/upload', response_model=AnalysisUploadResponse, status_code=201)
def upload_and_create_analysis(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    
    if not file.filename:
        raise HTTPException(status_code=400, detail='O arquivo deve ter um nome')
    
    allowed_types = {
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/x-wav',
        'audio/webm',
        'audio/ogg',
    }

    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail='Arquivo de audio não suportado')

    file_extension = Path(file.filename).suffix
    unique_filename = f'{uuid4()}{file_extension}'
    file_path = UPLOAD_DIR / unique_filename

    with file_path.open('wb') as buffer:
        buffer.write(file.file.read())

    try:
        identification_result = identify_bird_from_audio(
            db=db,
            file_path=file_path.as_posix(),
        )
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))
    
    bird = identification_result['bird']
    simulated_confidence = identification_result['confidence']
    simulated_alternatives = identification_result['alternatives']

    new_analysis = Analysis(
        user_id=current_user.id,
        bird_id=bird.id,
        audio_path=file_path.as_posix(),
        confidence=simulated_confidence,
        alternatives=simulated_alternatives,
    )

    db.add(new_analysis)

    update_found_birds(
        db=db,
        user_id=current_user.id,
        bird_id=bird.id,
    )

    db.commit()
    db.refresh(new_analysis)

    return AnalysisUploadResponse(
        message='Audio e analise criados com sucesso',
        filename=unique_filename,
        file_path=file_path.as_posix(),
        bird=BirdSummary(
            id=bird.id,
            common_name=bird.common_name,
            scientific_name=bird.scientific_name,
            image_url=bird.image_url,
        ),
        confidence=simulated_confidence,
        analysis_id=new_analysis.id,
    )


@router.get('/', response_model=list[AnalysisResponse])
def list_analyses(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).all()
    return analyses
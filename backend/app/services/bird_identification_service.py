from sqlalchemy.orm import Session

from app.models.bird import Bird

def identify_bird_from_audio(db: Session, file_path: str) -> dict:
    bird = db.query(Bird).first()

    if not bird:
        raise ValueError('Nenhuma ave disponivel para analise')
    
    return {
        'bird': bird,
        'confidence': 0.87,
        'alternatives': 'Bem-te-vi: 0.61 | Sanhaço-cinzento: 0.45',
    }
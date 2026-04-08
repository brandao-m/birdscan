import random

from sqlalchemy.orm import Session

from app.models.bird import Bird


def identify_bird_from_audio(db: Session, file_path: str) -> dict:
    birds = db.query(Bird).all()

    if not birds:
        raise ValueError("Nenhuma ave disponivel para analise")

    bird = random.choice(birds)

    confidence = round(random.uniform(0.75, 0.95), 2)

    alternative_birds = [item for item in birds if item.id != bird.id]
    random.shuffle(alternative_birds)
    selected_alternatives = alternative_birds[:2]

    alternatives_text = " | ".join(
        f"{item.common_name}: {round(random.uniform(0.40, 0.70), 2)}"
        for item in selected_alternatives
    )

    return {
        "bird": bird,
        "confidence": confidence,
        "alternatives": alternatives_text,
    }
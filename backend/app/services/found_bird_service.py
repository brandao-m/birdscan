from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.found_bird import FoundBird


def update_found_birds(db: Session, user_id: int, bird_id: int) -> None:
    existing_found_bird = (
        db.query(FoundBird)
        .filter(
            FoundBird.user_id == user_id,
            FoundBird.bird_id == bird_id,
        )
        .first()
    )

    if existing_found_bird:
        existing_found_bird.times_found += 1
        existing_found_bird.last_seen_at = datetime.now(timezone.utc)
    else:
        new_found_bird = FoundBird(
            user_id=user_id,
            bird_id=bird_id,
        )
        db.add(new_found_bird)
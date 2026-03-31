from pydantic import BaseModel


class AudioUploadResponse(BaseModel):
    filename: str
    file_path: str
    content_type: str
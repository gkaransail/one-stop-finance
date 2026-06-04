from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


@router.get("/")
async def index():
    return build_response({"message": "sentiment feature — coming soon"})

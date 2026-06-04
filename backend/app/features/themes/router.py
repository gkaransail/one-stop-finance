from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/themes", tags=["themes"])


@router.get("/")
async def index():
    return build_response({"message": "themes feature — coming soon"})

from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/insiders", tags=["insiders"])


@router.get("/")
async def index():
    return build_response({"message": "insiders feature — coming soon"})

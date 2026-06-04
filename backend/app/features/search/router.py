from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/")
async def index():
    return build_response({"message": "search feature — coming soon"})

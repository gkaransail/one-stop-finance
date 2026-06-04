from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/trend", tags=["trend"])


@router.get("/")
async def index():
    return build_response({"message": "trend feature — coming soon"})

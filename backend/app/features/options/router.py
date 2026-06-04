from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/options", tags=["options"])


@router.get("/")
async def index():
    return build_response({"message": "options feature — coming soon"})

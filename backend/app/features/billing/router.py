from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/")
async def index():
    return build_response({"message": "billing feature — coming soon"})

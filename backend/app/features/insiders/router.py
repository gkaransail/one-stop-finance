from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.response import build_response, build_paginated_response
from app.database import get_db
from app.features.insiders.service import get_feed, get_clusters

router = APIRouter(prefix="/insiders", tags=["insiders"])


@router.get("/feed")
async def insider_feed(
    type: str = Query("buy", pattern="^(buy|sell|all)$"),
    congress: bool = Query(False),
    open_market: bool = Query(True),
    min_value: float = Query(0, ge=0),
    days: int = Query(30, ge=1, le=365),
    page: int = Query(1, ge=1),
    per_page: int = Query(25, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    items, total = await get_feed(
        db,
        transaction_type=type,
        congress_only=congress,
        open_market_only=open_market,
        min_value=min_value,
        days=days,
        page=page,
        per_page=per_page,
    )
    return build_paginated_response(items, page=page, per_page=per_page, total=total)


@router.get("/cluster-buys")
async def cluster_buys(
    days: int = Query(30, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
):
    data = await get_clusters(db, days=days)
    return build_response({"clusters": data})

import json
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.features.insiders.repository import (
    get_insider_feed,
    get_cluster_buys,
    get_top_insider_buys,
)

INSIDER_HIGHLIGHTS_KEY = "public:insider-highlights"
INSIDER_HIGHLIGHTS_TTL = 4 * 60 * 60  # 4 hours


async def get_insider_highlights(redis: Redis, db: AsyncSession, limit: int = 5) -> list[dict]:
    cached = await redis.get(INSIDER_HIGHLIGHTS_KEY)
    if cached:
        return json.loads(cached)[:limit]
    data = await get_top_insider_buys(db, limit=limit)
    if data:
        await redis.setex(INSIDER_HIGHLIGHTS_KEY, INSIDER_HIGHLIGHTS_TTL, json.dumps(data))
    return data


async def get_feed(
    db: AsyncSession,
    *,
    transaction_type: str = "buy",
    congress_only: bool = False,
    open_market_only: bool = True,
    min_value: float = 0,
    days: int = 30,
    page: int = 1,
    per_page: int = 25,
) -> tuple[list[dict], int]:
    return await get_insider_feed(
        db,
        transaction_type=transaction_type,
        congress_only=congress_only,
        open_market_only=open_market_only,
        min_value=min_value,
        days=days,
        page=page,
        per_page=per_page,
    )


async def get_clusters(db: AsyncSession, days: int = 30) -> list[dict]:
    return await get_cluster_buys(db, days=days)

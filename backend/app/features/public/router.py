from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from app.core.response import build_response
from app.redis import get_redis
from app.features.public.service import get_market_summary, get_news_feed

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/market-summary")
async def market_summary(redis: Redis = Depends(get_redis)):
    data = await get_market_summary(redis)
    return build_response({"indices": data})


@router.get("/news-feed")
async def news_feed(limit: int = 24, redis: Redis = Depends(get_redis)):
    data = await get_news_feed(redis, limit)
    return build_response({"articles": data})


@router.get("/theme-intelligence")
async def theme_intelligence():
    return build_response({"themes": []})


@router.get("/insider-highlights")
async def insider_highlights():
    return build_response({"trades": []})

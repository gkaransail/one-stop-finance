import json
from redis.asyncio import Redis
from app.integrations.yfinance_client import fetch_market_indices
from app.integrations.news_client import fetch_market_news

INDICES_KEY = "public:market-indices"
NEWS_KEY    = "public:news-feed"
INDICES_TTL = 60     # seconds
NEWS_TTL    = 300    # seconds


async def get_market_summary(redis: Redis) -> list[dict]:
    cached = await redis.get(INDICES_KEY)
    if cached:
        return json.loads(cached)
    data = await fetch_market_indices()
    if data:
        await redis.setex(INDICES_KEY, INDICES_TTL, json.dumps(data))
    return data


async def get_news_feed(redis: Redis, limit: int = 24) -> list[dict]:
    cached = await redis.get(NEWS_KEY)
    if cached:
        return json.loads(cached)[:limit]
    data = await fetch_market_news(limit)
    if data:
        await redis.setex(NEWS_KEY, NEWS_TTL, json.dumps(data))
    return data

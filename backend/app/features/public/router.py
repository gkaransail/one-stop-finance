from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/theme-intelligence")
async def get_theme_intelligence():
    """All 25 theme scores — unauthenticated, powers landing page hero section."""
    return build_response({"message": "Theme intelligence coming soon", "themes": []})


@router.get("/market-summary")
async def get_market_summary():
    """Live market indices + VIX — unauthenticated, powers landing page top bar."""
    return build_response({"message": "Market summary coming soon", "indices": []})


@router.get("/news-feed")
async def get_news_feed():
    """Latest 6 news articles with sentiment — unauthenticated, landing page."""
    return build_response({"message": "News feed coming soon", "articles": []})


@router.get("/insider-highlights")
async def get_insider_highlights():
    """Top 5 recent insider buys — unauthenticated, landing page."""
    return build_response({"message": "Insider highlights coming soon", "trades": []})

import asyncio
import hashlib
import re
from datetime import datetime, timezone

import feedparser

FEEDS = [
    "https://finance.yahoo.com/rss/topfinstories",
    "https://feeds.finance.yahoo.com/rss/2.0/headline?s=%5EGSPC&region=US&lang=en-US",
]

_TAG_RE = re.compile(r"<[^>]+>")


def _clean(text: str) -> str:
    return _TAG_RE.sub("", text).strip()


def _parse_time(entry: dict) -> str:
    try:
        t = entry.get("published_parsed")
        if t:
            return datetime(*t[:6], tzinfo=timezone.utc).isoformat()
    except Exception:
        pass
    return datetime.now(timezone.utc).isoformat()


def _fetch_news_sync(limit: int = 24) -> list[dict]:
    seen: set[str] = set()
    items: list[dict] = []

    for url in FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                link  = entry.get("link", "").strip()
                title = _clean(entry.get("title", ""))
                if not title or not link:
                    continue
                uid = hashlib.md5(link.encode()).hexdigest()
                if uid in seen:
                    continue
                seen.add(uid)

                # Thumbnail from media:content or enclosure
                thumbnail: str | None = None
                if hasattr(entry, "media_content") and entry.media_content:
                    thumbnail = entry.media_content[0].get("url")
                elif hasattr(entry, "enclosures") and entry.enclosures:
                    thumbnail = entry.enclosures[0].get("href")

                # Source name
                source = "Yahoo Finance"
                src = entry.get("source", {})
                if isinstance(src, dict) and src.get("title"):
                    source = src["title"]

                # Short summary
                raw_summary = entry.get("summary", entry.get("description", ""))
                summary = _clean(raw_summary)[:220] if raw_summary else ""

                items.append({
                    "id":           uid,
                    "title":        title,
                    "url":          link,
                    "source":       source,
                    "summary":      summary,
                    "published_at": _parse_time(entry),
                    "thumbnail":    thumbnail,
                })
        except Exception:
            pass

    items.sort(key=lambda x: x["published_at"], reverse=True)
    return items[:limit]


async def fetch_market_news(limit: int = 24) -> list[dict]:
    return await asyncio.to_thread(_fetch_news_sync, limit)

import asyncio
import yfinance as yf

MARKET_INDICES = [
    {"symbol": "^GSPC", "name": "S&P 500",      "short": "SPX"},
    {"symbol": "^IXIC", "name": "NASDAQ",        "short": "NDX"},
    {"symbol": "^DJI",  "name": "DOW Jones",     "short": "DJI"},
    {"symbol": "^RUT",  "name": "Russell 2000",  "short": "RUT"},
    {"symbol": "^VIX",  "name": "VIX",           "short": "VIX"},
]


def _fetch_indices_sync() -> list[dict]:
    result = []
    for idx in MARKET_INDICES:
        try:
            fi = yf.Ticker(idx["symbol"]).fast_info
            price = round(float(fi.last_price or 0), 2)
            prev  = round(float(fi.previous_close or price), 2)
            change = round(price - prev, 2)
            change_pct = round((change / prev) * 100, 2) if prev else 0.0
            result.append({
                "symbol":     idx["symbol"],
                "name":       idx["name"],
                "short":      idx["short"],
                "price":      price,
                "change":     change,
                "change_pct": change_pct,
            })
        except Exception:
            pass
    return result


async def fetch_market_indices() -> list[dict]:
    return await asyncio.to_thread(_fetch_indices_sync)

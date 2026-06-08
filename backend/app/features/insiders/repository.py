from datetime import datetime, timedelta, timezone

from sqlalchemy import select, desc, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.insider import InsiderFiling, TransactionType


def _filing_to_dict(f: InsiderFiling) -> dict:
    return {
        "id": f.id,
        "symbol": f.symbol,
        "issuer_name": f.issuer_name,
        "insider_name": f.insider_name,
        "insider_title": f.insider_title,
        "transaction_type": f.transaction_type.value,
        "shares": f.shares,
        "price_per_share": f.price_per_share,
        "total_value": f.total_value,
        "is_open_market": f.is_open_market,
        "is_congress": f.is_congress,
        "signal_score": f.signal_score,
        "filing_date": f.filing_date.isoformat() if f.filing_date else None,
        "transaction_date": f.transaction_date.isoformat() if f.transaction_date else None,
        "sec_filing_url": f.sec_filing_url,
    }


async def get_insider_feed(
    db: AsyncSession,
    *,
    transaction_type: str = "buy",   # "buy" | "sell" | "all"
    congress_only: bool = False,
    open_market_only: bool = True,
    min_value: float = 0,
    days: int = 30,
    page: int = 1,
    per_page: int = 25,
) -> tuple[list[dict], int]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    filters = [InsiderFiling.filing_date >= cutoff]

    if transaction_type == "buy":
        filters.append(InsiderFiling.transaction_type == TransactionType.BUY)
    elif transaction_type == "sell":
        filters.append(InsiderFiling.transaction_type == TransactionType.SELL)

    if congress_only:
        filters.append(InsiderFiling.is_congress == True)
    if open_market_only and transaction_type != "sell":
        filters.append(InsiderFiling.is_open_market == True)
    if min_value > 0:
        filters.append(InsiderFiling.total_value >= min_value)

    count_stmt = select(func.count()).select_from(InsiderFiling).where(*filters)
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * per_page
    stmt = (
        select(InsiderFiling)
        .where(*filters)
        .order_by(desc(InsiderFiling.filing_date), desc(InsiderFiling.signal_score))
        .offset(offset)
        .limit(per_page)
    )
    filings = (await db.execute(stmt)).scalars().all()

    return [_filing_to_dict(f) for f in filings], total


async def get_cluster_buys(db: AsyncSession, days: int = 30, min_insiders: int = 2) -> list[dict]:
    """Companies where multiple insiders bought in the last `days` days."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    stmt = (
        select(
            InsiderFiling.symbol,
            InsiderFiling.issuer_name,
            func.count(InsiderFiling.id).label("insider_count"),
            func.sum(InsiderFiling.total_value).label("total_value"),
            func.max(InsiderFiling.signal_score).label("max_score"),
            func.max(InsiderFiling.filing_date).label("latest_filing"),
        )
        .where(
            InsiderFiling.transaction_type == TransactionType.BUY,
            InsiderFiling.is_open_market == True,
            InsiderFiling.filing_date >= cutoff,
        )
        .group_by(InsiderFiling.symbol, InsiderFiling.issuer_name)
        .having(func.count(InsiderFiling.id) >= min_insiders)
        .order_by(desc("insider_count"), desc("total_value"))
        .limit(20)
    )
    rows = (await db.execute(stmt)).all()

    return [
        {
            "symbol": r.symbol,
            "issuer_name": r.issuer_name,
            "insider_count": r.insider_count,
            "total_value": float(r.total_value or 0),
            "max_score": r.max_score,
            "latest_filing": r.latest_filing.isoformat() if r.latest_filing else None,
        }
        for r in rows
    ]


async def get_top_insider_buys(db: AsyncSession, limit: int = 5, days: int = 30) -> list[dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    stmt = (
        select(InsiderFiling)
        .where(
            InsiderFiling.transaction_type == TransactionType.BUY,
            InsiderFiling.is_open_market == True,
            InsiderFiling.filing_date >= cutoff,
            InsiderFiling.total_value.isnot(None),
        )
        .order_by(desc(InsiderFiling.signal_score), desc(InsiderFiling.total_value))
        .limit(limit)
    )
    filings = (await db.execute(stmt)).scalars().all()
    return [_filing_to_dict(f) for f in filings]

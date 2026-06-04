import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, Integer, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, new_uuid


class TransactionType(str, enum.Enum):
    BUY = "buy"
    SELL = "sell"
    EXERCISE = "exercise"


class InsiderFiling(Base, TimestampMixin):
    __tablename__ = "insider_filings"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_uuid)
    symbol: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    issuer_name: Mapped[str | None] = mapped_column(String(255))
    insider_name: Mapped[str] = mapped_column(String(255), nullable=False)
    insider_title: Mapped[str | None] = mapped_column(String(255))
    transaction_type: Mapped[TransactionType] = mapped_column(Enum(TransactionType), nullable=False)
    shares: Mapped[float | None] = mapped_column(Float)
    price_per_share: Mapped[float | None] = mapped_column(Float)
    total_value: Mapped[float | None] = mapped_column(Float)
    is_open_market: Mapped[bool] = mapped_column(Boolean, default=True)
    is_congress: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    filing_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    transaction_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    signal_score: Mapped[int | None] = mapped_column(SmallInteger, index=True)
    sec_filing_url: Mapped[str | None] = mapped_column(String(500))
    sec_accession_number: Mapped[str | None] = mapped_column(String(50), unique=True)

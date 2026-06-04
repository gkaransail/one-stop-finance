import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, JSON, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, new_uuid


class ConvergenceLevel(str, enum.Enum):
    ALERT = "alert"
    WATCH = "watch"
    QUIET = "quiet"


class Theme(Base, TimestampMixin):
    __tablename__ = "themes"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(String(500))
    category: Mapped[str | None] = mapped_column(String(50), index=True)
    benchmark_etf: Mapped[str | None] = mapped_column(String(10))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tickers: Mapped[list["ThemeTicker"]] = relationship("ThemeTicker", back_populates="theme")
    score: Mapped["ThemeScore"] = relationship("ThemeScore", back_populates="theme", uselist=False)
    watchers: Mapped[list["UserThemeWatchlist"]] = relationship("UserThemeWatchlist", back_populates="theme")


class ThemeTicker(Base):
    __tablename__ = "theme_tickers"
    __table_args__ = (UniqueConstraint("theme_id", "symbol"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_uuid)
    theme_id: Mapped[str] = mapped_column(String, ForeignKey("themes.id"), nullable=False, index=True)
    symbol: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    company_name: Mapped[str | None] = mapped_column(String(255))
    market_cap_tier: Mapped[str | None] = mapped_column(String(10))  # large, mid, small
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    theme: Mapped["Theme"] = relationship("Theme", back_populates="tickers")


class ThemeScore(Base):
    __tablename__ = "theme_scores"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_uuid)
    theme_id: Mapped[str] = mapped_column(String, ForeignKey("themes.id"), unique=True, nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    level: Mapped[ConvergenceLevel] = mapped_column(
        Enum(ConvergenceLevel), default=ConvergenceLevel.QUIET
    )
    unique_companies_buying: Mapped[int] = mapped_column(Integer, default=0)
    total_value_accumulated: Mapped[float] = mapped_column(Float, default=0.0)
    csuite_count: Mapped[int] = mapped_column(Integer, default=0)
    congress_signal: Mapped[bool] = mapped_column(Boolean, default=False)
    unusual_options_count: Mapped[int] = mapped_column(Integer, default=0)
    sentiment_signal: Mapped[bool] = mapped_column(Boolean, default=False)
    signal_breakdown: Mapped[dict | None] = mapped_column(JSON)
    scored_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    theme: Mapped["Theme"] = relationship("Theme", back_populates="score")


class UserThemeWatchlist(Base):
    __tablename__ = "user_theme_watchlist"
    __table_args__ = (UniqueConstraint("user_id", "theme_id"),)

    id: Mapped[str] = mapped_column(String, primary_key=True, default=new_uuid)
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False, index=True)
    theme_id: Mapped[str] = mapped_column(String, ForeignKey("themes.id"), nullable=False)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="theme_watchlist")
    theme: Mapped["Theme"] = relationship("Theme", back_populates="watchers")

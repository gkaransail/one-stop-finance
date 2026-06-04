# One Stop Finance — Technical Architecture

## Overview

One Stop Finance is a real-time financial web platform with 5 core features: Options Chain Analysis, Insider Trades, Sentiment Analysis, Trend Reversal, and Theme Heatmap. All features start free. The architecture uses a **feature-flag system** so any feature can be moved behind a Pro paywall with a single config change — no code rewrites. The platform is real-time from day 1 using WebSocket + Celery workers.

---

## Repository Structure (Monorepo)

```
one-stop-finance/
├── frontend/              # Next.js 14 App Router (TypeScript)
├── backend/               # FastAPI (Python 3.12)
├── shared/                # TypeScript types shared between web + mobile
├── docker-compose.yml     # Local dev: Postgres + Redis + backend + workers
├── Makefile               # make dev | migrate | test | train-models
├── .env.example
├── architecture.md        # This file
└── plan.md                # Feature plan and phase breakdown
```

---

## Frontend Architecture

### Stack
| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui + Tailwind CSS |
| Charts | TradingView Lightweight Charts (open source, WebGL) |
| Server state | TanStack Query v5 (React Query) |
| Global state | Zustand |
| HTTP client | Axios with JWT interceptors |
| Auth | Custom JWT (no third-party vendor) |
| Payments | Stripe.js |

### Color Palette (Dark Theme)
| Token | Value | Use |
|---|---|---|
| `--bg-app` | `#0A0A14` | Page background |
| `--bg-card` | `#111122` | Card/panel background |
| `--bg-sidebar` | `#0D0D1D` | Left sidebar |
| `--accent` | `#7C3AED` | Purple — buttons, active states, badges |
| `--green` | `#22C55E` | Price up, bullish signals |
| `--red` | `#EF4444` | Price down, bearish signals |
| `--text-primary` | `#F1F5F9` | Main text |
| `--text-muted` | `#64748B` | Secondary text |
| `--border` | `#1E1E35` | Card borders |

Fonts: Inter (body) + JetBrains Mono (numbers, prices, tickers)

### Directory Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js route segments ONLY — no logic here
│   │   ├── layout.tsx              # Root layout (fonts, providers, QueryClientProvider)
│   │   ├── page.tsx                # Public landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── (app)/                  # Protected routes — middleware guards this group
│   │       ├── layout.tsx          # App shell (sidebar + topbar with search)
│   │       ├── dashboard/page.tsx  # Default view: heatmap + market overview
│   │       ├── options/
│   │       │   ├── page.tsx        # Options — search prompt
│   │       │   └── [symbol]/page.tsx
│   │       ├── insiders/page.tsx
│   │       ├── sentiment/
│   │       │   ├── page.tsx
│   │       │   └── [symbol]/page.tsx
│   │       ├── trend/
│   │       │   ├── page.tsx
│   │       │   └── [symbol]/page.tsx
│   │       └── heatmap/page.tsx
│   │
│   ├── features/                   # ALL feature logic — mirrors backend features/
│   │   ├── landing/                # Public landing page widgets
│   │   │   ├── components/
│   │   │   │   ├── MarketIndicesBar.tsx
│   │   │   │   ├── SectorHeatmapPreview.tsx
│   │   │   │   └── InsiderHighlights.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useMarketSummary.ts
│   │   │   │   └── useInsiderHighlights.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── components/         # LoginForm, RegisterForm
│   │   │   ├── hooks/              # useAuth, useCurrentUser
│   │   │   ├── store.ts            # Zustand auth store
│   │   │   └── api.ts
│   │   │
│   │   ├── subscription/
│   │   │   ├── components/
│   │   │   │   ├── ProGate.tsx     # Reads FEATURE_FLAGS — single gating component
│   │   │   │   ├── UpgradePrompt.tsx
│   │   │   │   └── PricingCard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useSubscription.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── market/                 # Theme heatmap feature
│   │   │   ├── components/
│   │   │   │   ├── SectorHeatmap.tsx
│   │   │   │   ├── ThemeHeatmap.tsx
│   │   │   │   └── SectorDrilldown.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSectorPerformance.ts
│   │   │   │   └── useThemePerformance.ts
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── options/
│   │   │   ├── components/
│   │   │   │   ├── OptionsChainTable.tsx
│   │   │   │   ├── IVSurfaceChart.tsx
│   │   │   │   ├── MaxPainChart.tsx
│   │   │   │   ├── GEXChart.tsx
│   │   │   │   └── UnusualActivityFeed.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useOptionsChain.ts
│   │   │   │   └── useOptionsAnalytics.ts
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── insiders/
│   │   │   ├── components/
│   │   │   │   ├── InsiderFeed.tsx
│   │   │   │   ├── SignalScoreBadge.tsx
│   │   │   │   └── ClusterBuysPanel.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useInsiderFeed.ts
│   │   │   │   └── useInsiderScore.ts
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── sentiment/
│   │   │   ├── components/
│   │   │   │   ├── SentimentGauge.tsx
│   │   │   │   ├── HeadlineList.tsx
│   │   │   │   ├── SentimentChart.tsx
│   │   │   │   └── TrendingTickers.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSentiment.ts
│   │   │   │   └── useTrendingTickers.ts
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── trend/                  # Trend reversal feature
│   │   │   ├── components/
│   │   │   │   ├── TrendChart.tsx          # Candlestick + indicator overlays
│   │   │   │   ├── SignalMarkers.tsx        # Arrows/flags on chart
│   │   │   │   ├── SignalCardList.tsx       # Signal summary cards
│   │   │   │   └── ReversalScanner.tsx     # Market-wide scanner
│   │   │   ├── hooks/
│   │   │   │   ├── useTrendSignals.ts
│   │   │   │   └── useReversalScanner.ts
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   │
│   │   └── search/                 # Global ticker search
│   │       ├── components/
│   │       │   ├── TickerSearch.tsx        # Cmd+K command palette
│   │       │   └── SearchResult.tsx
│   │       ├── hooks/
│   │       │   └── useTickerSearch.ts
│   │       └── api.ts
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui generated components
│   │   ├── layout/                 # Sidebar, Topbar, AppShell
│   │   ├── charts/                 # CandlestickChart, LineChart, HeatmapChart (wrappers)
│   │   └── common/                 # LoadingSpinner, ErrorBoundary, EmptyState
│   │
│   ├── lib/
│   │   ├── api-client.ts           # Axios base + JWT interceptor (CRITICAL — built first)
│   │   ├── query-client.ts         # TanStack Query client config
│   │   ├── stripe.ts               # Stripe.js loader
│   │   └── utils.ts                # cn(), formatCurrency(), formatPercent(), formatLargeNum()
│   │
│   ├── config/
│   │   └── feature-flags.ts        # FEATURE_FLAGS — single file to toggle free/pro per feature
│   │
│   ├── stores/
│   │   ├── auth.store.ts           # User + tokens
│   │   ├── ui.store.ts             # Sidebar collapsed, theme
│   │   └── realtime.store.ts       # Live quote updates from WebSocket
│   │
│   ├── hooks/
│   │   ├── useWebSocket.ts         # WebSocket connection + subscribe/unsubscribe
│   │   └── useMediaQuery.ts
│   │
│   └── types/
│       └── index.ts                # Re-exports from shared/ + frontend-specific types
│
├── middleware.ts                   # Redirect unauthenticated users from (app)/* to /login
├── next.config.ts                  # Rewrites: /api/v1/* → BACKEND_URL (hides backend, no CORS)
├── tailwind.config.ts
├── components.json                 # shadcn/ui config
└── package.json
```

---

### Feature Flag System

All 5 features start as `"free"`. Flip any to `"pro"` in one place — the `ProGate` component and `require_feature()` dependency handle the rest automatically.

**`src/config/feature-flags.ts`**:
```typescript
export const FEATURE_FLAGS = {
  optionsChain:      "free",   // "free" | "pro"
  insiderTrades:     "free",
  sentimentAnalysis: "free",
  trendReversal:     "free",
  themeHeatmap:      "free",
} as const;

export type FeatureKey = keyof typeof FEATURE_FLAGS;
```

**`src/features/subscription/components/ProGate.tsx`**:
```tsx
import { FEATURE_FLAGS, FeatureKey } from "@/config/feature-flags";
import { useSubscription } from "../hooks/useSubscription";

interface ProGateProps {
  feature: FeatureKey;
  mode?: "blur" | "lock" | "inline";
  children: React.ReactNode;
}

export function ProGate({ feature, mode = "blur", children }: ProGateProps) {
  const { isPro } = useSubscription();
  const requiredTier = FEATURE_FLAGS[feature];

  // Feature is free — always render children
  if (requiredTier === "free") return <>{children}</>;

  // Feature is pro — render children if user is pro, else show gate
  if (isPro) return <>{children}</>;

  if (mode === "blur") return (
    <div className="relative">
      <div className="blur-sm opacity-60 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <UpgradePrompt feature={feature} />
      </div>
    </div>
  );

  if (mode === "lock") return <UpgradePrompt feature={feature} size="full" />;
  return <span className="text-amber-500">🔒</span>;
}
```

### API Client Pattern

Every feature's `api.ts` imports from `lib/api-client.ts`. No feature makes raw fetch calls.

```typescript
// lib/api-client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api/v1",
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("osf_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// 401 interceptor: attempt silent refresh → redirect to /login
```

### App Shell Layout

**Sidebar** (left, collapsible to icon-only):
- Logo + "One Stop Finance" text
- Primary nav:
  - Theme Heatmap
  - Options Chain
  - Insider Trades
  - Sentiment
  - Trend Reversal
- Divider → Settings, Profile, Sign Out
- Bottom: "Upgrade to Pro" pill (shown to all users, activates when Pro is enabled)

**Top Bar**:
- Global ticker search (`Cmd+K` opens command palette)
- Live indices strip: S&P 500, NASDAQ, DOW, VIX — updates every 30s via WebSocket
- Notification bell
- User avatar + tier badge

### Ticker Search

Global `Cmd+K` search accessible from any page:
- Searches by symbol or company name against pre-seeded `tickers` table (~1500 entries)
- Context-aware navigation: on the Options Chain page, selecting a ticker loads that ticker's chain
- Recent searches stored in localStorage
- `GET /api/v1/search?q=AAPL` — returns matches within 200ms (DB index on symbol + name)

---

## Backend Architecture

### Stack
| Concern | Choice |
|---|---|
| Framework | FastAPI (async) |
| Language | Python 3.12 |
| ORM | SQLAlchemy 2.0 (async) |
| Migrations | Alembic |
| Validation | Pydantic v2 |
| Auth | python-jose (JWT) + bcrypt |
| Background jobs | Celery + Redis Beat |
| Cache + pub/sub | Redis |
| Database | PostgreSQL 16 |
| Technical indicators | pandas-ta (computed locally, no API cost) |
| NLP sentiment | FinBERT (HuggingFace, runs locally) |
| Package manager | Poetry |

### Directory Structure

```
backend/
├── app/
│   ├── main.py                     # App factory, lifespan, router registration
│   ├── config.py                   # Pydantic Settings — reads .env
│   ├── database.py                 # SQLAlchemy async engine + session factory
│   ├── redis.py                    # Redis client singleton
│   ├── celery_app.py               # Celery app + beat schedule
│   │
│   ├── core/                       # CRITICAL — build this first, everything depends on it
│   │   ├── dependencies.py         # get_db, get_current_user, require_feature()
│   │   ├── feature_flags.py        # FEATURE_FLAGS dict — single place to toggle free/pro
│   │   ├── response.py             # build_response(), build_paginated_response(), ApiResponse
│   │   ├── security.py             # JWT encode/decode, bcrypt hash/verify
│   │   ├── middleware.py           # RateLimitMiddleware, RequestLogging
│   │   └── exceptions.py           # AppException, http_exception_handler
│   │
│   ├── models/                     # SQLAlchemy ORM models only
│   │   ├── base.py                 # DeclarativeBase, TimestampMixin
│   │   ├── user.py
│   │   ├── subscription.py         # tier: Enum("free", "pro"), Stripe IDs
│   │   ├── ticker.py               # Reference table: symbol, name, exchange, sector
│   │   └── insider_filing.py       # Parsed Form 4 data stored in DB
│   │
│   ├── features/                   # ONE directory per product feature
│   │   ├── auth/                   # register, login, refresh, verify email
│   │   ├── billing/                # Stripe checkout, webhooks, portal
│   │   ├── public/                 # Unauthenticated landing page endpoints
│   │   ├── market/                 # Theme heatmap: sectors + themes performance
│   │   ├── options/                # Chain, greeks, IV surface, max pain, GEX, unusual
│   │   ├── insiders/               # Form 4 feed, signal scorer, cluster buys
│   │   ├── sentiment/              # News fetch + FinBERT scoring per ticker
│   │   ├── trend/                  # OHLCV + pandas-ta indicators + reversal detection
│   │   ├── search/                 # Ticker typeahead
│   │   └── realtime/               # WebSocket handler
│   │
│   ├── integrations/               # Third-party API clients — thin wrappers only
│   │   ├── yfinance_client.py      # Primary: quotes, OHLCV, options, sector ETFs
│   │   ├── sec_edgar.py            # Form 4 XML feed parser
│   │   ├── news_client.py          # NewsAPI + RSS feed aggregator
│   │   └── polygon.py              # Phase 3+: real-time quotes (paid, swap-in only)
│   │
│   ├── ml/                         # Phase 3+ ML models (stubbed in Phase 1)
│   │   ├── models/                 # Serialized .pkl / .joblib files
│   │   ├── features/               # Feature engineering functions
│   │   ├── predictors/             # Model wrapper classes
│   │   └── training/               # Offline training scripts (not in production)
│   │
│   └── workers/                    # Celery tasks (Phase 1)
│       ├── market_data.py          # Sector/theme ETF fetch every 5 min
│       ├── market_indices.py       # Market indices + VIX every 30s
│       ├── options_data.py         # Cache active options chains every 60s
│       ├── insider_data.py         # Poll SEC EDGAR Form 4 every 15 min
│       ├── sentiment.py            # Fetch news + FinBERT score every 3 min
│       ├── trend_signals.py        # Recompute reversal signals every 15 min
│       └── realtime_push.py        # Push quote updates to WebSocket every 15s
│
├── alembic/
│   └── versions/
├── tests/
│   └── features/
├── pyproject.toml
└── Dockerfile
```

---

### Feature Flag System (Backend)

**`app/core/feature_flags.py`**:
```python
FEATURE_FLAGS: dict[str, str] = {
    "options_chain":       "free",   # change to "pro" to gate
    "insider_trades":      "free",
    "sentiment_analysis":  "free",
    "trend_reversal":      "free",
    "theme_heatmap":       "free",
}

async def require_feature(feature: str):
    """FastAPI dependency that enforces feature-level access control."""
    async def check(current_user: User = Depends(get_current_user)):
        tier_required = FEATURE_FLAGS.get(feature, "pro")
        if tier_required == "pro" and current_user.subscription.tier != "pro":
            raise HTTPException(status_code=403, detail={
                "code": "SUBSCRIPTION_REQUIRED",
                "feature": feature,
                "upgrade_url": "/pricing",
            })
        return current_user
    return check

# Usage — one line gates any route:
@router.get("/{symbol}/chain", dependencies=[Depends(require_feature("options_chain"))])
async def get_options_chain(symbol: str, ...):
    ...
```

---

### Feature Module Pattern (Strict)

Every feature = 4 files. No exceptions.

```
features/<name>/
├── __init__.py
├── router.py      # FastAPI routes + require_feature() dependency
├── service.py     # Business logic — calls repo + integrations
├── repository.py  # DB queries + Redis cache R/W only
└── schemas.py     # Pydantic v2 request/response models
```

Register in `main.py` only — one line per feature:
```python
from app.features.options.router import router as options_router
app.include_router(options_router, prefix="/api/v1")
```

---

### Response Envelope

All endpoints return the same shape:

```python
# Success
{"data": <payload>, "error": None, "meta": None}

# Paginated
{"data": [<items>], "error": None, "meta": {"page": 1, "per_page": 20, "total": 342}}

# Error
{"data": None, "error": {"code": "NOT_FOUND", "message": "..."}, "meta": None}
```

---

### Auth (JWT)

```
POST /api/v1/auth/register → create user + free subscription → return tokens
POST /api/v1/auth/login    → verify password → return access_token (15min) + refresh_token (30d)
POST /api/v1/auth/refresh  → validate refresh_token → return new access_token

JWT payload: { sub: user_id, email, tier: "free"|"pro", exp }
```

Tier embedded in JWT — no DB lookup per request. Stripe webhook updates DB; new tier picked up on next refresh.

---

## Database Schema

All tables: UUID PKs, `created_at`/`updated_at` via `TimestampMixin`. Migrations via Alembic.

### Phase 1 Tables

#### users
```sql
id UUID PK, email VARCHAR(255) UNIQUE NOT NULL,
hashed_password VARCHAR NOT NULL, full_name VARCHAR(255),
is_active BOOL DEFAULT TRUE, is_verified BOOL DEFAULT FALSE
```

#### subscriptions (1:1 with users)
```sql
id UUID PK, user_id UUID FK UNIQUE,
tier ENUM('free','pro') DEFAULT 'free',
status ENUM('active','past_due','canceled','trialing'),
stripe_customer_id VARCHAR UNIQUE, stripe_subscription_id VARCHAR UNIQUE,
current_period_end TIMESTAMPTZ, cancel_at_period_end BOOL DEFAULT FALSE
```

#### themes (25 theme definitions — seeded at startup)
```sql
id UUID PK,
name VARCHAR(100) UNIQUE NOT NULL,       -- "AI Infrastructure"
slug VARCHAR(100) UNIQUE NOT NULL,       -- "ai-infrastructure"
description TEXT,
category VARCHAR(50),                    -- "Technology", "Energy", "Healthcare" etc.
benchmark_etf VARCHAR(10),              -- "BOTZ", "NLR", "ARKG" etc.
is_active BOOL DEFAULT TRUE
```

#### theme_tickers (our proprietary ticker basket — one row per ticker-theme pair)
```sql
id UUID PK,
theme_id UUID FK → themes.id,
symbol VARCHAR(10) NOT NULL,
company_name VARCHAR(255),
market_cap_tier ENUM('large','mid','small'),   -- for filtering
is_active BOOL DEFAULT TRUE,
UNIQUE(theme_id, symbol)
INDEX(symbol), INDEX(theme_id)
```

#### theme_scores (latest computed score per theme — updated every 15 min)
```sql
id UUID PK,
theme_id UUID FK → themes.id UNIQUE,
score NUMERIC(5,2),                         -- 0.00 to 100.00
level ENUM('alert','watch','quiet'),
unique_companies_buying SMALLINT,           -- key driver of base score
total_value_accumulated NUMERIC(18,2),      -- total $ in insider buys
csuite_count SMALLINT,
congress_signal BOOL DEFAULT FALSE,
unusual_options_count SMALLINT,
sentiment_signal BOOL DEFAULT FALSE,
signal_breakdown JSONB,                     -- full breakdown for UI
scored_at TIMESTAMPTZ,
INDEX(score DESC), INDEX(level)
```

#### user_theme_watchlist (which themes a user is watching)
```sql
id UUID PK,
user_id UUID FK → users.id,
theme_id UUID FK → themes.id,
added_at TIMESTAMPTZ,
UNIQUE(user_id, theme_id)
```

#### tickers (reference / seed data — ~1500 tickers for search)
```sql
id UUID PK, symbol VARCHAR(10) UNIQUE NOT NULL,
name VARCHAR(255) NOT NULL, exchange VARCHAR(20),
sector VARCHAR(100), industry VARCHAR(100),
INDEX(symbol), INDEX(name)
```

#### insider_filings (parsed Form 4 — shared by Insider Trades + Theme Intelligence)
```sql
id UUID PK, symbol VARCHAR(10), issuer_name VARCHAR(255),
insider_name VARCHAR(255), insider_title VARCHAR(255),
transaction_type ENUM('buy','sell','exercise'),
shares NUMERIC(18,0), price_per_share NUMERIC(18,4),
total_value NUMERIC(18,2), is_open_market BOOL,
filing_date TIMESTAMPTZ, transaction_date TIMESTAMPTZ,
signal_score SMALLINT,                      -- 0-100, computed on insert
sec_filing_url VARCHAR,
INDEX(symbol), INDEX(filing_date DESC), INDEX(signal_score DESC)
```

---

## Real-Time Architecture

Real-time from day 1. Every page updates without manual refresh.

```
Browser ←→ FastAPI WebSocket (/ws/v1/connect?token=<jwt>)
                    ↕
             Redis Pub/Sub
                    ↑
             Celery Workers
```

**Channels**:
- `quotes:{SYMBOL}` — price/change updates, pushed every 15s
- `insiders:new` — new Form 4 filing parsed, broadcast to all subscribers
- `signals:{SYMBOL}` — new trend reversal signal detected

**WebSocket message types**:
```json
{ "type": "QUOTE_UPDATE",    "payload": { "symbol": "AAPL", "price": 189.23, "change": 1.2 } }
{ "type": "INSIDER_FILING",  "payload": { "symbol": "MSFT", "insider": "...", "score": 85 } }
{ "type": "SIGNAL_DETECTED", "payload": { "symbol": "TSLA", "signal": "bullish-divergence" } }
```

---

## Background Workers (Celery Beat — Phase 1)

Workers are organized so Theme Intelligence **consumes data already collected** by other workers — no duplicate API calls.

```
insider_data.poll_sec_edgar  ──┐
options_data.cache_unusual   ──┼──► theme_intelligence.score  ──► WebSocket push
sentiment.fetch_and_score    ──┘                                   + alert notifications
```

| Worker | Schedule | Feeds Into |
|---|---|---|
| `market_indices.fetch` | Every 30s | Landing page top bar, dashboard |
| `insider_data.poll_sec_edgar` | Every 15 min | `insider_filings` table → Theme Intelligence + Insider Trades feature |
| `options_data.cache_unusual` | Every 60s | Redis `options:unusual:{symbol}` → Theme Intelligence + Options Chain feature |
| `sentiment.fetch_and_score` | Every 3 min | Redis `sentiment:{symbol}` → Theme Intelligence + Sentiment feature + Landing page news |
| `theme_intelligence.score` | Every 15 min | Reads insider + options + sentiment data → scores all 25 themes → `theme_scores` table + Redis |
| `trend_signals.scan` | Every 15 min | `yfinance` OHLCV → `pandas-ta` → Redis `signals:{symbol}` |
| `realtime_push.quotes` | Every 15s (market hours) | Redis quote cache → WebSocket `quotes:{symbol}` channel |

### Theme Scoring Worker Detail (`workers/theme_intelligence.py`)
```python
async def score_all_themes():
    themes = await db.get_all_active_themes()

    for theme in themes:
        tickers = await db.get_theme_tickers(theme.id)
        symbols = [t.symbol for t in tickers]

        # Pull data already collected by other workers
        insider_buys = await db.get_recent_insider_buys(symbols, days=14)
        unusual_options = await redis.get_unusual_options_batch(symbols)
        sentiment_scores = await redis.get_sentiment_batch(symbols)
        congress_trades = await db.get_recent_congress_trades(symbols, days=14)

        # Score
        score, breakdown = compute_theme_score(
            insider_buys, unusual_options, sentiment_scores, congress_trades
        )

        # Persist
        await db.upsert_theme_score(theme.id, score, breakdown)
        await redis.set(f"theme:{theme.slug}:score", score, ttl=900)

        # Notify users watching this theme if it crossed Alert threshold
        if score >= 70 and prev_score < 70:
            await notify_theme_watchers(theme.id, score)

        # Push WebSocket update if score changed meaningfully
        if abs(score - prev_score) >= 5:
            await ws_publish(f"theme:{theme.slug}", {"score": score, "level": level})
```

---

## Data Sources (Phase 1 — $0 Cost)

| Feature | Source | Auth | Rate Limit |
|---|---|---|---|
| Quotes, OHLCV, options, ETFs | yfinance | None | Generous |
| Insider trades (Form 4) | SEC EDGAR API | None | None |
| Ticker reference data | yfinance + static seed | None | — |
| News headlines | NewsAPI + Yahoo/SA RSS | Free API key | 100/day |
| Sentiment NLP | FinBERT (local HuggingFace) | None | No limit |
| Technical indicators | pandas-ta (local) | None | No limit |
| Market indices | yfinance | None | Generous |

**Phase 3+ swap**: Replace `yfinance_client.py` with `polygon.py` in `integrations/` only. Feature services and routes unchanged.

---

## Deployment

### Vercel (Frontend)
- `next.config.ts` rewrites `/api/v1/*` → `BACKEND_URL` — no CORS, hides backend URL
- Preview deployments on every PR

### Railway / Render (Backend — 3 services)
- **api**: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`
- **worker**: `celery -A app.celery_app worker --loglevel=info`
- **beat**: `celery -A app.celery_app beat --loglevel=info`
- Managed PostgreSQL + Redis as addons

### Local Development
```bash
make dev        # docker-compose (Postgres + Redis) + uvicorn + Next.js dev server
make migrate    # alembic upgrade head
make seed       # seed tickers table (~1500 rows)
make test       # pytest + jest
```

---

## Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Python files | `snake_case` | `insider_service.py` |
| Python classes | `PascalCase` | `InsiderService`, `SignalScorer` |
| TS component files | `PascalCase` | `OptionsChainTable.tsx`, `ProGate.tsx` |
| TS lib/config files | `kebab-case` | `api-client.ts`, `feature-flags.ts` |
| TS hooks | `useCamelCase` | `useOptionsChain`, `useSentiment` |
| API routes | kebab-case plural | `/api/v1/insider-trades` |
| DB tables | `snake_case` plural | `insider_filings`, `watchlist_items` |
| Redis keys | `resource:identifier` | `quote:AAPL`, `sentiment:AAPL`, `chain:AAPL:2025-01-17` |
| Feature flags | `camelCase` (TS) / `snake_case` (Python) | `optionsChain` / `options_chain` |
| Env vars | `SCREAMING_SNAKE_CASE` | `NEWS_API_KEY`, `STRIPE_SECRET_KEY` |

---

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (`.env`)
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/osf
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=<random 64-char hex>
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEWS_API_KEY=<free from newsapi.org>
POLYGON_API_KEY=<paid — Phase 3 only>
FRONTEND_URL=http://localhost:3000
```

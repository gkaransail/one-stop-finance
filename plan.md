# One Stop Finance — Product & Development Plan

## Vision
A single real-time destination for retail traders built around a core differentiator: **Theme Intelligence** — a convergence scoring system that detects when smart money clusters around the same investment theme. Supported by options chain analysis, insider trades, sentiment analysis, and trend reversal detection. Built for phase-by-phase growth with a subscription model that can gate any feature with a single config change.

## Business Model
- **Current**: All features free (growth phase — maximize signups)
- **Future**: Any feature moveable to Pro via single feature-flag config change — no code rewrites
- **Subscription infrastructure** (Stripe) built from day 1 so Pro paywall activates at any time

---

## Phase 1 — Core Product (5 Features)

### Foundation (build first, keep minimal)
- [ ] Monorepo: `frontend/`, `backend/`, `shared/`, `docker-compose.yml`, `Makefile`
- [ ] Next.js 14 App Router (TypeScript, Tailwind, shadcn/ui)
- [ ] FastAPI backend (Python 3.12, Poetry, SQLAlchemy, Alembic)
- [ ] PostgreSQL + Redis via Docker Compose
- [ ] DB tables: `users`, `subscriptions`, `themes`, `theme_tickers`, `theme_scores`, `insider_filings`, `user_theme_watchlist`
- [ ] `app/core/` — dependencies, response builder, JWT security, feature flags, middleware
- [ ] `lib/api-client.ts` — Axios + JWT interceptor
- [ ] Auth: register, login, JWT access + refresh tokens
- [ ] Stripe billing: checkout, webhooks, portal (wired but all features free for now)
- [ ] App shell: dark sidebar + top bar with `Cmd+K` search
- [ ] Celery + Redis Beat workers
- [ ] WebSocket: `/ws/v1/connect?token=<jwt>` + Redis pub/sub

### Feature Flag System
One-line change moves any feature from free → pro.

**Backend** (`app/core/feature_flags.py`):
```python
FEATURE_FLAGS: dict[str, str] = {
    "theme_intelligence":   "free",
    "options_chain":        "free",
    "insider_trades":       "free",
    "sentiment_analysis":   "free",
    "trend_reversal":       "free",
}
```

**Frontend** (`src/config/feature-flags.ts`):
```typescript
export const FEATURE_FLAGS = {
  themeIntelligence:  "free",
  optionsChain:       "free",
  insiderTrades:      "free",
  sentimentAnalysis:  "free",
  trendReversal:      "free",
} as const;
```

`<ProGate feature="themeIntelligence">` and `Depends(require_feature("theme_intelligence"))` handle everything automatically.

---

## Feature 1: Theme Intelligence ⭐ (Main Attraction)

**This is the centerpiece of the product — and the main attraction on the landing page.**

### What It Is
A real-time convergence scoring system that detects when multiple companies within the same investment theme show coordinated smart money activity. A single insider buy is noise. Three companies in the same theme buying simultaneously is a signal. Users see which themes are accumulating smart money attention before the broader market catches on.

### Themes Covered (25 themes to start, expandable)

**Technology**
- AI Infrastructure, Semiconductors, Cybersecurity, Quantum Computing, Robotics & Automation, Cloud & SaaS, Photonics & Optical

**Energy & Resources**
- Nuclear Energy, Clean Energy & Solar, Grid Infrastructure, Oil & Gas, Uranium, Copper & Critical Minerals

**Healthcare**
- Biotech & Genomics, GLP-1 & Obesity Drugs, Oncology, Medical Devices

**Macro & Defense**
- Defense & Aerospace, Reshoring & Manufacturing, Fintech & Payments, EV & Battery Tech

**Emerging**
- Space & Satellite, Drone & Autonomous, AgriTech & Food Tech, Water Infrastructure

Each theme has:
- A curated ticker basket (15–40 stocks across large, mid, and small cap)
- An associated benchmark ETF for performance reference
- A description of what the theme represents

### Theme Ticker Baskets (Built From Scratch)
Themes and their tickers are defined in `app/core/theme_config.py`. This is our proprietary config — not seeded from any other project. Built by curating:
- ETF holdings (SOXX, BOTZ, HACK, ITA, NLR, etc.) — parse their top holdings
- Sector + industry filtering via yfinance metadata
- Manual curation for quality (no penny stocks under $50M market cap by default)

```python
# app/core/theme_config.py
THEMES: dict[str, dict] = {
    "AI Infrastructure": {
        "description": "Companies building compute, data centers, and networking for AI workloads",
        "benchmark_etf": "BOTZ",
        "tickers": ["NVDA", "AMD", "MSFT", "GOOGL", "META", "DELL", "SMCI", ...],
    },
    "Nuclear Energy": {
        "description": "Uranium miners, reactor operators, and nuclear technology developers",
        "benchmark_etf": "NLR",
        "tickers": ["CEG", "VST", "CCJ", "NNE", "OKLO", "SMR", ...],
    },
    # ... 23 more themes
}
```

### Conviction Score (0–100)

**Base score** — driven by unique company count (insider buys in last 14 days):
```
6+ companies  →  50 pts
5  companies  →  42 pts
4  companies  →  34 pts
3  companies  →  25 pts    ← minimum for genuine theme signal
2  companies  →  14 pts
1  company    →   5 pts
0  companies  →   0 pts
```

**Signal bonuses** (Phase 1 signals — more added later):
```
+15 pts  Unusual options activity on 2+ theme tickers (call buying)
+12 pts  News sentiment convergence (3+ theme tickers bullish in news)
+10 pts  C-suite buyer (CEO / CFO / President)
+ 8 pts  Congress trading in same theme tickers
+ 8 pts  Large transaction ($1M+ single trade)
+ 5 pts  Cluster: 3+ insiders at same company buying
+ 5 pts  Total accumulated > $5M across theme
```

**Diversity bonus** — signal types matter as much as volume:
```
+10 pts  if 3+ different signal types firing simultaneously
```

**Cap: 100 pts**

**Convergence levels:**
- 🔴 **Alert** (≥ 70) — Strong multi-signal convergence, high conviction
- 🟡 **Watch** (45–69) — Early accumulation, worth monitoring
- ⚪ **Quiet** (< 45) — No meaningful convergence

### Backend Endpoints
```
GET /api/v1/public/theme-intelligence          # unauthenticated — all 25 themes + scores (landing page)
GET /api/v1/themes                             # all themes with scores (authenticated)
GET /api/v1/themes/{name}                      # single theme: score + all signals breakdown
GET /api/v1/themes/{name}/tickers              # all tickers in theme + their individual signals
GET /api/v1/themes/{name}/feed                 # signal feed for this theme (insider buys, options, news)
GET /api/v1/themes/alerts                      # themes currently at Alert level
POST /api/v1/themes/{name}/watch               # add to user's personal theme watchlist
DELETE /api/v1/themes/{name}/watch             # remove from watchlist
GET /api/v1/themes/watchlist                   # user's pinned themes
```

### Celery Worker
`workers/theme_intelligence.py` — runs every 15 min:
1. Pull latest insider filings from `insider_filings` table (already collected by insider worker)
2. Pull unusual options data from Redis cache (already collected by options worker)
3. Pull sentiment scores from Redis (already computed by sentiment worker)
4. Pull Congress trades from `insider_filings` (flagged separately)
5. For each theme: map tickers → group by unique company → compute score
6. Store scores in `theme_scores` table + cache in Redis (`theme:{name}:score`)
7. Push WebSocket update for any theme whose score changed by ≥ 5 pts
8. Trigger alert notification for any user watching a theme that just crossed 70

**Key efficiency**: theme scoring **reuses data already collected** by other workers. No duplicate API calls.

### Frontend (`features/themes/`)
- [ ] Theme grid: 25 cards, sortable by score / alphabetical / by category
- [ ] Each card shows: theme name, benchmark ETF % today, conviction score, convergence level badge
- [ ] Expanded card: active tickers, signal breakdown (how many insider buys, options, sentiment), last updated
- [ ] Theme detail page (`/themes/[name]`): full signal feed, ticker list, benchmark ETF chart
- [ ] "Watch" button on each theme — saves to user's personal watchlist
- [ ] User watchlist widget in sidebar: pinned themes with live score badges
- [ ] Real-time: score badge animates when score updates via WebSocket

---

## Landing Page (Theme Intelligence as Hero)

The landing page is built around Theme Intelligence. Everything else supports it.

### Section Order

**1. Navbar** — Logo, Login, "Get Started Free"

**2. Hero**
- Headline: *"See Where Smart Money Is Moving Before Everyone Else"*
- Subheadline: *"Real-time theme intelligence. When insiders, options traders, and news all point the same direction — you'll know first."*
- Single CTA: "Explore Live Themes →" (scrolls to Theme Intelligence section)
- No dashboard screenshot — the live data below IS the demo

**3. Live Market Bar** (full width, sticky-ish)
- S&P 500, NASDAQ, DOW, Russell 2000, VIX — ticking every 30s

**4. 🌟 Theme Intelligence — HERO SECTION (no login required)**

This is the largest, most prominent section on the page. Shows all 25 themes live:

```
┌─────────────────── THEME INTELLIGENCE ──────────────────────┐
│  25 investment themes. Scored by smart money convergence.   │
│  Updated every 15 minutes.                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔴 ALERT                🟡 WATCH               ⚪ QUIET    │
│                                                             │
│ ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│ │ AI Infrastructure│  │ Nuclear Energy   │  │ Clean Eng  │ │
│ │ Score: 78   ████ │  │ Score: 54   ███  │  │ Score: 22  │ │
│ │ BOTZ  +1.8% ▲    │  │ NLR   +0.9% ▲   │  │ ICLN -0.3% │ │
│ │ 4 companies      │  │ 3 companies      │  │ 1 company  │ │
│ │ $5.2M insiders   │  │ Options activity │  │            │ │
│ └──────────────────┘  └──────────────────┘  └────────────┘ │
│                                                             │
│  [View all 25 themes]  →  requires free account            │
└─────────────────────────────────────────────────────────────┘
```

- Shows all 25 themes publicly
- Cards are color-coded by level (Alert = red glow, Watch = amber, Quiet = muted)
- Each card: theme name, score, ETF performance today, company count, primary signal type
- "View signal breakdown" → opens modal teaser showing 2 signals, then "Sign up to see all →"
- Themes sorted by score (highest conviction first)

**5. Market Intelligence Strip** (2 columns)
- Left: Latest news with sentiment badges (6 articles, updated every 3 min)
- Right: Top insider buys this week (5 rows from SEC EDGAR)

**6. Other 4 Features** — brief cards
- Options Chain, Insider Trades, Sentiment, Trend Reversal
- Each: icon + 2-line description + small visual

**7. Pricing** — Free tier + Pro (coming soon)

**8. Footer**

### Landing Page Public API Endpoints
```
GET /api/v1/public/theme-intelligence    # all 25 theme scores (15 min cache)
GET /api/v1/public/market-summary        # indices + VIX (30s cache)
GET /api/v1/public/news-feed             # 6 latest articles + sentiment (3 min cache)
GET /api/v1/public/insider-highlights    # top 5 insider buys (4h cache)
```

---

## Feature 2: Options Chain Analysis

**What it is**: Full options chain for any ticker with greeks, IV, max pain, GEX, and unusual activity.

**Data source**: yfinance (free)

**Backend endpoints**:
```
GET /api/v1/options/{symbol}/chain?expiry=...
GET /api/v1/options/{symbol}/expirations
GET /api/v1/options/{symbol}/iv-surface
GET /api/v1/options/{symbol}/max-pain
GET /api/v1/options/{symbol}/gex
GET /api/v1/options/{symbol}/unusual
```

**Frontend** (`features/options/`):
- [ ] Expiry date selector
- [ ] Split chain table: Calls | Strike | Puts with columns: Bid, Ask, Last, Volume, OI, IV, Delta, Gamma, Theta, Vega
- [ ] ITM / OTM color coding
- [ ] IV surface chart
- [ ] Max pain chart
- [ ] GEX chart
- [ ] Unusual activity feed (Z-score > 2)

---

## Feature 3: Insider Trades

**What it is**: Real-time SEC Form 4 feed with algorithmic signal scoring per trade.

**Data source**: SEC EDGAR API (free)

**Signal Score** (per trade, 0–100):
- C-suite (CEO/CFO/COO): +40 pts
- Director/VP: +20 pts
- Open market purchase: +20 pts
- Cluster (2+ insiders same company, 30d): +15 pts
- First-time buyer: +10 pts
- Trade size > $500K: +15 pts

**Backend endpoints**:
```
GET /api/v1/insiders/feed?page=1&type=buy
GET /api/v1/insiders/feed?symbol=AAPL
GET /api/v1/insiders/{symbol}/score
GET /api/v1/insiders/cluster-buys
GET /api/v1/public/insider-highlights     # landing page (top 5, no auth)
```

**Frontend** (`features/insiders/`):
- [ ] Feed table: date, name, title, company, symbol, buy/sell, shares, value, signal badge
- [ ] Filters: buy/sell/all, date range, min value
- [ ] Cluster Buys tab
- [ ] Real-time new filing badge

---

## Feature 4: Sentiment Analysis

**What it is**: NLP sentiment scoring per ticker from news headlines (FinBERT, runs locally).

**Data source**: NewsAPI (free) + Yahoo Finance RSS + Seeking Alpha RSS
**Model**: FinBERT (HuggingFace, local — no API cost)

**Backend endpoints**:
```
GET /api/v1/sentiment/{symbol}
GET /api/v1/sentiment/{symbol}/history
GET /api/v1/sentiment/trending
GET /api/v1/public/news-feed             # landing page articles + sentiment
```

**Sentiment score**: weighted average of last 20 headlines, -100 to +100
- > 40 = Bullish | -40 to 40 = Neutral | < -40 = Bearish

**Frontend** (`features/sentiment/`):
- [ ] Sentiment gauge per ticker
- [ ] Headline list with per-headline sentiment badge
- [ ] 30-day sentiment history chart
- [ ] Trending tickers panel
- [ ] News articles on landing page with sentiment badges

---

## Feature 5: Trend Reversal

**What it is**: Algorithmic detection of RSI divergence, MACD crossovers, golden/death cross, and Bollinger Band breakouts on any chart.

**Data source**: yfinance (OHLCV) + pandas-ta (local, no API cost)

**Signals detected**:
- RSI bullish/bearish divergence
- MACD bull/bear crossover
- Golden cross / Death cross (50 SMA vs 200 SMA)
- Bollinger Band squeeze + breakout (with volume confirmation)

**Backend endpoints**:
```
GET /api/v1/trend/{symbol}/signals?interval=1d
GET /api/v1/trend/{symbol}/chart?interval=1d&bars=200
GET /api/v1/trend/screener?signal=bullish-reversal
```

**Frontend** (`features/trend/`):
- [ ] Candlestick chart with indicator overlays (RSI, MACD, Volume sub-panels)
- [ ] Signal markers (colored arrows/flags) on chart at detected points
- [ ] Signal summary cards below chart
- [ ] Interval selector: 5m / 15m / 1h / 4h / 1D / 1W
- [ ] Reversal Scanner tab — stocks showing active signals market-wide

---

## Ticker Search (Global)
- `Cmd+K` from any page
- Searches by symbol or company name (~1500 tickers pre-seeded)
- Context-aware: loads that ticker in whichever feature is currently active
- Recent searches in localStorage

---

## Database Tables (Phase 1)

| Table | Purpose |
|---|---|
| `users` | Auth — email, hashed_password, is_active |
| `subscriptions` | tier (free/pro), Stripe IDs, period dates |
| `themes` | 25 theme definitions: name, description, benchmark_etf |
| `theme_tickers` | ticker → theme mapping (our proprietary basket) |
| `theme_scores` | latest score per theme: score, level, signal_breakdown JSON, scored_at |
| `user_theme_watchlist` | user_id + theme_name: which themes a user is watching |
| `insider_filings` | Parsed Form 4: symbol, insider, title, type, shares, value, score, date |
| `tickers` | Reference: symbol, name, exchange, sector (for search) |

---

## Celery Workers (Phase 1)

| Worker | Schedule | Feeds |
|---|---|---|
| `market_indices.fetch` | Every 30s | Top bar live indices |
| `insider_data.poll_sec_edgar` | Every 15 min | `insider_filings` table → Theme Intelligence + Insider Trades |
| `options_data.cache_unusual` | Every 60s | Redis unusual options cache → Theme Intelligence + Options Chain |
| `sentiment.fetch_and_score` | Every 3 min | Redis sentiment cache → Theme Intelligence + Sentiment |
| `theme_intelligence.score` | Every 15 min | Reads insider + options + sentiment → scores all 25 themes |
| `realtime_push.quotes` | Every 15s | WebSocket quote updates |

**Key design**: Theme Intelligence **consumes data already collected** by other workers. No duplicate API calls.

---

## Data Sources (Phase 1 — $0 Cost)

| Need | Source | Cost |
|---|---|---|
| Options chains + greeks | yfinance | Free |
| Insider trades (Form 4) | SEC EDGAR API | Free |
| News headlines | NewsAPI + RSS feeds | Free (API key) |
| Sentiment NLP | FinBERT (local) | Free |
| Technical indicators | pandas-ta (local) | Free |
| Quotes + OHLCV | yfinance | Free |
| ETF performance (theme benchmarks) | yfinance | Free |

**Phase 1 total cost: $0**

---

## UI Design

| Token | Value |
|---|---|
| Background | `#0A0A14` |
| Card | `#111122` |
| Sidebar | `#0D0D1D` |
| Accent | `#7C3AED` |
| Alert red | `#EF4444` |
| Watch amber | `#F59E0B` |
| Bullish green | `#22C55E` |
| Text primary | `#F1F5F9` |
| Text muted | `#64748B` |
| Border | `#1E1E35` |

Fonts: Inter (body) · JetBrains Mono (numbers, tickers, prices)

---

## Phase 1 Definition of Done

1. Landing page loads and shows all 25 theme intelligence cards with live scores (no login)
2. Theme cards update every 15 min via Celery worker
3. User can sign up, navigate the full dashboard, use all 5 features
4. `Cmd+K` search works across all pages
5. Options chain loads for any searched ticker
6. Insider trades feed shows real-time Form 4 filings
7. Sentiment gauge shows live score for any ticker
8. Trend reversal chart shows signal markers on any ticker
9. User can pin/unpin themes to their personal watchlist
10. WebSocket keeps all data live without manual refresh

---

## Phase 2 and Beyond

### Phase 2 — Depth & Personalization
- Virtual portfolio tracker
- Price / volume / theme / insider alerts
- Advanced screener (filter by theme signal + other criteria)
- Earnings calendar
- Congress trading tracker
- Theme performance history (was the signal right? track accuracy over time)

### Phase 3 — ML Models
- Price direction predictor (LightGBM)
- Earnings surprise predictor
- Dynamic theme discovery (cluster detection on uncategorized signals)
- User-created custom theme baskets

### Phase 4 — Monetization Activation
- Flip selected features to Pro (single config change)
- API access tier for developers

### Phase 5 — Backtesting & Mobile
- Backtesting engine
- React Native mobile app
- Polygon.io swap-in (real-time quotes)

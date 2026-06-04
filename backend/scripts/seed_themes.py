"""
Seed script — inserts all theme definitions and their constituent tickers.
Run inside the api container:  python scripts/seed_themes.py
"""
import asyncio
from sqlalchemy import select
from app.database import async_session_factory
from app.models.theme import Theme, ThemeTicker

# ---------------------------------------------------------------------------
# Theme definitions
# ---------------------------------------------------------------------------
THEMES = [
    # ── AI & Technology ──────────────────────────────────────────────────
    {
        "name": "AI Infrastructure",
        "slug": "ai-infrastructure",
        "description": "Data centers, GPUs, networking, and compute powering the AI build-out.",
        "category": "Technology",
        "benchmark_etf": "BOTZ",
        "tickers": ["NVDA", "AMD", "AVGO", "INTC", "SMCI", "ANET", "MRVL", "ARM", "TSM", "ASML"],
    },
    {
        "name": "AI Software & Applications",
        "slug": "ai-software",
        "description": "Enterprise AI platforms, copilots, and AI-native SaaS companies.",
        "category": "Technology",
        "benchmark_etf": "AIQ",
        "tickers": ["MSFT", "GOOGL", "META", "ORCL", "CRM", "SNOW", "PLTR", "AI", "SOUN", "BBAI"],
    },
    {
        "name": "Cybersecurity",
        "slug": "cybersecurity",
        "description": "Network security, endpoint protection, identity management, and SIEM.",
        "category": "Technology",
        "benchmark_etf": "HACK",
        "tickers": ["CRWD", "PANW", "FTNT", "ZS", "OKTA", "S", "SAIL", "CYBR", "TENB", "QLYS"],
    },
    {
        "name": "Semiconductor Equipment",
        "slug": "semiconductor-equipment",
        "description": "Chipmaking equipment and materials critical to the semiconductor supply chain.",
        "category": "Technology",
        "benchmark_etf": "SOXX",
        "tickers": ["ASML", "AMAT", "LRCX", "KLAC", "TER", "ONTO", "ICHR", "CAMT", "ACMR", "UCTT"],
    },
    {
        "name": "Cloud Computing",
        "slug": "cloud-computing",
        "description": "Hyperscalers, cloud-native infrastructure, and multi-cloud tooling.",
        "category": "Technology",
        "benchmark_etf": "SKYY",
        "tickers": ["AMZN", "MSFT", "GOOGL", "NET", "DDOG", "FSLY", "ESTC", "MDB", "GTLB", "CFLT"],
    },
    # ── Biotech & Healthcare ──────────────────────────────────────────────
    {
        "name": "Biotech Innovation",
        "slug": "biotech-innovation",
        "description": "Clinical-stage and commercial biotech with high-conviction pipelines.",
        "category": "Healthcare",
        "benchmark_etf": "XBI",
        "tickers": ["MRNA", "BNTX", "REGN", "VRTX", "BIIB", "NBIX", "EXEL", "RVMD", "KRYS", "DAWN"],
    },
    {
        "name": "GLP-1 & Obesity",
        "slug": "glp1-obesity",
        "description": "GLP-1 drugs, obesity treatments, and downstream beneficiaries.",
        "category": "Healthcare",
        "benchmark_etf": "XLV",
        "tickers": ["NVO", "LLY", "SNY", "ZFGN", "RYTM", "AGEN", "AMGN", "PFE", "AZN", "HIMS"],
    },
    {
        "name": "Medical Devices",
        "slug": "medical-devices",
        "description": "Surgical robotics, diagnostics, wearables, and implantable devices.",
        "category": "Healthcare",
        "benchmark_etf": "IHI",
        "tickers": ["ISRG", "MDT", "ABT", "SYK", "BSX", "EW", "DXCM", "PODD", "NARI", "TNDM"],
    },
    # ── Defense & Geopolitics ─────────────────────────────────────────────
    {
        "name": "Defense & Aerospace",
        "slug": "defense-aerospace",
        "description": "Defense primes, drones, missiles, and space programs.",
        "category": "Defense",
        "benchmark_etf": "ITA",
        "tickers": ["LMT", "RTX", "NOC", "GD", "L3T", "HII", "KTOS", "RKLB", "SPCE", "ACHR"],
    },
    {
        "name": "Drone & Autonomy",
        "slug": "drone-autonomy",
        "description": "Military and commercial drones, autonomous systems, and counter-drone tech.",
        "category": "Defense",
        "benchmark_etf": "IFLY",
        "tickers": ["KTOS", "AVAV", "JOBY", "ACHR", "LILM", "EH", "RKLB", "LUNR", "IRDM", "SPCE"],
    },
    # ── Energy & Commodities ──────────────────────────────────────────────
    {
        "name": "Nuclear Energy",
        "slug": "nuclear-energy",
        "description": "Uranium miners, nuclear plant operators, and SMR developers.",
        "category": "Energy",
        "benchmark_etf": "URA",
        "tickers": ["CCJ", "NLR", "LEU", "UUUU", "DNN", "BWXT", "SMR", "NuScale", "X", "VST"],
    },
    {
        "name": "Clean Energy & Solar",
        "slug": "clean-energy",
        "description": "Solar, wind, battery storage, and grid modernization.",
        "category": "Energy",
        "benchmark_etf": "ICLN",
        "tickers": ["ENPH", "SEDG", "FSLR", "RUN", "BE", "PLUG", "ARRY", "NEE", "BEP", "AY"],
    },
    {
        "name": "Oil & Gas Exploration",
        "slug": "oil-gas",
        "description": "Upstream E&P companies benefiting from high energy prices.",
        "category": "Energy",
        "benchmark_etf": "XOP",
        "tickers": ["XOM", "CVX", "COP", "EOG", "PXD", "DVN", "MRO", "FANG", "OVV", "SM"],
    },
    # ── Finance & Fintech ─────────────────────────────────────────────────
    {
        "name": "Fintech & Payments",
        "slug": "fintech-payments",
        "description": "Digital payments, neo-banks, embedded finance, and crypto infrastructure.",
        "category": "Finance",
        "benchmark_etf": "FINX",
        "tickers": ["V", "MA", "PYPL", "SQ", "AFRM", "UPST", "SOFI", "NU", "COIN", "HOOD"],
    },
    {
        "name": "Regional Banks",
        "slug": "regional-banks",
        "description": "Mid-size US banks sensitive to interest rate and credit cycle dynamics.",
        "category": "Finance",
        "benchmark_etf": "KRE",
        "tickers": ["WAL", "WTFC", "IBOC", "SFNC", "FNB", "HBAN", "RF", "CFG", "FITB", "KEY"],
    },
    # ── Consumer & Retail ─────────────────────────────────────────────────
    {
        "name": "E-Commerce & Retail Tech",
        "slug": "ecommerce",
        "description": "Online retail, last-mile logistics, and retail technology platforms.",
        "category": "Consumer",
        "benchmark_etf": "IBUY",
        "tickers": ["AMZN", "SHOP", "MELI", "SE", "PDD", "ETSY", "WISH", "BABA", "JD", "W"],
    },
    {
        "name": "Travel & Experiences",
        "slug": "travel-experiences",
        "description": "Airlines, hotels, cruise lines, and OTAs benefiting from travel recovery.",
        "category": "Consumer",
        "benchmark_etf": "AWAY",
        "tickers": ["ABNB", "BKNG", "EXPE", "UBER", "LYFT", "DAL", "UAL", "AAL", "CCL", "RCL"],
    },
    # ── Infrastructure & Industrial ───────────────────────────────────────
    {
        "name": "Data Center REITs",
        "slug": "data-center-reits",
        "description": "REITs owning and operating data centers powering the cloud and AI.",
        "category": "Real Estate",
        "benchmark_etf": "SRVR",
        "tickers": ["EQIX", "DLR", "AMT", "CCI", "SBAC", "CONE", "QTS", "SWCH", "UNIT", "IIPR"],
    },
    {
        "name": "Infrastructure & Construction",
        "slug": "infrastructure",
        "description": "Roads, bridges, utilities, and construction driven by federal spending.",
        "category": "Industrial",
        "benchmark_etf": "PAVE",
        "tickers": ["VMC", "MLM", "PWR", "EME", "MTZ", "AECOM", "J", "FLR", "AGX", "ROAD"],
    },
    {
        "name": "Reshoring & Nearshoring",
        "slug": "reshoring",
        "description": "Companies benefiting from supply chain repatriation to US and Mexico.",
        "category": "Industrial",
        "benchmark_etf": "MFAC",
        "tickers": ["HON", "ETN", "ROK", "AME", "ITT", "GNRC", "FIR", "TEL", "FLEX", "SMTC"],
    },
]


async def seed():
    async with async_session_factory() as session:
        # Check if already seeded
        result = await session.execute(select(Theme).limit(1))
        if result.scalar_one_or_none() is not None:
            print("Themes already seeded — skipping.")
            return

        total_themes = 0
        total_tickers = 0

        for t in THEMES:
            theme = Theme(
                name=t["name"],
                slug=t["slug"],
                description=t["description"],
                category=t["category"],
                benchmark_etf=t["benchmark_etf"],
            )
            session.add(theme)
            await session.flush()  # get the theme.id

            for symbol in t["tickers"]:
                session.add(ThemeTicker(theme_id=theme.id, symbol=symbol.upper()))
                total_tickers += 1

            total_themes += 1
            print(f"  + {theme.name} ({len(t['tickers'])} tickers)")

        await session.commit()
        print(f"\nSeeded {total_themes} themes with {total_tickers} ticker mappings.")


if __name__ == "__main__":
    asyncio.run(seed())

"""
SEC EDGAR Form 4 parser.

Uses the EDGAR full-text search RSS feed to find the latest Form 4 filings,
then fetches each filing's primary XML document to extract transaction details.
All network calls are free — no API key required.
"""
import asyncio
import re
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

import httpx

_FORM4_RSS = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&dateb=&owner=include&count=40&search_text=&output=atom"
_FILING_INDEX = "https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/index.json"
_HEADERS = {"User-Agent": "OneStopFinance contact@onestopfinance.com"}

# Titles that indicate C-suite insiders
_CSUITE = {"chief executive", "ceo", "chief financial", "cfo", "president", "chief operating", "coo"}


def _is_csuite(title: str) -> bool:
    low = title.lower()
    return any(kw in low for kw in _CSUITE)


def _score_filing(
    title: str,
    is_open_market: bool,
    total_value: float,
    is_cluster: bool = False,
) -> int:
    score = 0
    t = title.lower()
    if any(k in t for k in ("chief executive", "ceo", "chief financial", "cfo")):
        score += 40
    elif any(k in t for k in ("president", "chief operating", "director")):
        score += 20
    if is_open_market:
        score += 20
    if total_value and total_value >= 500_000:
        score += 15
    if is_cluster:
        score += 15
    return min(score, 100)


def _parse_form4_xml(xml_text: str, accession: str) -> dict | None:
    """Extract the first non-derivative open-market buy from a Form 4 XML."""
    try:
        root = ET.fromstring(xml_text)
        ns = {"f4": root.tag.split("}")[0].lstrip("{") if "}" in root.tag else ""}

        def find(tag: str):
            # Try both namespaced and non-namespaced
            el = root.find(f".//{tag}")
            return el

        issuer_name = (find("issuerName") or ET.Element("x")).text or ""
        symbol = (find("issuerTradingSymbol") or ET.Element("x")).text or ""
        insider_name = (find("rptOwnerName") or ET.Element("x")).text or ""
        title_el = find("officerTitle") or find("relationship") or ET.Element("x")
        insider_title = title_el.text or "Director"
        is_director = (find("isDirector") or ET.Element("x")).text == "1"
        is_officer = (find("isOfficer") or ET.Element("x")).text == "1"
        if not insider_title and is_director:
            insider_title = "Director"

        # Find first open-market buy in nonDerivativeTransaction
        for txn in root.iter("nonDerivativeTransaction"):
            ttype_el = txn.find("transactionAcquiredDisposedCode")
            if ttype_el is not None and (ttype_el.find("value") or ET.Element("x")).text != "A":
                continue  # skip disposals
            code_el = txn.find("transactionCode")
            tcode = (code_el.find("value") if code_el is not None else None)
            tcode_val = tcode.text if tcode is not None else ""
            # P = open-market purchase
            is_open_market = tcode_val == "P"

            shares_el = txn.find("transactionShares")
            shares = float((shares_el.find("value") if shares_el is not None else ET.Element("x")).text or 0)

            price_el = txn.find("transactionPricePerShare")
            price = float((price_el.find("value") if price_el is not None else ET.Element("x")).text or 0)

            date_el = txn.find("transactionDate")
            txn_date_str = (date_el.find("value") if date_el is not None else ET.Element("x")).text or ""

            total_value = shares * price
            if total_value <= 0:
                continue

            try:
                txn_date = datetime.strptime(txn_date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except ValueError:
                txn_date = None

            score = _score_filing(insider_title, is_open_market, total_value)

            return {
                "symbol": symbol.upper(),
                "issuer_name": issuer_name,
                "insider_name": insider_name,
                "insider_title": insider_title,
                "transaction_type": "buy",
                "shares": shares,
                "price_per_share": price,
                "total_value": total_value,
                "is_open_market": is_open_market,
                "is_congress": False,
                "filing_date": datetime.now(timezone.utc).isoformat(),
                "transaction_date": txn_date.isoformat() if txn_date else None,
                "signal_score": score,
                "sec_filing_url": f"https://www.sec.gov/Archives/edgar/data/{accession}",
                "sec_accession_number": accession,
            }
    except Exception:
        pass
    return None


async def _fetch_latest_form4_filings(client: httpx.AsyncClient, limit: int = 40) -> list[dict]:
    """Fetch the EDGAR RSS feed and parse up to `limit` Form 4 buy filings."""
    try:
        resp = await client.get(_FORM4_RSS, headers=_HEADERS, timeout=15)
        resp.raise_for_status()
    except Exception:
        return []

    # Extract filing index URLs from Atom feed
    index_urls: list[str] = re.findall(r"https://www\.sec\.gov/Archives/edgar/data/[^<\"]+index\.htm", resp.text)

    results: list[dict] = []
    for url in index_urls[:limit]:
        # Convert index.htm URL to primary-document XML
        xml_url = url.replace("index.htm", ".xml").replace("-index.htm", ".xml")
        # Try fetching the XML directly
        try:
            xml_resp = await client.get(xml_url, headers=_HEADERS, timeout=10)
            if xml_resp.status_code != 200:
                continue
            # Derive accession number from URL
            parts = url.rstrip("/").split("/")
            accession = parts[-1].replace("-index.htm", "").replace("index.htm", "")
            filing = _parse_form4_xml(xml_resp.text, accession)
            if filing and filing.get("symbol"):
                results.append(filing)
        except Exception:
            continue

    return results


async def fetch_recent_form4_buys(limit: int = 40) -> list[dict]:
    async with httpx.AsyncClient() as client:
        return await _fetch_latest_form4_filings(client, limit)

"""
Feature engineering for the options chain price predictor.
Converts raw options snapshot + OHLCV into a normalised feature dict.
"""

import pandas as pd


def build_features(options: dict | None, ohlcv: pd.DataFrame | None) -> dict:
    feats: dict[str, float] = {}

    if options:
        pcr = options.get("put_call_ratio", 1.0)
        # Normalise PCR: 0.7 → +1 (bullish), 1.0 → 0 (neutral), 1.5 → -1 (bearish)
        feats["pcr_score"] = _clamp((1.0 - pcr) / 0.5, -1, 1)

        feats["iv_skew"] = options.get("avg_put_iv", 30) - options.get("avg_call_iv", 30)

        current_price = ohlcv["Close"].iloc[-1] if ohlcv is not None and not ohlcv.empty else None
        max_pain = options.get("max_pain")
        if current_price and max_pain:
            # Positive = price below max pain (bullish pull toward max pain)
            feats["max_pain_diff"] = _clamp((max_pain - float(current_price)) / float(current_price) * 10, -1, 1)
        else:
            feats["max_pain_diff"] = 0.0

        gex = options.get("net_gex", 0)
        feats["gex_score"] = 1.0 if gex > 0 else -0.5  # positive GEX = pinning (mildly bullish)

    if ohlcv is not None and len(ohlcv) >= 20:
        close = ohlcv["Close"].squeeze()

        rsi = _rsi(close, 14)
        feats["rsi_score"] = _clamp((50 - rsi) / 30, -1, 1)  # < 30 RSI → +1, > 70 → -1

        macd, signal = _macd(close)
        feats["macd_score"] = 1.0 if macd > signal else -1.0

        sma20 = close.rolling(20).mean().iloc[-1]
        feats["price_vs_sma20"] = _clamp((float(close.iloc[-1]) - float(sma20)) / float(sma20) * 20, -1, 1)

        if len(ohlcv) >= 50:
            sma50 = close.rolling(50).mean().iloc[-1]
            feats["price_vs_sma50"] = _clamp((float(close.iloc[-1]) - float(sma50)) / float(sma50) * 20, -1, 1)

        vol_avg = ohlcv["Volume"].squeeze().rolling(20).mean().iloc[-1]
        last_vol = float(ohlcv["Volume"].squeeze().iloc[-1])
        feats["volume_ratio"] = _clamp((last_vol / float(vol_avg) - 1), -1, 1)

    return feats


def _rsi(series: pd.Series, period: int = 14) -> float:
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(period).mean()
    loss = (-delta.clip(upper=0)).rolling(period).mean()
    rs = gain / loss.replace(0, 1e-9)
    rsi = 100 - (100 / (1 + rs))
    return float(rsi.iloc[-1])


def _macd(series: pd.Series) -> tuple[float, float]:
    ema12 = series.ewm(span=12, adjust=False).mean()
    ema26 = series.ewm(span=26, adjust=False).mean()
    macd_line = ema12 - ema26
    signal_line = macd_line.ewm(span=9, adjust=False).mean()
    return float(macd_line.iloc[-1]), float(signal_line.iloc[-1])


def _clamp(val: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, val))

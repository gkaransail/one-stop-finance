from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.core.feature_flags import get_required_tier
from app.core.security import decode_token
from app.database import get_db

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    if not credentials:
        raise AppException(401, "UNAUTHORIZED", "Authentication required")

    try:
        payload = decode_token(credentials.credentials)
    except ValueError:
        raise AppException(401, "INVALID_TOKEN", "Invalid or expired token")

    if payload.get("type") != "access":
        raise AppException(401, "INVALID_TOKEN", "Invalid token type")

    # Import here to avoid circular imports
    from app.models.user import User
    user = await db.get(User, payload["sub"])

    if not user or not user.is_active:
        raise AppException(401, "UNAUTHORIZED", "User not found or inactive")

    return user


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    """Returns user if authenticated, None if not. For public endpoints that optionally use auth."""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials, db)
    except (AppException, HTTPException):
        return None


def require_feature(feature: str):
    """
    FastAPI dependency factory for feature-level access control.
    Reads from FEATURE_FLAGS — change flag from 'free' to 'pro' to gate the feature.
    """
    async def check(current_user=Depends(get_current_user)):
        tier_required = get_required_tier(feature)
        if tier_required == "pro":
            sub = getattr(current_user, "subscription", None)
            user_tier = sub.tier if sub else "free"
            if user_tier != "pro":
                raise AppException(
                    403,
                    "SUBSCRIPTION_REQUIRED",
                    f"'{feature}' requires a Pro subscription.",
                )
        return current_user
    return check

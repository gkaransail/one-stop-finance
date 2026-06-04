from fastapi import APIRouter
from app.core.response import build_response

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register")
async def register():
    return build_response({"message": "Register endpoint — coming soon"})


@router.post("/login")
async def login():
    return build_response({"message": "Login endpoint — coming soon"})


@router.post("/refresh")
async def refresh():
    return build_response({"message": "Refresh endpoint — coming soon"})


@router.post("/verify-email")
async def verify_email():
    return build_response({"message": "Email verification — coming soon"})


@router.post("/forgot-password")
async def forgot_password():
    return build_response({"message": "Forgot password — coming soon"})


@router.post("/reset-password")
async def reset_password():
    return build_response({"message": "Reset password — coming soon"})


@router.get("/me")
async def get_me():
    return build_response({"message": "Get current user — coming soon"})

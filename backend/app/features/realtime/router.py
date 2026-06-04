from fastapi import APIRouter, WebSocket

router = APIRouter(tags=["realtime"])


@router.websocket("/ws/v1/connect")
async def websocket_endpoint(websocket: WebSocket, token: str = ""):
    await websocket.accept()
    await websocket.send_json({"type": "CONNECTED", "message": "WebSocket coming soon"})
    await websocket.close()

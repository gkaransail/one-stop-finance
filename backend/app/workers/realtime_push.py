from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.realtime_push.push_quotes")
def push_quotes():
    logger.info("Pushing real-time quotes — coming soon")

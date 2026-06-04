from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.insider_data.poll_sec_edgar")
def poll_sec_edgar():
    logger.info("Polling SEC EDGAR Form 4 — coming soon")

from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.trend_signals.scan")
def scan():
    logger.info("Scanning trend signals — coming soon")

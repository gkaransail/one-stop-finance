from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.market_indices.fetch")
def fetch():
    logger.info("Fetching market indices — coming soon")

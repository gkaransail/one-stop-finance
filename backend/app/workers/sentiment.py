from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.sentiment.fetch_and_score")
def fetch_and_score():
    logger.info("Fetching and scoring sentiment — coming soon")

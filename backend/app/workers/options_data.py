from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.options_data.cache_unusual")
def cache_unusual():
    logger.info("Caching unusual options — coming soon")

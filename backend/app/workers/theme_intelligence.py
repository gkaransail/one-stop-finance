from app.celery_app import celery
import logging

logger = logging.getLogger(__name__)

@celery.task(name="app.workers.theme_intelligence.score_all_themes")
def score_all_themes():
    logger.info("Scoring all themes — coming soon")

from flask_frozen import Freezer
from app import app

# Create freezer instance
freezer = Freezer(app)

# Skip specific URLs by overriding the freeze_yield method
original_freeze_yield = freezer.freeze_yield

def custom_freeze_yield():
    """Only include specific URLs to freeze"""
    for url in original_freeze_yield():
        # Skip POST-only routes
        if url in ['/send_email', '/download_resume']:
            continue
        # Skip any dynamic URLs
        if '?' in url or '&' in url:
            continue
        yield url

freezer.freeze_yield = custom_freeze_yield

if __name__ == '__main__':
    freezer.freeze()

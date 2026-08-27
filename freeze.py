from flask_frozen import Freezer
from app import app

class CustomFreezer(Freezer):
    def _build_one(self, url, last_modified):
        # Skip specific URLs
        skip_urls = ['/send_email', '/download_resume']
        if url in skip_urls:
            return None
        return super()._build_one(url, last_modified)

freezer = CustomFreezer(app)

if __name__ == '__main__':
    freezer.freeze()

from flask_frozen import Freezer
from app import app

# Freezer ma badhi routes freeze na thay etle skip karo
freezer = Freezer(app)

# POST routes ne skip karo (email send, resume download)
@freezer.register_generator
def skip_routes():
    # Only generate GET routes
    yield '/'
    yield '/download_resume'
    # '/send_email' ne skip karo

if __name__ == '__main__':
    freezer.freeze()

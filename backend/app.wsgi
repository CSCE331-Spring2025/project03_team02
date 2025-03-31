import sys
import logging

# Add the app's directory to the sys.path
sys.path.insert(0, '/home/ubuntu/331/backend')

from app import app as application  # 'application' is what mod_wsgi expects
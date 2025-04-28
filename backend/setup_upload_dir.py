import os

# create upload directory if it doesn't exist
UPLOAD_FOLDER = 'frontend/public/images'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    print(f"Created upload directory: {UPLOAD_FOLDER}")
else:
    print(f"Upload directory already exists: {UPLOAD_FOLDER}") 
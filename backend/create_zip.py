import zipfile
import os

# Files to include in the ROOT of the zip
files_to_zip = {
    'application.py': 'application.py',
    'reverse_image_search.py': 'reverse_image_search.py',
    'requirements.txt': 'requirements.txt',
    'Procfile': 'Procfile',
    'Dockerfile': 'Dockerfile'
}

# Directories to include (like .ebextensions)
dirs_to_zip = {
    '.ebextensions': '.ebextensions'
}

zip_name = 'DeepShield_EB_Final.zip'

with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add files
    for src, arc in files_to_zip.items():
        if os.path.exists(src):
            zipf.write(src, arc)
            print(f"Added file: {src} as {arc}")
    
    # Add directories
    for src_dir, arc_dir in dirs_to_zip.items():
        if os.path.exists(src_dir):
            for root, dirs, files in os.walk(src_dir):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, os.path.dirname(src_dir))
                    rel_path = rel_path.replace('\\', '/') # Force forward slashes for Linux
                    zipf.write(full_path, rel_path)
                    print(f"Added dir file: {full_path} as {rel_path}")

print(f"\nSuccessfully created {zip_name} with forward-slash compatibility.")

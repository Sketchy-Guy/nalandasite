# Gunicorn Configuration for Production
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
preload_app = True
user = "deploy"
group = "www-data"  # Changed to www-data so Nginx can access uploaded files
umask = 0o002  # Ensures new files are group-readable (664 for files, 775 for directories)
# Nalanda Vista Connect - Complete Deployment Guide

## Project Architecture Overview

Your project consists of:
- **Frontend**: React + TypeScript + Vite (port 8080)
- **Backend**: Django 4.2.7 + DRF with JWT auth (port 8000)
- **Database**: PostgreSQL (nalandavc database)

## 1. Environment Files Security Best Practices

### ❌ NEVER commit actual .env files to Git
### ✅ Instead, create template files and manage production secrets separately

### Backend Environment Template (.env.example):
```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost

# Database Configuration
DB_NAME=nalandavc
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS=False
```

### Frontend Environment Template (.env.example):
```env
# Django Backend Configuration
VITE_API_BASE_URL=https://your-domain.com/api

# Frontend Configuration  
VITE_FRONTEND_URL=https://your-domain.com
```

### Update .gitignore:
```
# Environment files
.env
.env.local
.env.production
.env.development

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg

# Django
*.log
local_settings.py
db.sqlite3
media/
staticfiles/

# Virtual Environment
venv/
env/
ENV/
```

## 2. Production Settings Updates Needed

Update `backend/college_website/settings.py`:

1. **Change DEBUG default to False:**
```python
DEBUG = config('DEBUG', default=False, cast=bool)
```

2. **Use environment variables for database:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='nalandavc'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}
```

3. **Disable CORS_ALLOW_ALL_ORIGINS for production:**
```python
CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', default=False, cast=bool)
```

## 3. PostgreSQL Database Deployment

### Install PostgreSQL on Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Set up database:
```bash
sudo -u postgres psql
CREATE DATABASE nalandavc;
CREATE USER nalandauser WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE nalandavc TO nalandauser;
\q
```

### Configure PostgreSQL for production:
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
# Set: listen_addresses = 'localhost'

sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: local   nalandavc   nalandauser   md5
```

## 4. Backend Django Deployment with Gunicorn

### Create Gunicorn Configuration:
Create `backend/gunicorn.conf.py`:
```python
bind = "127.0.0.1:8000"
workers = 3
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100
timeout = 30
keepalive = 2
preload_app = True
```

### Deploy Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn college_website.wsgi:application -c gunicorn.conf.py
```

## 5. Nginx Configuration

### Install Nginx:
```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Nginx Configuration:
Create `/etc/nginx/sites-available/nalanda-vista`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (React build)
    location / {
        root /var/www/html/nalanda-vista;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (Django)
    location /static/ {
        alias /var/www/nalanda-vista/backend/staticfiles/;
    }

    # Media files (Django)
    location /media/ {
        alias /var/www/nalanda-vista/backend/media/;
    }
}
```

### Enable Nginx site:
```bash
sudo ln -s /etc/nginx/sites-available/nalanda-vista /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Frontend Deployment

### Update Frontend Environment for Production:
Update `frontend/.env`:
```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_FRONTEND_URL=https://your-domain.com
```

### Build and Deploy Frontend:
```bash
cd frontend
npm install
npm run build
sudo mkdir -p /var/www/html/nalanda-vista
sudo cp -r dist/* /var/www/html/nalanda-vista/
```

## 7. Systemd Services for Auto-start

### Create Gunicorn Service:
Create `/etc/systemd/system/nalanda-backend.service`:
```ini
[Unit]
Description=Nalanda Vista Connect Django Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/nalanda-vista/backend
Environment="PATH=/var/www/nalanda-vista/backend/venv/bin"
ExecStart=/var/www/nalanda-vista/backend/venv/bin/gunicorn college_website.wsgi:application -c gunicorn.conf.py
Restart=always

[Install]
WantedBy=multi-user.target
```

### Enable and Start Services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable nalanda-backend
sudo systemctl start nalanda-backend
sudo systemctl status nalanda-backend
```

## 8. Complete Step-by-Step Deployment Process

### Local Machine Preparation:
```bash
# 1. Navigate to your project
cd d:\nalanda-vista-connect1

# 2. Create environment templates
# - Create backend/.env.example with template content
# - Create frontend/.env.example with template content

# 3. Update .gitignore (add the content shown above)

# 4. Remove .env files from Git tracking (if already committed)
git rm --cached backend/.env
git rm --cached frontend/.env

# 5. Commit your code (WITHOUT .env files)
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Server Setup (Ubuntu/Debian):
```bash
# 1. Connect to your server
ssh username@your-server-ip

# 2. Update system
sudo apt update && sudo apt upgrade -y

# 3. Install required software
sudo apt install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib nginx git

# 4. Create application directory
sudo mkdir -p /var/www/nalanda-vista
sudo chown $USER:$USER /var/www/nalanda-vista
cd /var/www/nalanda-vista

# 5. Clone your repository
git clone https://github.com/yourusername/nalanda-vista-connect.git .
```

### Database Setup on Server:
```bash
# 1. Setup PostgreSQL
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE nalandavc;
CREATE USER nalandauser WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE nalandavc TO nalandauser;
\q

# 2. Configure PostgreSQL
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: local   nalandavc   nalandauser   md5

sudo systemctl restart postgresql
```

### Backend Deployment on Server:
```bash
# 1. Navigate to backend
cd /var/www/nalanda-vista/backend

# 2. Create production .env file
nano .env
```

**Content for production .env:**
```env
SECRET_KEY=generate-a-new-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-server-ip

DB_NAME=nalandavc
DB_USER=nalandauser
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOW_ALL_ORIGINS=False
```

```bash
# 3. Set up Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 4. Run Django setup
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser  # Optional

# 5. Create Gunicorn config (content shown above)
nano gunicorn.conf.py
```

### Frontend Deployment on Server:
```bash
# 1. Navigate to frontend
cd /var/www/nalanda-vista/frontend

# 2. Create production .env file
nano .env
```

**Content for production frontend .env:**
```env
VITE_API_BASE_URL=https://your-domain.com/api
VITE_FRONTEND_URL=https://your-domain.com
```

```bash
# 3. Build frontend
npm install
npm run build

# 4. Copy build files to web directory
sudo mkdir -p /var/www/html/nalanda-vista
sudo cp -r dist/* /var/www/html/nalanda-vista/
```

### Set Permissions:
```bash
# Set correct permissions
sudo chown -R www-data:www-data /var/www/nalanda-vista
sudo chown -R www-data:www-data /var/www/html/nalanda-vista
```

## 9. SSL Certificate (Recommended)

### Using Certbot for Let's Encrypt:
```bash
# 1. Install Certbot
sudo apt install certbot python3-certbot-nginx

# 2. Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 3. Test auto-renewal
sudo certbot renew --dry-run
```

## 10. Future Updates Workflow

### When you make changes:

**On Local Machine:**
```bash
# 1. Make your changes
# 2. Test locally
# 3. Commit and push
git add .
git commit -m "Your changes description"
git push origin main
```

**On Server:**
```bash
# 1. Pull latest changes
cd /var/www/nalanda-vista
git pull origin main

# 2. Update backend (if needed)
cd backend
source venv/bin/activate
pip install -r requirements.txt  # If new dependencies
python manage.py migrate  # If database changes
python manage.py collectstatic --noinput
sudo systemctl restart nalanda-backend

# 3. Update frontend (if needed)
cd ../frontend
npm install  # If new dependencies
npm run build
sudo cp -r dist/* /var/www/html/nalanda-vista/

# 4. Reload Nginx (if config changed)
sudo systemctl reload nginx
```

## 11. Testing Your Deployment

```bash
# Test backend API
curl https://your-domain.com/api/

# Test frontend
curl https://your-domain.com/

# Check services status
sudo systemctl status nalanda-backend
sudo systemctl status nginx
sudo systemctl status postgresql

# Check logs if issues
sudo journalctl -u nalanda-backend -f
sudo tail -f /var/log/nginx/error.log
```

## 12. Security Checklist

- ✅ **Never commit .env files**
- ✅ **Use strong passwords**
- ✅ **Keep DEBUG=False in production**
- ✅ **Use HTTPS with SSL certificates**
- ✅ **Regular backups of database**
- ✅ **Monitor server logs**
- ✅ **Keep software updated**
- ✅ **Configure firewall (UFW)**
- ✅ **Use non-root user for deployment**

## 13. Backup Strategy

### Database Backup:
```bash
# Create backup
pg_dump -U nalandauser -h localhost nalandavc > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -U nalandauser -h localhost nalandavc < backup_file.sql
```

### File Backup:
```bash
# Backup media files
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/nalanda-vista/backend/media/

# Backup entire application
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/nalanda-vista/
```

## 14. Monitoring and Maintenance

### Log Locations:
- **Nginx**: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- **Django**: Check systemd journal with `sudo journalctl -u nalanda-backend`
- **PostgreSQL**: `/var/log/postgresql/`

### Regular Maintenance:
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

## Deployment Summary

Your Nalanda Vista Connect application will be deployed with:
- **PostgreSQL** handling data persistence
- **Gunicorn** serving Django backend on port 8000
- **Nginx** serving React frontend and proxying API calls
- **Systemd** ensuring services auto-restart
- **SSL** for secure HTTPS connections

The deployment is production-ready with proper separation of concerns, security configurations, and scalability considerations.

# Nalanda Vista Connect - Complete Ubuntu 22.04 LTS Deployment Guide
## Production Deployment on Hostinger VPS with Domain & SSL

### 🚀 Project Stack
- **Frontend**: React 18.3.1 + TypeScript + Vite + Tailwind CSS
- **Backend**: Django 5.2.7 + Django REST Framework + JWT Authentication  
- **Database**: PostgreSQL 14+ (Production)
- **Web Server**: Nginx + Gunicorn
- **OS**: Ubuntu 22.04 LTS
- **SSL**: Let's Encrypt (Free SSL Certificate)

### 📋 Prerequisites Checklist
- ✅ Hostinger VPS (2 vCPU, 8GB RAM, 100GB Storage)
- ✅ Domain name (e.g., nalandavista.com)
- ✅ GitHub repository for your project
- ✅ SSH access to your VPS
- ✅ Basic terminal/command line knowledge

---

## 🎯 **STEP 1: Prepare Local Project for Deployment**

### 1.1 Create Environment Templates

#### Backend Environment Template
Create `backend/.env.example`:
```env
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-server-ip

# Database Configuration
DB_NAME=nalandavc
DB_USER=nalandauser
DB_PASSWORD=your-secure-database-password
DB_HOST=localhost
DB_PORT=5432

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Security Settings
CSRF_TRUSTED_ORIGINS=https://your-domain.com,https://www.your-domain.com
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
```

#### Frontend Environment Template
Create `frontend/.env.example`:
```env
# API Configuration
VITE_API_BASE_URL=https://your-domain.com/api
VITE_FRONTEND_URL=https://your-domain.com
```

### 1.2 Update .gitignore
Add to your `.gitignore`:
```
# Environment files
.env
.env.local
.env.production
.env.development

# Python
__pycache__/
*.py[cod]
venv/
env/

# Django
*.log
db.sqlite3
media/
staticfiles/

# Node.js
node_modules/
dist/
build/
```

### 1.3 Update Django Settings for Production
Edit `backend/college_website/settings.py`:

```python
from decouple import config
import os

# Security
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='nalandavc'),
        'USER': config('DB_USER', default='nalandauser'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS', default=False, cast=bool)
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

# Security Headers
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='').split(',')
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Static Files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### 1.4 Change Django Admin URL (Avoid Conflicts)
Edit `backend/college_website/urls.py`:
```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('logi-admin/', admin.site.urls),  # Changed from 'admin/' to avoid conflicts
    path('api/', include('core.urls')),
    path('api/auth/', include('authentication.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 1.5 Create Gunicorn Configuration
Create `backend/gunicorn.conf.py`:
```python
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
user = "www-data"
group = "www-data"
```

### 1.6 Push to GitHub
```bash
# Navigate to your project
cd d:\nalanda-vista-connect1

# Remove .env files from Git tracking (if already committed)
git rm --cached backend/.env frontend/.env

# Add all changes
git add .
git commit -m "Prepare for production deployment - Ubuntu 22.04 LTS"
git push origin main
```

---

## 🖥️ **STEP 2: Set Up Hostinger VPS**

### 2.1 Access Your VPS
```bash
# SSH into your Hostinger VPS
ssh root@your-server-ip

# Or if you have a non-root user
ssh username@your-server-ip
```

### 2.2 Initial Server Setup
```bash
# Update system packages
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common

# Create a non-root user (if using root)
adduser deploy
usermod -aG sudo deploy
su - deploy
```

### 2.3 Install Required Software
```bash
# Install Python 3.10+ and dependencies
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install additional tools
sudo apt install -y htop ufw fail2ban
```

---

## 🗄️ **STEP 3: Set Up PostgreSQL Database**

### 3.1 Configure PostgreSQL
```bash
# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Access PostgreSQL as postgres user
sudo -u postgres psql
```

### 3.2 Create Database and User
```sql
-- In PostgreSQL shell
CREATE DATABASE nalandavc;
CREATE USER nalandauser WITH PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE nalandavc TO nalandauser;
ALTER USER nalandauser CREATEDB;
\q
```

### 3.3 Configure PostgreSQL Authentication
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line after the existing local connections
local   nalandavc   nalandauser   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3.4 Test Database Connection
```bash
# Test connection
psql -U nalandauser -d nalandavc -h localhost
# Enter password when prompted
# Type \q to exit
```

---

## 📂 **STEP 4: Deploy Your Application**

### 4.1 Clone Repository
```bash
# Create application directory
sudo mkdir -p /var/www/nalanda-vista
sudo chown deploy:deploy /var/www/nalanda-vista
cd /var/www/nalanda-vista

# Clone your repository
git clone https://github.com/yourusername/nalanda-vista-connect.git .
```

### 4.2 Set Up Backend
```bash
# Navigate to backend
cd /var/www/nalanda-vista/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create production .env file
nano .env
```

**Production .env content:**
```env
SECRET_KEY=generate-a-new-secret-key-here-use-django-secret-key-generator
DEBUG=False
ALLOWED_HOSTS=nalandavista.com,www.nalandavista.com,your-server-ip

DB_NAME=nalandavc
DB_USER=nalandauser
DB_PASSWORD=YourSecurePassword123!
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://nalandavista.com,https://www.nalandavista.com

CSRF_TRUSTED_ORIGINS=https://nalandavista.com,https://www.nalandavista.com
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
```

### 4.3 Run Django Setup
```bash
# Still in backend directory with venv activated
python manage.py migrate
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser
# Username: admin
# Email: admin@nalandavista.com  
# Password: [Choose a strong password]

# Test Django
python manage.py runserver 0.0.0.0:8000
# Press Ctrl+C to stop
```

### 4.4 Set Up Frontend
```bash
# Navigate to frontend
cd /var/www/nalanda-vista/frontend

# Create production .env file
nano .env
```

**Frontend .env content:**
```env
VITE_API_BASE_URL=https://nalandavista.com/api
VITE_FRONTEND_URL=https://nalandavista.com
```

```bash
# Install Node.js dependencies
npm install

# Build for production
npm run build

# Copy build files to web directory
sudo mkdir -p /var/www/html/nalanda-vista
sudo cp -r dist/* /var/www/html/nalanda-vista/
```

---

## 🌐 **STEP 5: Configure Domain & DNS**

### 5.1 Point Domain to Your VPS
In your domain registrar (Hostinger, Namecheap, etc.):

**A Records:**
- `@` (root domain) → `your-server-ip`
- `www` → `your-server-ip`

**Wait 5-10 minutes for DNS propagation**

### 5.2 Test Domain Resolution
```bash
# Test if domain points to your server
ping nalandavista.com
ping www.nalandavista.com
```

---

## ⚙️ **STEP 6: Configure Nginx Web Server**

### 6.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/nalanda-vista
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name nalandavista.com www.nalandavista.com;

    # Frontend (React build)
    location / {
        root /var/www/html/nalanda-vista;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
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

    # Django Admin (changed URL)
    location /logi-admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (Django)
    location /static/ {
        alias /var/www/nalanda-vista/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files (Django)
    location /media/ {
        alias /var/www/nalanda-vista/backend/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable Nginx Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/nalanda-vista /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔒 **STEP 7: Set Up SSL Certificate (HTTPS)**

### 7.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 7.2 Get SSL Certificate
```bash
# Get SSL certificate for your domain
sudo certbot --nginx -d nalandavista.com -d www.nalandavista.com

# Follow the prompts:
# Enter email address
# Agree to terms
# Choose to redirect HTTP to HTTPS (recommended)
```

### 7.3 Test Auto-Renewal
```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Set up automatic renewal (already configured by default)
sudo systemctl status certbot.timer
```

---

## 🚀 **STEP 8: Set Up Systemd Services (Auto-Start)**

### 8.1 Create Gunicorn Service
```bash
sudo nano /etc/systemd/system/nalanda-backend.service
```

**Service Configuration:**
```ini
[Unit]
Description=Nalanda Vista Connect Django Backend
After=network.target

[Service]
User=deploy
Group=deploy
WorkingDirectory=/var/www/nalanda-vista/backend
Environment="PATH=/var/www/nalanda-vista/backend/venv/bin"
ExecStart=/var/www/nalanda-vista/backend/venv/bin/gunicorn college_website.wsgi:application -c gunicorn.conf.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### 8.2 Enable and Start Services
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable nalanda-backend
sudo systemctl start nalanda-backend

# Check status
sudo systemctl status nalanda-backend
```

---

## 🔧 **STEP 9: Set File Permissions**

```bash
# Set correct ownership
sudo chown -R deploy:deploy /var/www/nalanda-vista
sudo chown -R www-data:www-data /var/www/html/nalanda-vista

# Set correct permissions
sudo chmod -R 755 /var/www/nalanda-vista
sudo chmod -R 755 /var/www/html/nalanda-vista

# Set media directory permissions
sudo chmod -R 755 /var/www/nalanda-vista/backend/media
sudo chown -R deploy:deploy /var/www/nalanda-vista/backend/media
```

---

## ✅ **STEP 10: Test Your Deployment**

### 10.1 Test All Services
```bash
# Check service status
sudo systemctl status nalanda-backend
sudo systemctl status nginx
sudo systemctl status postgresql

# Test API endpoint
curl https://nalandavista.com/api/

# Test frontend
curl https://nalandavista.com/
```

### 10.2 Access Your Website
- **Frontend**: https://nalandavista.com
- **Custom Admin**: https://nalandavista.com/admin
- **Django Admin**: https://nalandavista.com/logi-admin
- **API**: https://nalandavista.com/api

### 10.3 Create Additional Superusers
```bash
# SSH into your server
cd /var/www/nalanda-vista/backend
source venv/bin/activate

# Method 1: Interactive creation
python manage.py createsuperuser

# Method 2: Using Django shell
python manage.py shell
```

**In Django shell:**
```python
from django.contrib.auth.models import User
from authentication.models import Profile

# Create superuser
user = User.objects.create_superuser(
    username='admin2',
    email='admin2@nalandavista.com',
    password='SecurePassword123!',
    first_name='Admin',
    last_name='User'
)

# Create profile
Profile.objects.create(
    user=user,
    full_name='Admin User',
    role='admin'
)

print(f"Superuser created: {user.username}")
exit()
```

---

## 🔄 **STEP 11: Future Updates & GitHub Workflow**

### 11.1 Local Development Workflow
```bash
# Make changes locally
cd d:\nalanda-vista-connect1

# Test changes
# Backend: python manage.py runserver
# Frontend: npm run dev

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### 11.2 Deploy Updates to Production
```bash
# SSH into your server
ssh deploy@your-server-ip

# Navigate to project directory
cd /var/www/nalanda-vista

# Pull latest changes
git pull origin main

# Update backend (if needed)
cd backend
source venv/bin/activate

# Install new dependencies (if any)
pip install -r requirements.txt

# Run migrations (if database changes)
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Restart backend service
sudo systemctl restart nalanda-backend

# Update frontend (if needed)
cd ../frontend

# Install new dependencies (if any)
npm install

# Build new version
npm run build

# Copy to web directory
sudo cp -r dist/* /var/www/html/nalanda-vista/

# Reload Nginx (if config changed)
sudo systemctl reload nginx
```

### 11.3 Automated Deployment Script
Create `deploy.sh` on your server:
```bash
nano /home/deploy/deploy.sh
```

```bash
#!/bin/bash
echo "🚀 Deploying Nalanda Vista Connect..."

# Navigate to project
cd /var/www/nalanda-vista

# Pull latest changes
git pull origin main

# Backend updates
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Frontend updates
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/nalanda-vista/

# Restart services
sudo systemctl restart nalanda-backend
sudo systemctl reload nginx

echo "✅ Deployment completed!"
```

Make it executable:
```bash
chmod +x /home/deploy/deploy.sh
```

**Usage:**
```bash
./deploy.sh
```

---

## 🔐 **STEP 12: Security Hardening**

### 12.1 Configure Firewall
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

### 12.2 Secure SSH
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Disable root login
PermitRootLogin no

# Change default port (optional)
Port 2222

# Restart SSH
sudo systemctl restart ssh
```

### 12.3 Set Up Fail2Ban
```bash
# Configure Fail2Ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

```bash
# Start Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📊 **STEP 13: Monitoring & Maintenance**

### 13.1 Log Locations
- **Nginx Access**: `/var/log/nginx/access.log`
- **Nginx Error**: `/var/log/nginx/error.log`  
- **Django**: `sudo journalctl -u nalanda-backend -f`
- **PostgreSQL**: `/var/log/postgresql/`

### 13.2 Monitoring Commands
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop

# Check service logs
sudo journalctl -u nalanda-backend --since "1 hour ago"
sudo tail -f /var/log/nginx/error.log
```

### 13.3 Database Backup
```bash
# Create backup script
nano /home/deploy/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U nalandauser -h localhost nalandavc > $BACKUP_DIR/db_backup_$DATE.sql

# Media files backup
tar -czf $BACKUP_DIR/media_backup_$DATE.tar.gz /var/www/nalanda-vista/backend/media/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable
chmod +x /home/deploy/backup.sh

# Add to crontab for daily backups
crontab -e

# Add this line for daily backup at 2 AM
0 2 * * * /home/deploy/backup.sh
```

---

## 🎉 **DEPLOYMENT COMPLETE!**

### 🌟 Your Website is Now Live!

**Access URLs:**
- **Main Website**: https://nalandavista.com
- **Custom Admin Panel**: https://nalandavista.com/admin
- **Django Admin**: https://nalandavista.com/logi-admin
- **API Endpoint**: https://nalandavista.com/api

### 📱 **Admin Access Credentials**
- **Username**: admin (or what you created)
- **Password**: [Your chosen password]
- **Email**: admin@nalandavista.com

### 🔧 **Quick Commands Reference**

**Check Services:**
```bash
sudo systemctl status nalanda-backend nginx postgresql
```

**View Logs:**
```bash
sudo journalctl -u nalanda-backend -f
sudo tail -f /var/log/nginx/error.log
```

**Deploy Updates:**
```bash
cd /var/www/nalanda-vista && git pull && ./deploy.sh
```

**Create Backup:**
```bash
./backup.sh
```

### 🚨 **Emergency Contacts**
- **Server Issues**: Check logs and restart services
- **Database Issues**: Check PostgreSQL status and connections
- **SSL Issues**: Run `sudo certbot renew`
- **Domain Issues**: Check DNS settings in domain registrar

### 🎯 **Next Steps**
1. ✅ Test all functionality thoroughly
2. ✅ Set up regular backups
3. ✅ Monitor server performance
4. ✅ Configure email settings (if needed)
5. ✅ Set up monitoring alerts
6. ✅ Document any custom configurations

**Congratulations! Your Nalanda Vista Connect college website is now successfully deployed on Ubuntu 22.04 LTS with Hostinger VPS! 🚀**

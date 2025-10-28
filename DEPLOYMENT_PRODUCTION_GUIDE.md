# Production Deployment Guide - Sentinel Test Suite

This guide provides step-by-step instructions for deploying the **Sentinel Test Suite** to production environments using professional hosting platforms.

---

## Table of Contents

1. [Railway Deployment (Recommended)](#railway-deployment)
2. [Docker Deployment](#docker-deployment)
3. [AWS Deployment](#aws-deployment)
4. [DigitalOcean Deployment](#digitalocean-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Railway Deployment (Recommended)

Railway is the easiest and most professional way to deploy the **Sentinel Test Suite** with automatic scaling and monitoring.

### Prerequisites

- GitHub account with access to the repository
- Railway account (free tier available at https://railway.app)

### Step-by-Step Deployment

#### 1. Connect GitHub Repository

1. Log in to [Railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub Repo"**
4. Authorize Railway to access your GitHub account
5. Select the **`sentinel-test-suite`** repository (Note: you may need to rename the repository on GitHub first, or manually select the existing one)

#### 2. Configure Services

Railway will automatically detect the `Dockerfile`s. Configure as follows:

**Backend Service:**
- **Name:** `sentinel-test-suite-backend`
- **Build:** Automatic (uses `backend/Dockerfile`)
- **Port:** 5000
- **Environment Variables:**
  ```
  PORT=5000
  API_KEY=your-secure-api-key-here
  ENABLE_AUTH=true
  MAX_REQUESTS_PER_MINUTE=10
  CORS_ORIGIN=https://your-frontend-domain.railway.app
  NODE_ENV=production
  ```

**Frontend Service:**
- **Name:** `sentinel-test-suite-frontend`
- **Build:** Automatic (uses `frontend/Dockerfile`)
- **Port:** 3000
- **Environment Variables:**
  ```
  VITE_API_URL=https://your-backend-domain.railway.app
  NODE_ENV=production
  ```

#### 3. Deploy

1. Click **"Deploy"**
2. Wait for both services to build and start (usually 5-10 minutes)
3. Railway will provide public URLs for both services

#### 4. Verify Deployment

```bash
# Test backend health
curl -s https://your-backend-domain.railway.app/api/health

# Expected response:
# {"status":"Server is running","timestamp":"2025-10-28T..."}
```

---

## Docker Deployment

For self-hosted environments or VPS deployments.

### Prerequisites

- Docker installed (version 20+)
- Docker Compose installed (version 2+)
- VPS or server with 4GB+ RAM

### Step-by-Step Deployment

#### 1. Clone Repository on Server

```bash
ssh user@your-server.com
cd /opt
git clone https://github.com/yourusername/sentinel-test-suite.git
cd sentinel-test-suite
```

#### 2. Create Environment Files

**Create `.env` file:**

```bash
cat > .env << 'EOF'
# Backend Configuration
PORT=5000
API_KEY=your-secure-api-key-here
ENABLE_AUTH=true
MAX_REQUESTS_PER_MINUTE=10
NODE_ENV=production

# Frontend Configuration
VITE_API_URL=https://your-domain.com/api
EOF
```

#### 3. Build and Start Services

```bash
# Build images
docker-compose build

# Start services in background
docker-compose up -d

# Verify services are running
docker-compose ps

# View logs
docker-compose logs -f
```

#### 4. Configure Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/sentinel-test-suite`:

```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/sentinel-test-suite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Set Up SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

---

## AWS Deployment

Using AWS ECS (Elastic Container Service) for scalable deployment.

### Prerequisites

- AWS account
- AWS CLI configured
- Docker images pushed to ECR (Elastic Container Registry)

### Step-by-Step Deployment

#### 1. Create ECR Repository

```bash
aws ecr create-repository --repository-name sentinel-test-suite-backend
aws ecr create-repository --repository-name sentinel-test-suite-frontend
```

#### 2. Push Docker Images

```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
docker build -t sentinel-test-suite-backend ./backend
docker tag sentinel-test-suite-backend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sentinel-test-suite-backend:latest
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sentinel-test-suite-backend:latest

# Build and push frontend
docker build -t sentinel-test-suite-frontend ./frontend
docker tag sentinel-test-suite-frontend:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sentinel-test-suite-frontend:latest
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sentinel-test-suite-frontend:latest
```

#### 3. Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name sentinel-test-suite
```

#### 4. Create Task Definitions

Create `task-definition.json`:

```json
{
  "family": "sentinel-test-suite",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sentinel-test-suite-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "hostPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "PORT",
          "value": "5000"
        },
        {
          "name": "API_KEY",
          "value": "your-secure-api-key"
        },
        {
          "name": "ENABLE_AUTH",
          "value": "true"
        }
      ]
    },
    {
      "name": "frontend",
      "image": "YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/sentinel-test-suite-frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ]
    }
  ]
}
```

Register task definition:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

#### 5. Create ECS Service

```bash
aws ecs create-service \
  --cluster sentinel-test-suite \
  --service-name sentinel-test-suite-service \
  --task-definition sentinel-test-suite \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

## DigitalOcean Deployment

Using DigitalOcean App Platform for simple deployment.

### Prerequisites

- DigitalOcean account
- GitHub repository connected

### Step-by-Step Deployment

#### 1. Create App

1. Log in to DigitalOcean
2. Click **"Create"** → **"Apps"**
3. Select **"GitHub"** and authorize
4. Select the **`sentinel-test-suite`** repository
5. Click **"Next"**

#### 2. Configure Services

DigitalOcean will auto-detect services. Configure:

**Backend:**
- **Source:** `backend/Dockerfile`
- **Port:** 5000
- **HTTP Routes:** `/api`

**Frontend:**
- **Source:** `frontend/Dockerfile`
- **Port:** 3000
- **HTTP Routes:** `/`

#### 3. Set Environment Variables

In the "Environment" tab, add:

```
API_KEY=your-secure-api-key
ENABLE_AUTH=true
VITE_API_URL=https://your-app.ondigitalocean.app
```

#### 4. Deploy

Click **"Create Resources"** and wait for deployment to complete.

---

## Environment Configuration

### Production Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend port | `5000` |
| `API_KEY` | API authentication key | `your-secure-key-here` |
| `ENABLE_AUTH` | Enable API authentication | `true` |
| `MAX_REQUESTS_PER_MINUTE` | Rate limit | `10` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://your-domain.com` |
| `NODE_ENV` | Environment | `production` |
| `VITE_API_URL` | Backend API URL for frontend | `https://api.your-domain.com` |

### Security Best Practices

1. **Use Strong API Keys**
   ```bash
   # Generate a secure API key
   openssl rand -base64 32
   ```

2. **Enable HTTPS**
   - Use Let's Encrypt for free SSL certificates
   - Configure automatic renewal

3. **Set Up Firewall Rules**
   - Only allow necessary ports (80, 443)
   - Restrict API access to known IPs if possible

4. **Enable Rate Limiting**
   - Set `MAX_REQUESTS_PER_MINUTE` appropriately
   - Monitor for abuse

5. **Regular Backups**
   - Back up configuration files
   - Back up generated accounts data if needed

---

## Monitoring and Maintenance

### Health Checks

Set up monitoring to check service health:

```bash
# Check backend health
curl -s https://your-domain.com/api/health

# Check frontend availability
curl -s https://your-domain.com/
```

### Logging

Configure centralized logging:

```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# For production, use services like:
# - DataDog
# - New Relic
# - CloudWatch (AWS)
# - Stackdriver (Google Cloud)
```

### Updates

Keep the application updated:

```bash
# Pull latest changes
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Performance Monitoring

Monitor key metrics:

- **Response Time:** Should be < 2 seconds
- **Error Rate:** Should be < 1%
- **Uptime:** Should be > 99.9%
- **CPU Usage:** Should be < 70%
- **Memory Usage:** Should be < 80%

---

## Troubleshooting

### Common Issues

| Issue | Solution |
| :--- | :--- |
| **Port already in use** | Change port in `.env` or stop conflicting service |
| **Docker build fails** | Check Node.js version, run `npm install` locally first |
| **API not responding** | Check firewall rules, verify API key in headers |
| **Frontend can't reach backend** | Verify `VITE_API_URL` environment variable |
| **High memory usage** | Reduce `MAX_REQUESTS_PER_MINUTE`, restart service |

---

## Conclusion

Your **Sentinel Test Suite** is now deployed to production and ready for use. Monitor regularly and follow security best practices to ensure continued reliability and security.

**Last Updated:** October 2025

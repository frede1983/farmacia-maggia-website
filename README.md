# 🏥 Farmacia Maggia Website

Modern, multilingual pharmacy website for **Farmacia Maggia** in CH-6673 Maggia, Ticino, Switzerland.

## Features

- 🌍 **Multilingual** - Support for Italian, German, and French
- ⚡ **Fast & Modern** - Built with React 18 + Vite 6
- 🎨 **Styled with Tailwind CSS** - Beautiful, responsive design
- 🔒 **Type-Safe** - TypeScript 5.6 for enhanced development experience
- 🚀 **Auto-Deploy** - GitHub Actions CI/CD pipeline
- 🐳 **Docker** - Containerized deployment with NGINX
- 🏥 **Health Checks** - Built-in monitoring and reliability

## Tech Stack

- **Frontend**: React 18.3, TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 6.28
- **i18n**: react-i18next 15.1
- **Server**: NGINX 1.27
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Project Structure

```
farmacia-maggia-website/
├── src/
│   ├── components/     # React components (Header, Footer, Layout)
│   ├── pages/          # Page components (HomePage)
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── styles/         # Global styles
│   └── i18n/           # Translations (IT/DE/FR)
├── scripts/            # Deployment scripts
│   ├── check-port.sh   # Port availability checker
│   └── deploy.sh       # Main deployment script
├── .github/workflows/  # GitHub Actions
│   ├── deploy.yml      # Auto-deployment
│   └── claude.yml      # Claude Code integration
├── Dockerfile          # Multi-stage Docker build
├── docker-compose.yml  # Container orchestration
├── nginx.conf          # NGINX configuration
└── vite.config.ts      # Vite configuration
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/frede1983/farmacia-maggia-website.git
cd farmacia-maggia-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - Check TypeScript types

## Deployment

### Prerequisites on VPS

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add user to docker group
sudo usermod -aG docker $USER
```

### GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret | Description | Example |
|--------|-------------|---------|
| `VPS_HOST` | VPS hostname | `srv1013438.hstgr.cloud` |
| `VPS_USERNAME` | SSH username | `root` |
| `VPS_SSH_KEY` | Private SSH key | `-----BEGIN OPENSSH PRIVATE KEY-----` |
| `VPS_PORT` | SSH port (optional) | `22` |
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code token (optional) | For `@claude` integration |

### Generate SSH Key for GitHub Actions

```bash
# On VPS
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions -N ""
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# Copy private key to GitHub Secret
cat ~/.ssh/github-actions
```

### Automatic Deployment

Every push to `main` branch triggers automatic deployment:

```bash
git add .
git commit -m "Update website"
git push
```

GitHub Actions will:
1. Connect to VPS via SSH
2. Clone/update repository
3. Find available port
4. Build Docker image
5. Start container with NGINX
6. Verify health checks

### Manual Deployment

Deploy directly on VPS:

```bash
cd /opt/farmacia-maggia-website
bash scripts/deploy.sh
```

### NGINX Reverse Proxy with HTTPS

After deploying the Docker container, configure NGINX to provide public HTTPS access:

#### Option 1: Automatic Setup (Recommended)

Deploy with NGINX configuration in one command:

```bash
cd /opt/farmacia-maggia-website

# Deploy with NGINX and HTTPS (auto-detects SSL certificates)
SETUP_NGINX=yes bash scripts/deploy.sh

# Or with custom settings
SETUP_NGINX=yes \
  NGINX_PORT=3030 \
  SERVER_NAME=srv1013438.hstgr.cloud \
  ENABLE_HTTPS=yes \
  bash scripts/deploy.sh
```

#### Option 2: Manual NGINX Setup

Run the NGINX setup script separately:

```bash
# Basic setup (will auto-detect SSL certificates)
sudo bash scripts/setup-nginx-https.sh [CONTAINER_PORT] [PUBLIC_PORT] [SERVER_NAME] [yes|no]

# Example: Setup HTTPS on port 3030
sudo bash scripts/setup-nginx-https.sh 3007 3030 srv1013438.hstgr.cloud yes

# Example: Setup HTTP only
sudo bash scripts/setup-nginx-https.sh 3007 8080 srv1013438.hstgr.cloud no
```

The script will:
- ✅ Check for SSL certificates (Let's Encrypt)
- ✅ Create NGINX configuration with reverse proxy
- ✅ Enable HTTP/2 and modern TLS (1.2, 1.3)
- ✅ Configure security headers
- ✅ Set up health check endpoint
- ✅ Test and reload NGINX
- ✅ Verify the endpoint is accessible

#### Get SSL Certificate (if needed)

If you don't have an SSL certificate yet:

```bash
# Install certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get Let's Encrypt certificate
sudo certbot certonly --nginx -d your-domain.com

# Run NGINX setup again to enable HTTPS
sudo bash scripts/setup-nginx-https.sh 3007 3030 your-domain.com yes
```

#### NGINX Management

```bash
# View configuration
cat /etc/nginx/sites-available/farmacia-maggia-website

# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx

# View logs
sudo tail -f /var/log/nginx/farmacia-maggia-website-*.log

# Disable site
sudo rm /etc/nginx/sites-enabled/farmacia-maggia-website
sudo systemctl reload nginx
```

### Monitoring

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f

# Check health endpoint (Docker)
curl http://localhost:[PORT]/health

# Check health endpoint (HTTPS via NGINX)
curl https://your-domain.com:3030/health

# View port assignment
cat .env

# Check NGINX status
sudo systemctl status nginx

# View NGINX logs
sudo tail -f /var/log/nginx/farmacia-maggia-website-*.log

# Test SSL certificate
openssl s_client -connect your-domain.com:3030 -servername your-domain.com
```

## Docker

### Build Image

```bash
docker build -t farmacia-maggia-website .
```

### Run with Docker Compose

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild
docker compose build --no-cache
```

### Health Check

The container includes a health check endpoint:

```bash
curl http://localhost:[PORT]/health
```

## i18n (Internationalization)

The website supports three languages:
- 🇮🇹 Italian (default)
- 🇩🇪 German
- 🇫🇷 French

Translations are in `src/i18n/locales/{it,de,fr}/translation.json`

Add new translations:

```json
{
  "common": {
    "new_key": "Translation text"
  }
}
```

Use in components:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.new_key')}</h1>;
}
```

## Claude Code Integration

Tag `@claude` in GitHub issues or PR comments to trigger Claude Code assistance.

Example:
```
@claude Please help optimize the HomePage component performance
```

## Architecture

### Multi-Stage Docker Build

1. **Build Stage**: Compile React app with Node.js
2. **Production Stage**: Serve static files with NGINX

### Auto-Port Detection

The deployment system automatically finds an available port (3000-3100):
- Checks if default port 3000 is free
- If busy, finds next available port
- Updates `.env` and starts container

### Health Checks

- Container: Health check every 30s
- Application: `/health` endpoint
- Deployment: Verifies service before completing

## Production Configuration

### Live Deployment

The production website is currently deployed with the following configuration:

**URLs:**
- 🔒 **HTTPS:** https://srv1013438.hstgr.cloud:3030
- 🏥 **Health Check:** https://srv1013438.hstgr.cloud:3030/health

**Infrastructure:**
- **Docker Container:** Port 3007 (internal)
- **NGINX Reverse Proxy:** Port 3030 (public, HTTPS)
- **SSL/TLS:** Let's Encrypt certificate
- **Protocol:** HTTP/2 with TLS 1.3
- **Cipher:** TLS_AES_256_GCM_SHA384

**Architecture:**
```
Internet (HTTPS :3030)
       ↓
NGINX Reverse Proxy
  - SSL/TLS Termination
  - HTTP/2
  - Security Headers
       ↓
Docker Container (:3007)
  - React App (Vite)
  - Health Checks
```

**Security Features:**
- ✅ TLS 1.3 and TLS 1.2 support
- ✅ HTTP/2 enabled
- ✅ Strong cipher suites (ECDHE with GCM)
- ✅ Perfect Forward Secrecy
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Valid Let's Encrypt certificate

**Deployment Files:**
- NGINX Config: `/etc/nginx/sites-available/farmacia-maggia-website`
- SSL Certificates: `/etc/letsencrypt/live/srv1013438.hstgr.cloud/`
- Docker Compose: `/opt/farmacia-maggia-website/docker-compose.yml`
- Logs: `/var/log/nginx/farmacia-maggia-website-*.log`

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment documentation and troubleshooting guide.

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See [LICENSE](LICENSE) file

## Credits

Built with Claude Code for Farmacia Maggia, Ticino, Switzerland.

---

**Status**: 🟢 Production with HTTPS
**Version**: 1.0.0
**Last Updated**: 2025-11-01

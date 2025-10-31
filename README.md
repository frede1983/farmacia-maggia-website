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

### Monitoring

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f

# Check health endpoint
curl http://localhost:[PORT]/health

# View port assignment
cat .env
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

**Status**: 🟢 Active Development
**Version**: 1.0.0
**Last Updated**: 2025-10-31

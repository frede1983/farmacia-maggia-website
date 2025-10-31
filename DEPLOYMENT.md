# Deployment Documentation - Farmacia Maggia Website

## Executive Summary

Successfully deployed the Farmacia Maggia website to VPS (`srv1013438.hstgr.cloud`) using Docker containerization with automated health checks and port management.

**Live URL:** http://srv1013438.hstgr.cloud:3007
**Deployment Date:** 2025-10-31
**Status:** ✅ Production Ready

---

## Deployment Process

### 1. Initial Setup

**Repository:** https://github.com/frede1983/farmacia-maggia-website
**Deployment Directory:** `/opt/farmacia-maggia-website`
**Port:** 3007 (auto-detected)

### 2. Issues Encountered & Solutions

#### Issue #1: TypeScript Build Failure

**Problem:**
```
error TS7026: JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
```

**Root Cause:**
Dockerfile line 10 used `npm ci --only=production`, which excluded devDependencies needed for TypeScript compilation:
- @types/react
- @types/react-dom
- typescript
- @vitejs/plugin-react
- vite

**Solution:**
Changed Dockerfile to install all dependencies for the build stage:
```dockerfile
# Before
RUN npm ci --only=production

# After
RUN npm ci  # Install all dependencies including devDependencies
```

**Commit:** `abbdd5a`

---

#### Issue #2: Docker Health Check Failure

**Problem:**
Container health status reported as "unhealthy" even though the service was responding correctly from the host. Health check command was failing inside the container:
```
wget: can't connect to remote host: Connection refused
```

**Root Cause:**
The health check used `http://localhost:80/` but `localhost` doesn't resolve properly in Alpine Linux containers. Testing revealed:
- ❌ `http://localhost:80/` - Connection refused
- ✅ `http://127.0.0.1:80/health` - Works correctly

**Solution:**
Updated both Dockerfile and docker-compose.yml to use `127.0.0.1` instead of `localhost`:

```dockerfile
# Dockerfile - Before
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Dockerfile - After
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/health || exit 1
```

```yaml
# docker-compose.yml - Before
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/health"]

# docker-compose.yml - After
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1:80/health"]
```

**Commit:** `a9e2b71`

---

#### Issue #3: Docker Compose Version Warning

**Problem:**
Continuous warnings during deployment:
```
/opt/farmacia-maggia-website/docker-compose.yml: the attribute `version` is obsolete
```

**Root Cause:**
Docker Compose v2 doesn't require the `version` attribute and warns when it's present.

**Solution:**
Removed obsolete `version: '3.8'` from docker-compose.yml.

**Commit:** `a9e2b71`

---

## Architecture

### Multi-Stage Docker Build

```dockerfile
# Stage 1: Build (Node.js 22 Alpine)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci  # Install all dependencies
COPY . .
RUN npm run build  # TypeScript + Vite build

# Stage 2: Production (NGINX 1.27 Alpine)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/health || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- Small production image (only NGINX + static files)
- Build dependencies not included in production
- Fast deployment and startup
- Minimal attack surface

### Port Management

The deployment system automatically finds available ports:

1. **check-port.sh** - Checks both host and Docker container ports
   - Uses `lsof` to check host ports
   - Uses `docker ps` to check container port mappings
   - Searches range: 3000-3100

2. **deploy.sh** - Manages deployment lifecycle
   - Stops existing containers
   - Waits 2 seconds for port release
   - Re-verifies port availability
   - Warns about potential conflicts

3. **Dynamic Port Assignment**
   - Stored in `.env` file: `PORT=3007`
   - Used in docker-compose.yml: `"${PORT:-3000}:80"`

### Health Monitoring

**Multiple Health Check Layers:**

1. **NGINX `/health` endpoint** (nginx.conf)
   ```nginx
   location /health {
       access_log off;
       return 200 "healthy\n";
       add_header Content-Type text/plain;
   }
   ```

2. **Docker Container Health Check** (Dockerfile)
   - Interval: 30s
   - Timeout: 3s
   - Start period: 5s
   - Retries: 3

3. **Deployment Script Verification** (deploy.sh)
   - Waits for Docker health status
   - Verifies HTTP endpoint accessibility
   - Maximum wait: 60 seconds

---

## Deployment Commands

### Automatic Deployment (GitHub Actions)

Every push to `main` branch triggers automatic deployment:
```bash
git add .
git commit -m "Update website"
git push
```

### Manual Deployment

On VPS:
```bash
cd /opt/farmacia-maggia-website
bash scripts/deploy.sh
```

### Check Status

```bash
# Container status
docker compose ps

# View logs
docker compose logs -f

# Check health
curl http://localhost:3007/health

# View port assignment
cat .env
```

### Stop Service

```bash
docker compose down
```

---

## Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | Frontend framework |
| TypeScript | 5.6.3 | Type-safe development |
| Vite | 6.0.1 | Build tool & dev server |
| Tailwind CSS | 3.4.14 | Styling framework |
| react-i18next | 15.1.3 | Internationalization (IT/DE/FR) |
| react-router-dom | 6.28.0 | Client-side routing |
| NGINX | 1.27 Alpine | Production web server |
| Docker | 28.4.0 | Containerization |
| Docker Compose | 2.39.2 | Container orchestration |

---

## File Structure

```
farmacia-maggia-website/
├── src/
│   ├── components/     # React components (Header, Footer, Layout)
│   ├── pages/          # Page components (HomePage)
│   ├── i18n/           # Translations (IT/DE/FR)
│   └── styles/         # Global styles
├── scripts/
│   ├── check-port.sh   # Port availability checker
│   └── deploy.sh       # Main deployment script
├── .github/workflows/
│   ├── deploy.yml      # Auto-deployment
│   └── claude.yml      # Claude Code integration
├── Dockerfile          # Multi-stage Docker build
├── docker-compose.yml  # Container orchestration
├── nginx.conf          # NGINX configuration
└── vite.config.ts      # Vite configuration
```

---

## Build Statistics

**Final Build Output:**
```
dist/index.html                0.74 kB │ gzip:  0.42 kB
dist/assets/index-*.css       11.28 kB │ gzip:  2.92 kB
dist/assets/index-*.js       227.43 kB │ gzip: 72.78 kB
```

**Build Time:** ~5 seconds
**Total Dependencies:** 280 packages
**Security Vulnerabilities:** 0

---

## Monitoring & Maintenance

### Health Check Endpoints

1. **Application Health**
   ```bash
   curl http://srv1013438.hstgr.cloud:3007/health
   # Expected: "healthy"
   ```

2. **Docker Health Status**
   ```bash
   docker inspect farmacia-maggia-website --format='{{.State.Health.Status}}'
   # Expected: "healthy"
   ```

3. **Container Logs**
   ```bash
   docker compose logs -f
   ```

### Common Issues

#### Container won't start
```bash
# Check logs
docker compose logs --tail=50

# Check if port is in use
lsof -i :3007
docker ps --format '{{.Names}}:{{.Ports}}' | grep 3007
```

#### Health check failing
```bash
# Test health check manually
docker exec farmacia-maggia-website wget --quiet --tries=1 --spider http://127.0.0.1:80/health
echo $?  # Should return 0
```

#### Port conflicts
```bash
# Find conflicting containers
docker ps --format '{{.Names}}:{{.Ports}}' | grep :3007

# Stop conflicting containers or redeploy to new port
bash scripts/deploy.sh
```

---

## Security Considerations

### NGINX Configuration

1. **Security Headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-XSS-Protection "1; mode=block" always;
   ```

2. **Gzip Compression**
   - Enabled for text/css/js/json
   - Reduces bandwidth usage

3. **SPA Routing**
   - Fallback to index.html for client-side routing
   - Prevents 404 errors on direct URL access

### Container Security

- Using official Alpine-based images
- Minimal attack surface
- No unnecessary tools in production
- Health checks prevent zombie containers

---

## Future Improvements

### Recommended Enhancements

1. **SSL/TLS Certificate**
   - Use Let's Encrypt for HTTPS
   - Configure NGINX for SSL termination

2. **Reverse Proxy**
   - Set up NGINX reverse proxy on host
   - Use domain name instead of port numbers

3. **Monitoring**
   - Add Prometheus metrics
   - Set up alerting for health check failures

4. **CI/CD Enhancements**
   - Add automated tests in GitHub Actions
   - Implement staging environment

5. **Backup Strategy**
   - Automated container image backups
   - Configuration file versioning

---

## Troubleshooting Guide

### Deployment Fails at Build Stage

**Symptom:** TypeScript errors during `npm run build`

**Solution:**
1. Verify Dockerfile uses `RUN npm ci` (not `--only=production`)
2. Check package.json includes all required devDependencies
3. Review build logs: `docker compose build --no-cache`

### Health Checks Never Pass

**Symptom:** Container stays in "health: starting" or "unhealthy"

**Solution:**
1. Verify health check URL uses `127.0.0.1` not `localhost`
2. Test manually: `docker exec [container] wget -O- http://127.0.0.1:80/health`
3. Check NGINX is serving /health endpoint correctly

### Port Conflicts

**Symptom:** "port is already allocated" error

**Solution:**
1. Run `bash scripts/check-port.sh 3000` to find available port
2. Update `.env` file with new port
3. Restart deployment: `bash scripts/deploy.sh`

---

## Commit History

| Commit | Date | Description |
|--------|------|-------------|
| `0307667` | 2025-10-31 | Initial deployment infrastructure |
| `abbdd5a` | 2025-10-31 | Fix Docker build: install all dependencies |
| `a9e2b71` | 2025-10-31 | Fix health checks and cleanup warnings |

---

## Contact & Support

**Repository:** https://github.com/frede1983/farmacia-maggia-website
**Issues:** https://github.com/frede1983/farmacia-maggia-website/issues

For Claude Code assistance, mention `@claude` in GitHub issues or PR comments.

---

**Last Updated:** 2025-10-31
**Deployment Status:** ✅ Production
**Service URL:** http://srv1013438.hstgr.cloud:3007

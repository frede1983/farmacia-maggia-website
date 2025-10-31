#!/bin/bash
set -e

echo "🚀 Starting deployment for Farmacia Maggia Website..."

PROJECT_NAME="farmacia-maggia-website"
DEFAULT_PORT=3000
DEPLOY_DIR="/opt/$PROJECT_NAME"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Create deployment directory
if [ ! -d "$DEPLOY_DIR" ]; then
    log_info "Creating deployment directory: $DEPLOY_DIR"
    mkdir -p "$DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"

# Check for available port
log_info "Checking for available port..."
SCRIPT_DIR="$(dirname "$0")"
PORT=$(bash "$SCRIPT_DIR/check-port.sh" $DEFAULT_PORT)
log_info "Using port: $PORT"

# Create/update .env file
echo "PORT=$PORT" > .env
log_info "Updated .env file with PORT=$PORT"

# Stop existing containers for this project
if [ "$(docker compose ps -q)" ]; then
    log_info "Stopping existing containers..."
    docker compose down
    sleep 2  # Give time for ports to be released
fi

# Double-check port is available after stopping containers
log_info "Verifying port is available..."
PORT=$(bash "$SCRIPT_DIR/check-port.sh" $PORT)
echo "PORT=$PORT" > .env
log_info "Confirmed port: $PORT"

# Check for port conflicts with other Docker containers
CONFLICTING_CONTAINERS=$(docker ps --format '{{.Names}}:{{.Ports}}' | grep ":$PORT->" || true)
if [ -n "$CONFLICTING_CONTAINERS" ]; then
    log_warn "Found containers using port $PORT:"
    echo "$CONFLICTING_CONTAINERS"
    log_warn "These may cause conflicts. Consider stopping them."
fi

# Build new image
log_info "Building Docker image..."
docker compose build --no-cache

# Start containers
log_info "Starting containers..."
docker compose up -d

# Wait for health check
log_info "Waiting for service to be healthy..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker compose ps | grep -q "healthy"; then
        log_info "Service is healthy!"
        break
    fi

    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 2
done

echo ""

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    log_error "Service failed to become healthy"
    docker compose logs --tail=50
    exit 1
fi

# Verify HTTP endpoint
log_info "Verifying HTTP endpoint..."
if curl -f -s "http://localhost:$PORT/health" > /dev/null; then
    log_info "Health check passed!"
else
    log_error "Health check failed!"
    docker compose logs --tail=50
    exit 1
fi

# Show deployment info
echo ""
echo "========================================="
echo "🎉 Deployment successful!"
echo "========================================="
echo "Service: $PROJECT_NAME"
echo "Port: $PORT"
echo "Health: http://localhost:$PORT/health"
echo "URL: http://localhost:$PORT"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""
echo "To stop service:"
echo "  docker compose down"
echo "========================================="

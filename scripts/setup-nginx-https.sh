#!/bin/bash
set -e

# NGINX HTTPS Setup Script for Farmacia Maggia Website
# This script configures NGINX reverse proxy with SSL/TLS support

PROJECT_NAME="farmacia-maggia-website"
DEFAULT_PUBLIC_PORT=3030

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

log_step() {
    echo -e "${BLUE}▶${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "This script must be run as root (use sudo)"
    exit 1
fi

# Get parameters
CONTAINER_PORT=${1:-3007}
PUBLIC_PORT=${2:-$DEFAULT_PUBLIC_PORT}
SERVER_NAME=${3:-$(hostname -f)}
ENABLE_HTTPS=${4:-yes}

echo "========================================="
echo "🔧 NGINX HTTPS Setup"
echo "========================================="
echo "Project: $PROJECT_NAME"
echo "Container Port: $CONTAINER_PORT"
echo "Public Port: $PUBLIC_PORT"
echo "Server Name: $SERVER_NAME"
echo "HTTPS: $ENABLE_HTTPS"
echo "========================================="
echo ""

# Check if NGINX is installed
if ! command -v nginx &> /dev/null; then
    log_error "NGINX is not installed. Installing..."
    apt update && apt install -y nginx
    log_info "NGINX installed successfully"
fi

# Check for SSL certificates if HTTPS is enabled
SSL_CERT=""
SSL_KEY=""
if [ "$ENABLE_HTTPS" = "yes" ]; then
    log_step "Checking for SSL certificates..."

    # Check for Let's Encrypt certificates
    if [ -f "/etc/letsencrypt/live/$SERVER_NAME/fullchain.pem" ]; then
        SSL_CERT="/etc/letsencrypt/live/$SERVER_NAME/fullchain.pem"
        SSL_KEY="/etc/letsencrypt/live/$SERVER_NAME/privkey.pem"
        log_info "Found Let's Encrypt certificates for $SERVER_NAME"
    else
        log_warn "No SSL certificates found for $SERVER_NAME"
        log_warn "To enable HTTPS, you need to:"
        log_warn "  1. Install certbot: apt install certbot python3-certbot-nginx"
        log_warn "  2. Get certificate: certbot certonly --nginx -d $SERVER_NAME"
        log_warn ""
        log_warn "Continuing with HTTP-only configuration..."
        ENABLE_HTTPS="no"
    fi
fi

# Create NGINX configuration
NGINX_CONF="/etc/nginx/sites-available/$PROJECT_NAME"
log_step "Creating NGINX configuration: $NGINX_CONF"

if [ "$ENABLE_HTTPS" = "yes" ]; then
    # HTTPS configuration
    cat > "$NGINX_CONF" <<EOF
server {
    listen $PUBLIC_PORT ssl http2;
    listen [::]:$PUBLIC_PORT ssl http2;
    server_name $SERVER_NAME;

    # SSL Configuration
    ssl_certificate $SSL_CERT;
    ssl_certificate_key $SSL_KEY;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;

    # SSL session cache
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Optional: Enable HSTS (uncomment after testing)
    # add_header Strict-Transport-Security "max-age=31536000" always;

    # Reverse proxy to Docker container
    location / {
        proxy_pass http://localhost:$CONTAINER_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Support for SPA (Single Page Application)
        proxy_intercept_errors off;

        # Cache headers
        proxy_cache_bypass \$http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:$CONTAINER_PORT/health;
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/$PROJECT_NAME-access.log;
    error_log /var/log/nginx/$PROJECT_NAME-error.log;
}
EOF
    log_info "Created HTTPS configuration"
else
    # HTTP-only configuration
    cat > "$NGINX_CONF" <<EOF
server {
    listen $PUBLIC_PORT;
    listen [::]:$PUBLIC_PORT;
    server_name $SERVER_NAME;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Reverse proxy to Docker container
    location / {
        proxy_pass http://localhost:$CONTAINER_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Support for SPA (Single Page Application)
        proxy_intercept_errors off;

        # Cache headers
        proxy_cache_bypass \$http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:$CONTAINER_PORT/health;
        access_log off;
    }

    # Logs
    access_log /var/log/nginx/$PROJECT_NAME-access.log;
    error_log /var/log/nginx/$PROJECT_NAME-error.log;
}
EOF
    log_info "Created HTTP configuration"
fi

# Enable site
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"
if [ -L "$NGINX_ENABLED" ]; then
    log_info "Site already enabled"
else
    log_step "Enabling site..."
    ln -s "$NGINX_CONF" "$NGINX_ENABLED"
    log_info "Site enabled"
fi

# Test NGINX configuration
log_step "Testing NGINX configuration..."
if nginx -t; then
    log_info "NGINX configuration is valid"
else
    log_error "NGINX configuration test failed!"
    exit 1
fi

# Reload NGINX
log_step "Reloading NGINX..."
systemctl reload nginx
log_info "NGINX reloaded successfully"

# Wait for port to be ready
sleep 2

# Test the endpoint
echo ""
log_step "Testing endpoint..."

if [ "$ENABLE_HTTPS" = "yes" ]; then
    PROTOCOL="https"
else
    PROTOCOL="http"
fi

TEST_URL="$PROTOCOL://localhost:$PUBLIC_PORT/health"

if curl -f -s -k "$TEST_URL" > /dev/null 2>&1; then
    log_info "Health check passed: $TEST_URL"
else
    log_warn "Health check did not respond immediately (this may be normal during startup)"
fi

# Show summary
echo ""
echo "========================================="
echo "🎉 NGINX Configuration Complete!"
echo "========================================="
echo "Configuration: $NGINX_CONF"
echo ""
if [ "$ENABLE_HTTPS" = "yes" ]; then
    echo "🔒 HTTPS URL: https://$SERVER_NAME:$PUBLIC_PORT"
    echo "🔒 Health: https://$SERVER_NAME:$PUBLIC_PORT/health"
    echo ""
    echo "SSL Details:"
    echo "  Certificate: $SSL_CERT"
    echo "  Protocols: TLSv1.2, TLSv1.3"
    echo "  HTTP/2: Enabled"
else
    echo "🌐 HTTP URL: http://$SERVER_NAME:$PUBLIC_PORT"
    echo "🌐 Health: http://$SERVER_NAME:$PUBLIC_PORT/health"
    echo ""
    echo "Note: To enable HTTPS, install certbot and get SSL certificate:"
    echo "  apt install certbot python3-certbot-nginx"
    echo "  certbot certonly --nginx -d $SERVER_NAME"
    echo "  Then run this script again"
fi
echo ""
echo "NGINX Commands:"
echo "  View config: cat $NGINX_CONF"
echo "  Test config: nginx -t"
echo "  Reload: systemctl reload nginx"
echo "  Logs: tail -f /var/log/nginx/$PROJECT_NAME-*.log"
echo ""
echo "To disable site:"
echo "  rm $NGINX_ENABLED"
echo "  systemctl reload nginx"
echo "========================================="

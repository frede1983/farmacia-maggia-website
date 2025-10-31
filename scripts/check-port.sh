#!/bin/bash

# Check if a port is available and return it, or find an alternative
# Checks both host ports and Docker container ports
# Usage: ./check-port.sh [port]

DEFAULT_PORT=${1:-3000}
MAX_PORT=3100

check_port() {
    local port=$1

    # Check if port is in use on host
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1  # Port is in use on host
    fi

    # Check if port is mapped by any Docker container
    if command -v docker >/dev/null 2>&1; then
        if docker ps --format '{{.Ports}}' 2>/dev/null | grep -q ":$port->"; then
            return 1  # Port is mapped by Docker
        fi
    fi

    return 0  # Port is free
}

if check_port $DEFAULT_PORT; then
    echo $DEFAULT_PORT
    exit 0
fi

# Find first available port
for ((port=DEFAULT_PORT+1; port<=MAX_PORT; port++)); do
    if check_port $port; then
        echo $port
        exit 0
    fi
done

echo "Error: No available ports found between $DEFAULT_PORT and $MAX_PORT" >&2
exit 1

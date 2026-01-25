---
sidebar_position: 3
title: Installation
description: Complete installation guide for all GateKey components
---

# Installation

This guide covers installing all GateKey components.

## Client Installation

The GateKey client (`gatekey`) is for end users who need to connect to VPN.

### Homebrew (macOS/Linux)

```bash
brew tap dye-tech/gatekey
brew install gatekey
```

### Binary Download

Download from [GitHub Releases](https://github.com/dye-tech/GateKey/releases):

| Platform | Binary |
|----------|--------|
| Linux (amd64) | `gatekey-linux-amd64` |
| Linux (arm64) | `gatekey-linux-arm64` |
| macOS (Intel) | `gatekey-darwin-amd64` |
| macOS (Apple Silicon) | `gatekey-darwin-arm64` |
| Windows | `gatekey-windows-amd64.exe` |

```bash
# Example for Linux amd64
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-linux-amd64
chmod +x gatekey-linux-amd64
sudo mv gatekey-linux-amd64 /usr/local/bin/gatekey
```

### From Source

```bash
git clone https://github.com/dye-tech/GateKey.git
cd GateKey
make build-client
sudo cp bin/gatekey /usr/local/bin/
```

---

## Server Installation

The GateKey server is the control plane that handles authentication, certificate generation, and policy management.

### Prerequisites

- PostgreSQL 14+
- Go 1.25+ (if building from source)

### Option 1: Kubernetes with Helm (Recommended)

```bash
# Add the Helm repository
helm repo add gatekey https://dye-tech.github.io/gatekey-helm-chart
helm repo update

# Install with default settings
helm install gatekey gatekey/gatekey \
  -n gatekey \
  --create-namespace

# Or with custom admin password
helm install gatekey gatekey/gatekey \
  -n gatekey \
  --create-namespace \
  --set secrets.adminPassword="your-secure-password"
```

Retrieve the auto-generated admin password:

```bash
kubectl get secret gatekey-admin-password -n gatekey \
  -o jsonpath='{.data.admin-password}' | base64 -d
```

See the [Helm Chart repository](https://github.com/dye-tech/gatekey-helm-chart) for all configuration options.

### Option 2: Docker

```bash
docker run -d \
  --name gatekey-server \
  -p 8080:8080 \
  -e DATABASE_URL="postgres://gatekey:password@host.docker.internal/gatekey?sslmode=disable" \
  -e GATEKEY_ADMIN_PASSWORD="your-secure-password" \
  dyetech/gatekey-server:latest
```

### Option 3: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: gatekey
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gatekey
    volumes:
      - postgres_data:/var/lib/postgresql/data

  gatekey-server:
    image: dyetech/gatekey-server:latest
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgres://gatekey:password@postgres/gatekey?sslmode=disable
      GATEKEY_ADMIN_PASSWORD: your-secure-password
    depends_on:
      - postgres

  gatekey-web:
    image: dyetech/gatekey-web:latest
    ports:
      - "80:8080"
    depends_on:
      - gatekey-server

volumes:
  postgres_data:
```

Run:

```bash
docker-compose up -d
```

### Option 4: Build from Source

```bash
# Clone
git clone https://github.com/dye-tech/GateKey.git
cd GateKey

# Build server
make build-server

# Setup database
export DATABASE_URL="postgres://gatekey:password@localhost/gatekey?sslmode=disable"
make migrate-up

# Configure
cp configs/gatekey.yaml.example configs/gatekey.yaml
# Edit configs/gatekey.yaml with your settings

# Run
./bin/gatekey-server --config configs/gatekey.yaml
```

---

## Gateway Installation

The gateway agent runs alongside OpenVPN or WireGuard on your VPN servers.

### Prerequisites

- Linux server with root access
- nftables (for firewall rules)
- OpenVPN 2.5+ (for OpenVPN gateways)
- WireGuard kernel module (for WireGuard gateways)

### Option 1: Install Script (Recommended)

```bash
curl -sSL https://vpn.yourcompany.com/scripts/install-gateway.sh | sudo bash -s -- \
  --server https://vpn.yourcompany.com \
  --token YOUR_GATEWAY_TOKEN \
  --name my-gateway
```

The script will:
- Download the gateway binary
- Install OpenVPN if not present
- Configure the gateway service
- Set up firewall rules
- Register with the control plane

### Option 2: Manual Installation

```bash
# Download gateway binary
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-gateway-linux-amd64
chmod +x gatekey-gateway-linux-amd64
sudo mv gatekey-gateway-linux-amd64 /usr/local/bin/gatekey-gateway

# Create config directory
sudo mkdir -p /etc/gatekey

# Create config file
sudo cat > /etc/gatekey/gateway.yaml << EOF
server_url: https://vpn.yourcompany.com
gateway_token: your-gateway-registration-token
openvpn_config: /etc/openvpn/server.conf
EOF

# Create systemd service
sudo cat > /etc/systemd/system/gatekey-gateway.service << EOF
[Unit]
Description=GateKey Gateway Agent
After=network.target openvpn.service

[Service]
Type=simple
ExecStart=/usr/local/bin/gatekey-gateway --config /etc/gatekey/gateway.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl enable gatekey-gateway
sudo systemctl start gatekey-gateway
```

### WireGuard Gateway

For WireGuard gateways, use the WireGuard-specific agent:

```bash
# Download WireGuard gateway binary
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-wireguard-gateway-linux-amd64
chmod +x gatekey-wireguard-gateway-linux-amd64
sudo mv gatekey-wireguard-gateway-linux-amd64 /usr/local/bin/gatekey-wireguard-gateway

# Create config
sudo mkdir -p /etc/gatekey
sudo cat > /etc/gatekey/wireguard-gateway.yaml << EOF
server_url: https://vpn.yourcompany.com
gateway_token: your-gateway-registration-token
interface_name: wg0
listen_port: 51820
EOF

# Create systemd service
sudo cat > /etc/systemd/system/gatekey-wireguard-gateway.service << EOF
[Unit]
Description=GateKey WireGuard Gateway Agent
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/gatekey-wireguard-gateway --config /etc/gatekey/wireguard-gateway.yaml
Restart=always
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_RAW

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl enable gatekey-wireguard-gateway
sudo systemctl start gatekey-wireguard-gateway
```

---

## Admin CLI Installation

The Admin CLI (`gatekey-admin`) is for administrators to manage policies.

```bash
# Download
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-admin-linux-amd64
chmod +x gatekey-admin-linux-amd64
sudo mv gatekey-admin-linux-amd64 /usr/local/bin/gatekey-admin

# Login
gatekey-admin login --server https://vpn.yourcompany.com
```

---

## Docker Images

All Docker images are available on Docker Hub under the `dyetech` organization.

### Core Components

| Image | Description |
|-------|-------------|
| `dyetech/gatekey-server` | Control plane API server (API + embedded CA) |
| `dyetech/gatekey-web` | Web UI (nginx + React) |

### OpenVPN Components

| Image | Description |
|-------|-------------|
| `dyetech/gatekey-gateway` | OpenVPN gateway agent |
| `dyetech/gatekey-hub` | OpenVPN mesh hub server |
| `dyetech/gatekey-mesh-gateway` | OpenVPN mesh spoke gateway |

### WireGuard Components

| Image | Description |
|-------|-------------|
| `dyetech/gatekey-wireguard-gateway` | WireGuard gateway agent |
| `dyetech/gatekey-wireguard-hub` | WireGuard mesh hub server |
| `dyetech/gatekey-wireguard-mesh-gateway` | WireGuard mesh spoke gateway |

:::info Architecture Note
Since v1.5.0, the server image (`gatekey-server`) is API-only. The web UI is served separately via `gatekey-web`. This separation allows for better scaling and security isolation.
:::

## Next Steps

- [Server Setup](/docs/admin-guide/server-setup) - Configure the control plane
- [Gateway Setup](/docs/admin-guide/gateway-setup) - Deploy VPN gateways
- [Identity Providers](/docs/admin-guide/identity-providers) - Configure SSO

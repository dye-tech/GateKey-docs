---
sidebar_position: 1
title: Server Setup
description: Configure the GateKey control plane server
---

# Server Setup

Configure the GateKey control plane server.

## Configuration File

The server reads configuration from `configs/gatekey.yaml`:

```yaml
server:
  address: ":8080"
  tls_enabled: true
  tls_cert: "/etc/gatekey/certs/server.crt"
  tls_key: "/etc/gatekey/certs/server.key"

database:
  url: "postgres://gatekey:password@localhost/gatekey?sslmode=require"

auth:
  oidc:
    enabled: true
    providers:
      - name: "default"
        display_name: "Login with SSO"
        issuer: "https://your-idp.example.com"
        client_id: "gatekey"
        client_secret: "your-secret"
        redirect_url: "https://gatekey.example.com/api/v1/auth/oidc/callback"
        scopes: ["openid", "profile", "email", "groups"]
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `GATEKEY_ADMIN_PASSWORD` | Initial admin password | Auto-generated |
| `GATEKEY_JWT_SECRET` | JWT signing secret | Auto-generated |
| `GATEKEY_CA_VALIDITY_DAYS` | CA certificate validity | 3650 |
| `GATEKEY_CERT_VALIDITY_HOURS` | Client cert validity | 24 |

## Database Setup

```bash
# Create database
createdb gatekey

# Set connection string
export DATABASE_URL="postgres://user:pass@localhost/gatekey?sslmode=disable"

# Run migrations
./bin/gatekey-server migrate
```

## Running the Server

### Systemd Service

```ini
[Unit]
Description=GateKey Server
After=network.target postgresql.service

[Service]
Type=simple
User=gatekey
ExecStart=/usr/local/bin/gatekey-server --config /etc/gatekey/gatekey.yaml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Docker

:::info Architecture Change in v1.5.0
The server image is now API-only. The web UI is served separately via `gatekey-web`. For production deployments, run both containers.
:::

**API Server:**

```bash
docker run -d \
  --name gatekey-server \
  -p 8080:8080 \
  -e DATABASE_URL="postgres://..." \
  -e GATEKEY_ADMIN_PASSWORD="your-secure-password" \
  dyetech/gatekey-server:latest
```

**Web UI:**

```bash
docker run -d \
  --name gatekey-web \
  -p 80:80 \
  -e API_URL="http://gatekey-server:8080" \
  dyetech/gatekey-web:latest
```

## Reverse Proxy (nginx)

When running `gatekey-server` and `gatekey-web` as separate containers:

```nginx
server {
    listen 443 ssl http2;
    server_name vpn.example.com;

    ssl_certificate /etc/letsencrypt/live/vpn.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vpn.example.com/privkey.pem;

    # Web UI (served by gatekey-web container)
    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API (served by gatekey-server container)
    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health and metrics endpoints
    location /health {
        proxy_pass http://127.0.0.1:8080;
    }

    location /metrics {
        proxy_pass http://127.0.0.1:8080;
    }
}
```

## Health Check

```bash
curl https://vpn.example.com/health
# {"status": "ok"}
```

## Metrics

Prometheus metrics are available at `/metrics`:

```bash
curl https://vpn.example.com/metrics
```

## Next Steps

- [Gateway Setup](/docs/admin-guide/gateway-setup) - Deploy VPN gateways
- [Identity Providers](/docs/admin-guide/identity-providers) - Configure SSO
- [Access Control](/docs/admin-guide/access-control) - Set up policies

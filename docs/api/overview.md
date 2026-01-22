---
sidebar_position: 1
title: API Overview
description: GateKey REST API overview
---

# API Overview

GateKey provides a comprehensive REST API for managing all aspects of the VPN infrastructure.

## Base URL

All API endpoints are prefixed with `/api/v1/`.

```
https://vpn.yourcompany.com/api/v1/
```

## Authentication

### Session-Based (Web UI)

For web UI interactions, authentication uses session cookies obtained through OIDC/SAML login.

### API Key

For programmatic access, use API keys in the `Authorization` header:

```bash
curl -H "Authorization: Bearer gk_your_api_key_here" \
  https://vpn.yourcompany.com/api/v1/gateways
```

### Gateway Token

Gateway agents authenticate with gateway-specific tokens:

```bash
curl -H "X-Gateway-Token: your-gateway-token" \
  https://vpn.yourcompany.com/api/v1/gateway/heartbeat
```

## Response Format

All responses are JSON:

```json
{
  "data": { ... },
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  }
}
```

### Error Responses

```json
{
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired token"
  }
}
```

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

| Endpoint Type | Rate Limit |
|---------------|------------|
| Authentication | 50/min per IP |
| Gateway heartbeat | 120/min per gateway |
| Config generation | 30/min per user |
| Admin operations | 100/min per user |

## API Categories

### User Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/oidc/login` | GET | Initiate OIDC login |
| `/auth/oidc/callback` | GET | OIDC callback |
| `/auth/local/login` | POST | Local admin login |
| `/auth/logout` | POST | Logout |
| `/auth/session` | GET | Get current session |
| `/configs/generate` | POST | Generate VPN config |
| `/gateways` | GET | List available gateways |
| `/mesh/hubs` | GET | List available mesh hubs |

### Admin Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/users` | GET | List users |
| `/admin/gateways` | GET/POST | Manage gateways |
| `/admin/gateways/:id` | PUT/DELETE | Update/delete gateway |
| `/admin/networks` | GET/POST | Manage networks |
| `/admin/access-rules` | GET/POST | Manage access rules |
| `/admin/mesh/hubs` | GET/POST | Manage mesh hubs |
| `/admin/configs` | GET | List all VPN configs |
| `/admin/geo-fence/*` | * | Geo-fencing settings |

### Gateway Internal Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/gateway/heartbeat` | POST | Send heartbeat |
| `/gateway/verify` | POST | Verify client cert |
| `/gateway/connect` | POST | Report connection |
| `/gateway/disconnect` | POST | Report disconnection |
| `/gateway/provision` | POST | Get server certificates |
| `/gateway/client-rules` | POST | Get client access rules |
| `/gateway/all-rules` | POST | Get all rules for refresh |

### PKI Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/pki/crl` | GET | Download CRL (DER) |
| `/pki/crl.pem` | GET | Download CRL (PEM) |
| `/pki/check/:serial` | GET | Check cert revocation |
| `/admin/pki/revoke` | POST | Revoke certificate |

## Example: Generate VPN Config

```bash
# Get auth token first (via login)

# Generate OpenVPN config for a gateway
curl -X POST https://vpn.yourcompany.com/api/v1/configs/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gateway_id": "gw-001",
    "protocol": "openvpn"
  }'
```

Response:

```json
{
  "config_id": "cfg-abc123",
  "download_url": "/api/v1/configs/download/cfg-abc123",
  "expires_at": "2024-01-16T10:30:00Z"
}
```

## Example: List Gateways

```bash
curl https://vpn.yourcompany.com/api/v1/gateways \
  -H "Authorization: Bearer $TOKEN"
```

Response:

```json
{
  "data": [
    {
      "id": "gw-001",
      "name": "us-east-1",
      "description": "US East Coast Gateway",
      "hostname": "vpn-us-east.example.com",
      "port": 1194,
      "protocol": "udp",
      "status": "online",
      "last_heartbeat": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## SDK Libraries

Currently, GateKey provides a Go SDK for programmatic access. Community SDKs for other languages are welcome.

## OpenAPI Specification

The full OpenAPI specification is available at:

```
https://vpn.yourcompany.com/api/v1/openapi.json
```

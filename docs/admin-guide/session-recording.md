---
sidebar_position: 10
title: Session Recording
description: Record and audit remote sessions, proxy access, and network flows
---

# Session Recording & Audit

GateKey provides comprehensive session recording and audit capabilities for compliance (SOC2, HIPAA, PCI).

## Recording Types

### Terminal Session Recording
Records remote shell sessions (via the Remote Sessions feature) in asciicast v2 format.

- **Format**: Gzip-compressed asciicast v2 (compatible with asciinema-player)
- **Trigger**: Automatically starts when an admin connects to a gateway/hub/spoke agent
- **Content**: All terminal output with elapsed timestamps
- **Storage**: Local filesystem (configurable path)

### Proxy Access Logging
Enhanced logging for reverse proxy (Web Access) applications.

- **Metadata**: Method, path, status, response time, client IP, user agent (always logged)
- **Headers**: Optional request/response header capture (sensitive headers redacted)
- **Per-app controls**: Toggle logging and header capture per application

Sensitive headers automatically redacted: `Cookie`, `Authorization`, `Set-Cookie`, `X-Csrf-Token`, `X-Api-Key`

### VPN Network Flow Logging
Per-connection flow data from VPN gateway agents.

- **Data captured**: Source/destination IPs, port, protocol, bytes sent/received, duration
- **Reported by**: Gateway agents via `POST /api/v1/gateway/flow-report`
- **Dashboard**: Top destinations, per-user activity, aggregate statistics

### SSH Bastion Proxy
SSH jump host that records sessions and logs connections.

- **Session mode**: Terminates SSH at the bastion, records terminal I/O
- **Jump host mode** (`ssh -J`): Proxies raw TCP, logs connection metadata
- **Authentication**: GateKey API key as SSH password
- **Access control**: Enforces access rules against target host/port

## Configuration

Navigate to **Diagnostics > Recordings > Settings** tab.

### General Settings
| Setting | Description | Default |
|---------|-------------|---------|
| Recording Enabled | Master toggle for all recording | `false` |
| Storage Path | Directory for recording files | `/var/lib/gatekey/recordings` |
| Retention Days | Auto-delete recordings after N days | `90` |

### Session Type Toggles
| Toggle | Controls | Default |
|--------|----------|---------|
| Terminal Recording | Remote shell session recording | Enabled |
| Proxy Logging | Proxy app request logging | Enabled |
| Flow Logging | VPN network flow capture | Enabled |

### Privacy Masking
Regex patterns applied to terminal output before writing to recordings. Default patterns mask:
- `password=...` and similar
- `api_key=...`, `token=...`, `secret=...`
- `Bearer ...` tokens

Add custom patterns in the Settings tab (one regex per line).

### SSH Bastion
| Setting | Description | Default |
|---------|-------------|---------|
| Bastion Enabled | Start SSH bastion server | `false` |
| Bastion Port | SSH listen port | `2222` |

Target host key validation: set `GATEKEY_BASTION_TARGET_HOSTKEY` environment variable to a file path containing the target's SSH public key.

## Admin Pages

### Recordings (`/admin/recordings`)
Browse recorded terminal sessions. View metadata (user, target, duration, size) and replay recordings.

### Proxy Logs (`/admin/proxy-logs`)
Cross-application proxy access log viewer with filtering by app, user, method, and status code range. Expand rows to view captured request/response headers.

### Network Activity (`/admin/network-activity`)
VPN network flow dashboard with:
- **Stat cards**: Total flows, bytes, unique users, destinations, flows today
- **Flow Logs**: Filterable table (gateway, user, dest IP, protocol)
- **Top Destinations**: Most accessed destinations ranked by flow count

## API Endpoints

### Recording Management
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/recordings` | List recordings |
| GET | `/api/v1/admin/recordings/:id` | Get recording metadata |
| GET | `/api/v1/admin/recordings/:id/stream` | Stream asciicast data |
| DELETE | `/api/v1/admin/recordings/:id` | Delete recording |
| GET/PUT | `/api/v1/admin/recordings/settings` | Recording settings |

### Proxy Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/proxy-logs` | List proxy access logs |

### Network Flows
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/gateway/flow-report` | Gateway agent flow report |
| GET | `/api/v1/admin/flow-logs` | List flow logs |
| GET | `/api/v1/admin/flow-logs/stats` | Aggregate statistics |
| GET | `/api/v1/admin/flow-logs/top-destinations` | Top destinations |
| GET | `/api/v1/admin/flow-logs/user/:userId` | Per-user activity |

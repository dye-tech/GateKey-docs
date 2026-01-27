---
sidebar_position: 1
title: Configuration Reference
description: Complete configuration reference for all GateKey components
---

# Configuration Reference

This page provides complete configuration examples for all GateKey components.

## Overview

GateKey consists of several binaries, each with its own configuration file:

| Binary | Config File | Description |
|--------|-------------|-------------|
| `gatekey-server` | `server.yaml` | Control plane server |
| `gatekey-gateway` | `openvpn-gateway.yaml` | OpenVPN gateway agent |
| `gatekey-wireguard-gateway` | `wireguard-gateway.yaml` | WireGuard gateway agent |
| `gatekey-hub` | `openvpn-hub.yaml` | OpenVPN mesh hub |
| `gatekey-wireguard-hub` | `wireguard-hub.yaml` | WireGuard mesh hub |
| `gatekey-mesh-gateway` | `mesh-gateway.yaml` | OpenVPN mesh spoke |
| `gatekey-wireguard-mesh-gateway` | `wireguard-mesh-gateway.yaml` | WireGuard mesh spoke |
| `gatekey` | `client.yaml` | CLI client |

## Server Configuration

**Binary:** `gatekey-server`
**Environment prefix:** `GATEX_` (e.g., `GATEX_DATABASE_URL`)

```yaml
# GateKey Control Plane Server Configuration
# Default location: /etc/gatekey/server.yaml

# Server settings
server:
  # HTTP listen address
  address: ":8080"

  # TLS configuration
  tls_enabled: false
  tls_cert: ""
  tls_key: ""

  # Enable profiling endpoints (disable in production)
  pprof_enabled: false

# Database configuration
database:
  # PostgreSQL connection URL
  # Can also be set via GATEX_DATABASE_URL environment variable
  url: "postgres://gatekey:password@localhost:5432/gatekey?sslmode=disable"

# PKI settings for certificate authority
pki:
  # CA certificate validity (days)
  ca_validity_days: 3650
  # Client certificate validity (hours)
  cert_validity_hours: 24

# Authentication configuration
auth:
  # OIDC providers
  oidc:
    enabled: true
    providers:
      - name: "default"
        display_name: "Login with SSO"
        issuer: "https://idp.example.com"
        client_id: "gatekey"
        client_secret: "${GATEX_OIDC_CLIENT_SECRET}"
        redirect_url: "https://gatekey.example.com/api/v1/auth/oidc/callback"
        scopes:
          - "openid"
          - "profile"
          - "email"
          - "groups"
        # Claim mappings
        username_claim: "preferred_username"
        email_claim: "email"
        groups_claim: "groups"

  # SAML providers (optional)
  saml:
    enabled: false

# Gateway management
gateway:
  # Default heartbeat timeout
  heartbeat_timeout: "90s"
  # Token length for gateway registration
  token_length: 32

# Policy engine
policy:
  # Refresh interval for policy rules
  refresh_interval: "30s"
  # Enable debug logging for policy evaluation
  debug: false

# Logging
logging:
  # Log level: debug, info, warn, error
  level: "info"
  # Log format: json, text
  format: "json"

# Prometheus metrics
metrics:
  # Enable metrics endpoint
  enabled: true
  # Metrics path
  path: "/metrics"

# Audit logging
audit:
  # Enable audit logging
  enabled: true
  # Retention period
  retention_days: 90

# Security settings
security:
  # Rate limiting
  rate_limit:
    enabled: true
    requests_per_second: 100
    burst: 200

  # CORS settings
  cors:
    allowed_origins:
      - "https://gatekey.example.com"
    allowed_methods:
      - "GET"
      - "POST"
      - "PUT"
      - "DELETE"
```

## OpenVPN Gateway Configuration

**Binary:** `gatekey-gateway`
**Environment prefix:** `GATEX_` (e.g., `GATEX_TOKEN`)

```yaml
# GateKey OpenVPN Gateway Agent Configuration
# Default location: /etc/gatekey/gateway.yaml

# Control plane URL
control_plane_url: "https://gatekey.example.com"

# Gateway authentication token (obtain from control plane)
token: "${GATEX_TOKEN}"

# Heartbeat interval
heartbeat_interval: "30s"

# Rule refresh interval (how often to refresh firewall rules)
rule_refresh_interval: "30s"

# Log level: debug, info, warn, error
log_level: "info"

# OpenVPN integration
openvpn:
  # Path to OpenVPN status file
  status_file: "/var/log/openvpn/status.log"
  # Path to management socket
  management_socket: "/var/run/openvpn/management.sock"
  # Client config directory
  client_config_dir: "/etc/openvpn/ccd"

# Firewall configuration
firewall:
  # Firewall backend: nftables or iptables
  backend: "nftables"
  # Chain name for GateKey rules
  chain: "GATEKEY"
  # Table name (nftables only)
  table: "gatekey"
  # Default policy: accept or drop
  default_policy: "drop"

# Network configuration
network:
  # VPN interface name
  interface: "tun0"
  # VPN network CIDR
  network: "172.31.255.0/24"
```

## WireGuard Gateway Configuration

**Binary:** `gatekey-wireguard-gateway`
**Environment prefix:** `GATEKEY_WG_` (e.g., `GATEKEY_WG_TOKEN`)

```yaml
# GateKey WireGuard Gateway Agent Configuration
# Default location: /etc/gatekey/wireguard-gateway.yaml

# Control plane URL
control_plane_url: "https://gatekey.example.com"

# Gateway authentication token (obtain from control plane)
token: "${GATEKEY_WG_TOKEN}"

# Heartbeat interval
heartbeat_interval: "30s"

# Peer sync interval (how often to fetch authorized peers from control plane)
peer_sync_interval: "10s"

# Stats sync interval (how often to report peer traffic stats)
stats_sync_interval: "5s"

# Log level: debug, info, warn, error
log_level: "info"

# Remote agent configuration
# The agent allows remote tool execution from the control plane
agent_enabled: true
agent_listen_addr: ":9444"

# Remote session support
# Allows SSH-like sessions through the control plane
session_enabled: true

# WireGuard configuration
wireguard:
  # Interface name
  interface: "wg0"
  # Listen port (default: from control plane provisioning)
  listen_port: 51820
  # Path to store interface config
  config_path: "/etc/wireguard/wg0.conf"

# Firewall configuration
firewall:
  # Firewall backend: nftables or iptables
  backend: "nftables"
  # Chain name for GateKey rules
  chain: "GATEKEY"
  # Table name (nftables only)
  table: "gatekey"
  # Default policy: accept or drop
  default_policy: "drop"

# Network configuration
network:
  # VPN interface name (same as wireguard.interface)
  interface: "wg0"
  # VPN network CIDR (populated from control plane during provisioning)
  network: "172.31.255.0/24"
```

## OpenVPN Mesh Hub Configuration

**Binary:** `gatekey-hub`
**Environment prefix:** `GATEKEY_HUB_` (e.g., `GATEKEY_HUB_API_TOKEN`)

```yaml
# GateKey OpenVPN Mesh Hub Configuration
# Default location: /etc/gatekey/hub.yaml

# Hub name (used for identification in control plane)
name: "hub-1"

# Control plane URL
control_plane_url: "https://gatekey.example.com"

# API token for authentication with control plane (obtain from control plane)
api_token: "${GATEKEY_HUB_API_TOKEN}"

# VPN configuration
vpn_port: 1194
vpn_protocol: "udp"  # udp or tcp

# Heartbeat interval (how often to send status to control plane)
heartbeat_interval: "30s"

# Log level: debug, info, warn, error
log_level: "info"

# Remote agent configuration
# The agent allows remote tool execution from the control plane
agent_enabled: true
agent_listen_addr: ":9443"

# Remote session support
# Allows SSH-like sessions through the control plane
session_enabled: true
```

## WireGuard Mesh Hub Configuration

**Binary:** `gatekey-wireguard-hub`
**Environment prefix:** `GATEKEY_WG_HUB_` (e.g., `GATEKEY_WG_HUB_API_TOKEN`)

```yaml
# GateKey WireGuard Mesh Hub Configuration
# Default location: /etc/gatekey/wireguard-hub.yaml

# Hub name (used for identification in control plane)
name: "wg-hub-1"

# Control plane URL
control_plane_url: "https://gatekey.example.com"

# API token for authentication with control plane (obtain from control plane)
api_token: "${GATEKEY_WG_HUB_API_TOKEN}"

# Heartbeat interval (how often to send status to control plane)
heartbeat_interval: "30s"

# Peer sync interval (how often to fetch authorized peers from control plane)
peer_sync_interval: "10s"

# Stats sync interval (how often to report peer traffic stats)
stats_sync_interval: "5s"

# Log level: debug, info, warn, error
log_level: "info"

# WireGuard interface name
interface_name: "wg0"

# Remote agent configuration
# The agent allows remote tool execution from the control plane
agent_enabled: true
agent_listen_addr: ":9445"

# Remote session support
# Allows SSH-like sessions through the control plane
session_enabled: true
```

## OpenVPN Mesh Gateway (Spoke) Configuration

**Binary:** `gatekey-mesh-gateway`
**Environment prefix:** `GATEKEY_MESH_` (e.g., `GATEKEY_MESH_GATEWAY_TOKEN`)

```yaml
# GateKey OpenVPN Mesh Gateway (Spoke) Configuration
# Default location: /etc/gatekey/mesh-gateway.yaml

# Gateway name (used for identification in control plane)
name: "spoke-1"

# Control plane URL
control_plane_url: "https://gatekey.example.com"

# Gateway token for authentication (obtain from control plane when registering)
gateway_token: "${GATEKEY_MESH_GATEWAY_TOKEN}"

# Hub endpoint (usually auto-provisioned from control plane)
# Format: hostname or hostname:port
# hub_endpoint: "hub.example.com:1194"

# Local networks to advertise to the hub
# These networks will be routable through this gateway
local_networks:
  - "10.0.0.0/24"
  - "192.168.1.0/24"

# Heartbeat interval (how often to send status to control plane)
heartbeat_interval: "30s"

# Log level: debug, info, warn, error
log_level: "info"

# Remote session support
# Allows SSH-like sessions through the control plane
session_enabled: true
```

## WireGuard Mesh Gateway (Spoke) Configuration

**Binary:** `gatekey-wireguard-mesh-gateway`
**Environment prefix:** `GATEKEY_WG_MESH_` (e.g., `GATEKEY_WG_MESH_GATEWAY_TOKEN`)

```yaml
# GateKey WireGuard Mesh Gateway (Spoke) Configuration
# Default location: /etc/gatekey/wireguard-mesh-gateway.yaml

# Gateway name (used for identification in control plane)
name: "wg-spoke-1"

# Control plane URL
control_plane_url: "https://gatekey.example.com"

# Gateway token for authentication (obtain from control plane when registering)
gateway_token: "${GATEKEY_WG_MESH_GATEWAY_TOKEN}"

# Heartbeat interval (how often to send status to control plane)
heartbeat_interval: "30s"

# Log level: debug, info, warn, error
log_level: "info"

# WireGuard interface name
interface_name: "wg0"

# Remote session support
# Allows SSH-like sessions through the control plane
session_enabled: true
```

## Client Configuration

**Binary:** `gatekey`
**Default location:** `~/.gatekey/config.yaml`

```yaml
# GateKey Client Configuration
# Initialize with: gatekey config init --server https://gatekey.example.com

# GateKey server URL
server_url: "https://gatekey.example.com"

# OpenVPN binary path (default: searches PATH)
openvpn_binary: "openvpn"

# WireGuard binary path (default: searches PATH)
wireguard_binary: "wg-quick"

# Configuration directory for downloaded VPN configs
# Default: ~/.gatekey/configs
config_dir: ""

# Log level: debug, info, warn, error
log_level: "info"

# API key for non-interactive authentication (optional)
# Generate from the GateKey web UI under Settings > API Keys
# Prefer using environment variable GATEKEY_API_KEY for security
# api_key: ""
```

## Environment Variables

All configuration options can be overridden via environment variables. The variable name is constructed by:

1. Using the appropriate prefix for the binary
2. Converting the YAML path to uppercase with underscores

### Examples

| Binary | Config Key | Environment Variable |
|--------|------------|---------------------|
| `gatekey-server` | `database.url` | `GATEX_DATABASE_URL` |
| `gatekey-gateway` | `token` | `GATEX_TOKEN` |
| `gatekey-wireguard-gateway` | `token` | `GATEKEY_WG_TOKEN` |
| `gatekey-hub` | `api_token` | `GATEKEY_HUB_API_TOKEN` |
| `gatekey-wireguard-hub` | `api_token` | `GATEKEY_WG_HUB_API_TOKEN` |
| `gatekey-mesh-gateway` | `gateway_token` | `GATEKEY_MESH_GATEWAY_TOKEN` |
| `gatekey-wireguard-mesh-gateway` | `gateway_token` | `GATEKEY_WG_MESH_GATEWAY_TOKEN` |

### Sensitive Values

For sensitive values like tokens and secrets, always prefer environment variables over config files:

```bash
# Good: Use environment variable
export GATEX_TOKEN="your-gateway-token"

# Avoid: Plaintext in config file
# token: "your-gateway-token"
```

## Default Paths

| Component | Default Config Path |
|-----------|-------------------|
| Server | `/etc/gatekey/server.yaml` |
| Gateway | `/etc/gatekey/gateway.yaml` |
| Hub | `/etc/gatekey/hub.yaml` |
| Client | `~/.gatekey/config.yaml` |

All binaries accept a `--config` flag to specify an alternate configuration file path.

---
sidebar_position: 1
title: Client CLI
description: Complete reference for the GateKey CLI client
---

# GateKey Client CLI

The GateKey Client (`gatekey`) is a user-facing VPN client that wraps OpenVPN/WireGuard to provide seamless, zero-configuration VPN connectivity.

## Commands

### login

Authenticate with the GateKey server using your identity provider (OIDC/SAML) or an API key.

```bash
gatekey login [flags]
```

**Flags:**
- `--no-browser` - Print the login URL instead of opening a browser
- `--api-key string` - Authenticate with an API key instead of browser-based SSO

**Examples:**
```bash
# Normal login (opens browser)
gatekey login

# Headless/SSH login (copy URL to another browser)
gatekey login --no-browser

# Login with API key
gatekey login --api-key gk_your_api_key_here
```

### logout

Clear saved credentials from your local machine.

```bash
gatekey logout
```

### connect

Connect to a VPN gateway. The client supports connecting to multiple gateways simultaneously.

```bash
gatekey connect [gateway] [flags]
```

**Flags:**
- `-g, --gateway string` - Gateway name to connect to
- `--mesh` - Connect to a mesh hub instead of a standard gateway

**Behavior:**
- If only one gateway is available, connects automatically
- If multiple gateways exist and none specified, lists available options
- Downloads a fresh, short-lived VPN configuration
- Starts OpenVPN/WireGuard in daemon mode
- Requires sudo/root for VPN

**Examples:**
```bash
# Connect to default/only gateway
gatekey connect

# Connect to a specific gateway
gatekey connect us-east-1

# Connect to multiple gateways simultaneously
gatekey connect us-east-1    # Gets tun0
gatekey connect eu-west-1    # Gets tun1

# Connect to a mesh hub
gatekey connect --mesh primary-hub
```

### disconnect

Disconnect from VPN gateway(s).

```bash
gatekey disconnect [gateway] [flags]
```

**Flags:**
- `-a, --all` - Disconnect from all gateways

**Examples:**
```bash
# Disconnect from single/all gateway(s)
gatekey disconnect

# Disconnect from a specific gateway
gatekey disconnect us-east-1

# Disconnect from all gateways explicitly
gatekey disconnect --all
```

### status

Show the current VPN connection status.

```bash
gatekey status [flags]
```

**Flags:**
- `--json` - Output in JSON format

**Single connection output:**
```
Status: Connected
Gateway:      us-east-1
Interface:    tun0
Connected at: 2024-01-15T10:30:00Z
Duration:     2h15m30s
Local IP:     10.8.0.5
PID:          12345

Routes:
  10.0.0.0/8
```

**Multiple connections output:**
```
Status: Connected to 2 gateways

  us-east-1:
    Status:    Connected
    Interface: tun0
    Duration:  2h15m30s
    PID:       12345

  eu-west-1:
    Status:    Connected
    Interface: tun1
    Duration:  1h30m15s
    PID:       12346
```

### list

List available VPN gateways.

```bash
gatekey list
```

**Example output:**
```
Available Gateways:
-------------------
✓ us-east-1
  Description: US East Coast Gateway
  Location:    Virginia, USA
  Hostname:    vpn-us-east.example.com
  Status:      online

✓ eu-west-1
  Description: EU West Gateway
  Location:    Dublin, Ireland
  Hostname:    vpn-eu-west.example.com
  Status:      online
```

### mesh

Manage mesh network connections.

```bash
gatekey mesh list
```

**Example output:**
```
Available Mesh Hubs:
--------------------
✓ primary-hub
  Endpoint:    hub.example.com:1194
  Protocol:    UDP
  Status:      online
  Networks:    3 networks available
```

### config

Manage client configuration.

```bash
gatekey config <subcommand>
```

**Subcommands:**

#### config init

Initialize configuration with a server URL.

```bash
gatekey config init --server https://vpn.company.com
```

#### config show

Display current configuration.

```bash
gatekey config show
```

#### config set

Set a configuration value.

```bash
gatekey config set <key> <value>
```

**Available keys:**
- `server_url` or `server` - GateKey server URL
- `openvpn_binary` or `openvpn` - Path to OpenVPN binary
- `config_dir` - Directory for VPN configs
- `log_level` - Logging level (debug, info, warn, error)

## Global Flags

| Flag | Description |
|------|-------------|
| `--server string` | GateKey server URL (overrides config) |
| `--config string` | Config file path (default: ~/.gatekey/config.yaml) |
| `-h, --help` | Help for the command |

## Configuration

### Config File Location

The client stores configuration in `~/.gatekey/config.yaml`:

```yaml
server_url: https://vpn.company.com
openvpn_binary: openvpn
config_dir: /home/user/.gatekey/configs
log_level: info
```

### Data Directory

All client data is stored in `~/.gatekey/`:

```
~/.gatekey/
├── config.yaml              # Client configuration
├── token                    # Authentication token (encrypted)
├── state.json               # Multi-connection state
├── <gateway>.ovpn           # Gateway-specific VPN configuration
├── openvpn-<gateway>.pid    # Gateway-specific OpenVPN process ID
├── openvpn-<gateway>.log    # Gateway-specific OpenVPN log file
└── configs/                 # Downloaded configurations
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GATEKEY_SERVER` | Default server URL |
| `GATEKEY_CONFIG` | Config file path |
| `GATEKEY_LOG_LEVEL` | Log level (debug, info, warn, error) |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Authentication required |
| 3 | Connection failed |
| 4 | Already connected |

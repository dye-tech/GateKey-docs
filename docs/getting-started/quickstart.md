---
sidebar_position: 2
title: Quick Start
description: Get connected to GateKey VPN in 5 minutes
---

# Quick Start Guide

Get connected to your GateKey VPN in under 5 minutes.

## Prerequisites

You need a VPN client installed on your machine:

### OpenVPN Client

| Platform | Installation |
|----------|--------------|
| macOS | `brew install openvpn` |
| Ubuntu/Debian | `sudo apt install openvpn` |
| Fedora | `sudo dnf install openvpn` |
| Windows | [Download OpenVPN Connect](https://openvpn.net/client/) |

### WireGuard Client (Alternative)

| Platform | Installation |
|----------|--------------|
| macOS | [WireGuard App Store](https://apps.apple.com/us/app/wireguard/id1451685025) |
| Ubuntu/Debian | `sudo apt install wireguard-tools` |
| Fedora | `sudo dnf install wireguard-tools` |
| Windows | [Download WireGuard](https://www.wireguard.com/install/) |

## Install the GateKey Client

### Option 1: Homebrew (macOS/Linux)

```bash
brew tap dye-tech/gatekey
brew install gatekey
```

### Option 2: Download Binary

```bash
# Linux (amd64)
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-linux-amd64.tar.gz
tar -xzf gatekey-linux-amd64.tar.gz
sudo mv gatekey /usr/local/bin/

# macOS (Apple Silicon)
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-darwin-arm64.tar.gz
tar -xzf gatekey-darwin-arm64.tar.gz
sudo mv gatekey /usr/local/bin/
```

### Option 3: Build from Source

```bash
git clone https://github.com/dye-tech/GateKey.git
cd GateKey
make build-client
sudo cp bin/gatekey /usr/local/bin/
```

## Connect to VPN

### Step 1: Configure Your Server

Point the client at your company's GateKey server (run once):

```bash
gatekey config init --server https://vpn.yourcompany.com
```

### Step 2: Login

Authenticate with your company credentials:

```bash
gatekey login
```

This opens your browser for SSO login (Okta, Azure AD, Google, etc.).

:::tip Headless Environments
For servers without a browser, use `--no-browser`:
```bash
gatekey login --no-browser
# Copy the printed URL to a browser on another machine
```
:::

### Step 3: Connect

```bash
gatekey connect
```

**That's it!** You're connected.

### Step 4: Check Status

```bash
gatekey status
```

Example output:
```
Status: Connected
Gateway:      us-east-1
Interface:    tun0
Connected at: 2024-01-15T10:30:00Z
Duration:     2h15m30s
Local IP:     10.8.0.5
```

### Step 5: Disconnect

```bash
gatekey disconnect
```

## What Just Happened?

1. **`gatekey login`** - Opened your browser to authenticate with your company's SSO
2. **`gatekey connect`** - Downloaded a short-lived VPN config (valid ~24 hours) and connected
3. Your firewall rules were automatically applied based on your role/group membership
4. Configs auto-refresh, so you never deal with expired certificates

## Alternative: Web UI

If you prefer not to use the CLI, you can use the web interface.

### Step 1: Login

Navigate to your GateKey server and authenticate with your identity provider:

![GateKey Login Page](/img/screenshots/keycloak_saml_support.png)

GateKey supports multiple SSO providers including Keycloak, SAML, and local authentication.

### Step 2: Dashboard

After login, you'll see the dashboard with your available resources:

![GateKey Dashboard](/img/screenshots/dashboard.png)

The dashboard shows:
- **Stats** - Gateways, networks, users, access rules, and proxy apps
- **Quick Actions** - Connect to VPN, mesh networks, web access
- **Your Gateways** - Available VPN gateways with status
- **Your Mesh Networks** - Hub-and-spoke mesh networks
- **Your Web Apps** - Clientless web access to internal applications

### Step 3: Connect to VPN

Click "Connect to VPN" to see available gateways and connection instructions:

![Connect to VPN](/img/screenshots/gateway.png)

You can either:
- Use the **CLI commands** shown on the right (recommended)
- Download a **manual configuration** file for your VPN client

## Video Demos

### CLI Demo

Watch the GateKey CLI in action:

<video controls width="100%">
  <source src="/video/demo_cli.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>

### Full Overview

See a complete walkthrough of GateKey features:

<video controls width="100%">
  <source src="/video/full_overview.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>

## Next Steps

- [Client CLI Reference](/docs/user-guide/client-cli) - All CLI commands
- [Multi-Gateway Connections](/docs/user-guide/multi-gateway) - Connect to multiple gateways
- [Troubleshooting](/docs/user-guide/troubleshooting) - Common issues and solutions

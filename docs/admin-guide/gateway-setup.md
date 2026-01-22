---
sidebar_position: 2
title: Gateway Setup
description: Deploy OpenVPN gateways
---

# Gateway Setup

Deploy and configure OpenVPN gateway agents.

## Prerequisites

- Linux server with root access
- OpenVPN 2.5+
- nftables for firewall rules
- Network connectivity to the control plane

## Install Script (Recommended)

```bash
curl -sSL https://vpn.yourcompany.com/scripts/install-gateway.sh | sudo bash -s -- \
  --server https://vpn.yourcompany.com \
  --token YOUR_GATEWAY_TOKEN \
  --name my-gateway
```

## Manual Installation

### 1. Install OpenVPN

```bash
# Ubuntu/Debian
sudo apt install openvpn

# Fedora/RHEL
sudo dnf install openvpn
```

### 2. Download Gateway Binary

```bash
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-gateway-linux-amd64
chmod +x gatekey-gateway-linux-amd64
sudo mv gatekey-gateway-linux-amd64 /usr/local/bin/gatekey-gateway
```

### 3. Create Configuration

```bash
sudo mkdir -p /etc/gatekey

sudo cat > /etc/gatekey/gateway.yaml << EOF
server_url: https://vpn.yourcompany.com
gateway_token: your-gateway-registration-token
openvpn_config: /etc/openvpn/server.conf
EOF
```

### 4. Register Gateway

In the GateKey web UI:

1. Go to **Administration** → **Gateways**
2. Click **Add Gateway**
3. Enter a name and description
4. Copy the registration token

### 5. Create Systemd Service

```bash
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
```

### 6. Start Services

```bash
sudo systemctl daemon-reload
sudo systemctl enable gatekey-gateway
sudo systemctl start gatekey-gateway
```

## Gateway Configuration Options

```yaml
server_url: https://vpn.yourcompany.com
gateway_token: your-token

# OpenVPN settings
openvpn_config: /etc/openvpn/server.conf
openvpn_status_file: /var/log/openvpn/status.log
openvpn_client_config_dir: /etc/openvpn/ccd

# Firewall backend
firewall:
  backend: nftables  # or iptables

# Logging
log_level: info
log_file: /var/log/gatekey/gateway.log
```

## Verify Gateway Status

In the web UI, the gateway should show as "Online" within 30 seconds.

From the gateway server:

```bash
journalctl -u gatekey-gateway -f
```

## Troubleshooting

### Gateway shows "Offline"

1. Check the gateway agent logs
2. Verify network connectivity to control plane
3. Ensure the token is correct

### Connections rejected

1. Check firewall rules on the gateway
2. Verify the certificate was provisioned correctly
3. Check control plane logs for auth errors

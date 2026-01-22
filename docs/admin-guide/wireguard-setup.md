---
sidebar_position: 3
title: WireGuard Setup
description: Deploy WireGuard gateways
---

# WireGuard Gateway Setup

Deploy WireGuard gateways as an alternative to OpenVPN.

## Prerequisites

- Linux server with root access
- WireGuard kernel module or wireguard-go
- nftables for firewall rules
- Network connectivity to the control plane

## Install WireGuard

```bash
# Ubuntu/Debian
sudo apt install wireguard-tools

# Fedora/RHEL
sudo dnf install wireguard-tools
```

## Download Gateway Binary

```bash
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-wireguard-gateway-linux-amd64
chmod +x gatekey-wireguard-gateway-linux-amd64
sudo mv gatekey-wireguard-gateway-linux-amd64 /usr/local/bin/gatekey-wireguard-gateway
```

## Create Configuration

```bash
sudo mkdir -p /etc/gatekey

sudo cat > /etc/gatekey/wireguard-gateway.yaml << EOF
server_url: https://vpn.yourcompany.com
gateway_token: your-gateway-registration-token
interface_name: wg0
listen_port: 51820
EOF
```

## Create Systemd Service

```bash
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
```

## Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable gatekey-wireguard-gateway
sudo systemctl start gatekey-wireguard-gateway
```

## WireGuard vs OpenVPN

| Feature | OpenVPN | WireGuard |
|---------|---------|-----------|
| Protocol | UDP or TCP | UDP only |
| Port | 1194 (default) | 51820 (default) |
| Client Auth | X.509 Certificates | Public Key |
| Config Format | `.ovpn` | `.conf` |
| Cryptography | Configurable | Fixed (Curve25519, ChaCha20) |
| Performance | Good | Excellent |
| Mobile Support | Good | Excellent |

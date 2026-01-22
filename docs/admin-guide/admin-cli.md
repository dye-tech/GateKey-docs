---
sidebar_position: 7
title: Admin CLI
description: Administrative command-line tool
---

# Admin CLI

The `gatekey-admin` CLI provides administrative capabilities.

## Installation

```bash
curl -LO https://github.com/dye-tech/GateKey/releases/latest/download/gatekey-admin-linux-amd64
chmod +x gatekey-admin-linux-amd64
sudo mv gatekey-admin-linux-amd64 /usr/local/bin/gatekey-admin
```

## Login

```bash
gatekey-admin login --server https://vpn.yourcompany.com
```

## User Management

```bash
# List users
gatekey-admin users list

# Get user details
gatekey-admin users get USER_ID

# Disable user
gatekey-admin user disable USER_ID --reason "Security concern"

# Enable user
gatekey-admin user enable USER_ID

# Disconnect all user sessions
gatekey-admin user disconnect USER_ID

# View user sessions
gatekey-admin user sessions USER_ID
```

## Gateway Management

```bash
# List gateways
gatekey-admin gateways list

# Get gateway status
gatekey-admin gateways get GATEWAY_ID
```

## Access Rules

```bash
# List rules
gatekey-admin rules list

# Create rule
gatekey-admin rules create --name "Engineering" --cidr "10.0.0.0/8"

# Delete rule
gatekey-admin rules delete RULE_ID
```

## API Keys

```bash
# Create API key for user
gatekey-admin api-keys create --user user@example.com --name "CI/CD Key"

# List API keys
gatekey-admin api-keys list

# Revoke API key
gatekey-admin api-keys revoke KEY_ID
```

## Certificates

```bash
# Revoke a certificate
gatekey-admin pki revoke --serial SERIAL_NUMBER --reason "Key compromise"

# List revocations
gatekey-admin pki revocations
```

## Output Formats

```bash
# JSON output
gatekey-admin users list --output json

# Table output (default)
gatekey-admin users list --output table
```

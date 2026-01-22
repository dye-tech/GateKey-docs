---
sidebar_position: 5
title: Access Control
description: Configure networks, access rules, and user permissions
---

# Access Control

Configure access policies for your VPN infrastructure.

## Concepts

### Networks

CIDR blocks that define routable destinations:

```
10.0.0.0/8       - Corporate network
192.168.1.0/24   - Production servers
172.16.0.0/16    - Development environment
```

### Access Rules

Specific permissions within networks:

| Type | Example | Description |
|------|---------|-------------|
| `ip` | `192.168.1.100` | Single IP address |
| `cidr` | `10.0.0.0/24` | CIDR range |
| `hostname` | `api.internal.com` | Exact hostname |
| `hostname_wildcard` | `*.internal.com` | Wildcard hostname |

### Gateways

VPN entry points that users connect to. Users must be assigned to a gateway to generate configs.

## Creating Networks

1. Navigate to **Administration** → **Networks**
2. Click **Add Network**
3. Enter:
   - Name: "Production"
   - CIDR: "192.168.1.0/24"
   - Description: "Production server network"
4. Click **Save**

## Creating Access Rules

1. Navigate to **Administration** → **Access Rules**
2. Click **Add Rule**
3. Configure:
   - Name: "Production Database"
   - Type: IP
   - Value: "192.168.1.100"
   - Port Range: "5432" (optional)
   - Protocol: "tcp" (optional)
4. Assign to users or groups
5. Click **Save**

## Assigning Access

### User Assignment

1. Go to the access rule
2. Click **Assign Users**
3. Select users
4. Save

### Group Assignment

1. Go to the access rule
2. Click **Assign Groups**
3. Select groups (synced from IdP)
4. Save

Groups are synced from your identity provider. Users in those groups automatically get the access rules.

## Gateway Access

Users must be assigned to gateways:

1. Navigate to **Administration** → **Gateways**
2. Select a gateway
3. Click **Manage Access**
4. Add users or groups
5. Save

## Effective Permissions

A user's effective access is:

1. Union of directly assigned rules
2. Plus rules assigned to their groups
3. Filtered to gateways they have access to

## Example Setup

### Engineering Team

1. Create network "Engineering" (10.0.0.0/8)
2. Create access rules for services they need
3. Assign rules to "engineering" group
4. Assign "engineering" group to appropriate gateways

### Contractors

1. Create specific access rules (limited scope)
2. Assign to individual contractor users
3. Assign users to gateway with limited networks

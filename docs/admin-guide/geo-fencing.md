---
sidebar_position: 6
title: Geo-Fencing
description: IP-based access restrictions
---

# Geo-Fencing

Restrict VPN access based on client source IP addresses.

## Overview

Geo-fencing uses a **whitelist model**—only connections from explicitly allowed IP ranges are permitted.

## Enabling Geo-Fencing

1. Navigate to **Administration** → **Geo-Fencing**
2. Toggle **Enable Geo-Fencing**
3. Select enforcement mode:
   - **Enforce**: Block connections from unlisted IPs
   - **Audit**: Log violations but allow connections (for testing)

## Creating Rules

1. Click **Add Rule**
2. Enter:
   - Name: "US Office"
   - CIDR: "203.0.113.0/24"
   - Description: "US headquarters IP range"
3. Save

## Rule Assignment

### Global Rules

Apply to all users:

1. Go to **Global Rules** tab
2. Add rules that should apply to everyone

### Group Rules

Apply to specific groups:

1. Go to **Group Rules** tab
2. Select a group
3. Add rules for that group

### User Rules

Apply to specific users:

1. Go to **User Rules** tab
2. Select a user
3. Add rules for that user

## Rule Priority

Most specific wins:

| Priority | Level | Description |
|----------|-------|-------------|
| 1 (highest) | User | Rules assigned directly to user |
| 2 | Group | Rules assigned to user's groups |
| 3 (lowest) | Global | Default rules for everyone |

If a user has user-specific rules, only those are evaluated.

## Use Cases

### Country Restriction

Allow only IPs from specific countries using their IP ranges.

### Office Only

Restrict access to corporate office IP addresses.

### Remote Worker Exception

Allow specific users from any IP while restricting others.

### Contractor Restrictions

Limit contractors to office network only.

## Testing

1. Enable geo-fencing in **Audit** mode
2. Monitor the audit logs for violations
3. Adjust rules as needed
4. Switch to **Enforce** mode when ready

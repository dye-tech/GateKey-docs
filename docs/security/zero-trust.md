---
sidebar_position: 1
title: Zero Trust Model
description: GateKey's zero-trust security architecture
---

# Zero Trust Security Model

GateKey implements a **Zero Trust Software Defined Perimeter (SDP)** security model. The core principle is **"Never Trust, Always Verify"**—no user or device is trusted by default, and every access request is fully authenticated, authorized, and verified.

## Default Deny Policy

**All traffic is blocked by default.** Users can only access resources that are explicitly permitted by:

1. Being assigned to a gateway (directly or via group membership)
2. Having access rules that permit specific destinations

This is fundamentally different from traditional VPNs where connecting grants full network access.

## Zero Trust Principles

### 1. Never Trust, Always Verify

Every connection is authenticated and authorized. Having a valid VPN config doesn't grant access—credentials are re-verified at connection time.

### 2. Least Privilege

Users only access resources explicitly allowed by policy. Default policy is DENY ALL.

### 3. Assume Breach

Short-lived certificates (24 hours default) limit the exposure window if credentials are compromised.

### 4. Continuous Verification

Sessions are validated on each connection. Access can be revoked at any time.

## Permission Model

### Entity Relationships

![Entity Relationships](/img/diagrams/entity-relationships.svg)

### Access Control Layers

| Layer | Entity | Purpose |
|-------|--------|---------|
| **1. Gateway Access** | User/Group → Gateway | Controls who can connect to a VPN gateway |
| **2. Network Routes** | Network → Gateway | Controls what CIDR blocks are advertised |
| **3. Access Rules** | User/Group → Access Rule | Controls what specific IPs/hosts users can reach |

### Permission Flow

![Permission Flow](/img/diagrams/permission-flow.svg)

## Security Enforcement Points

GateKey enforces security at **three distinct points**, providing defense in depth:

### 1. Config Generation

When a user requests a VPN configuration file:

- **Authentication**: User must have valid session
- **Gateway Status**: Gateway must be active
- **Access Check**: User must be assigned to gateway
- **Certificate Binding**: Certificate is bound to specific gateway ID

### 2. Gateway Verify

When OpenVPN attempts to authenticate a connection:

- **Certificate Validity**: Not expired or revoked
- **Gateway Binding**: Certificate issued for this specific gateway
- **User Lookup**: User must exist in the system
- **Account Status**: User account must be active
- **Access Recheck**: User must still have gateway access

### 3. Gateway Connect

When a connection is established:

- **User Verification**: Re-verify user exists and has access
- **Access Rules**: Retrieve all rules for user (direct + group-based)
- **Firewall Rules**: Generate rules with default DENY policy
- **Rule Application**: Gateway agent applies nftables rules

## Why Multiple Enforcement Points?

Even if a user obtains a valid `.ovpn` config file, they cannot bypass security:

| Scenario | Protection |
|----------|------------|
| User shares config file | Certificate CN contains original user's email |
| Admin removes access after config generated | Verify step re-checks at connection time |
| User account is disabled | Verify step checks account status |
| Config used on different gateway | Certificate is bound to specific gateway ID |
| Certificate expires | Standard X.509 expiration check |
| User tries to access unauthorized resource | Firewall rules only permit explicit destinations |

## Firewall Implementation

The gateway agent applies per-user firewall rules using nftables:

```bash
# Example rules for user alice@example.com (VPN IP: 10.8.0.5)
table inet gatekey_alice {
    chain forward {
        type filter hook forward priority 0; policy drop;

        # Allow rules from user's access rules
        ip saddr 10.8.0.5 ip daddr 10.0.0.0/24 tcp dport 443 accept
        ip saddr 10.8.0.5 ip daddr 192.168.1.100 accept

        # Default: drop all other traffic from this user
        ip saddr 10.8.0.5 drop
    }
}
```

Key characteristics:
- **Isolated chains**: Each user gets their own firewall chain
- **Default drop**: Policy is DROP, not ACCEPT
- **Dynamic updates**: Rules added on connect, removed on disconnect
- **Specific sources**: Rules only apply to user's VPN IP

## Real-Time Rule Enforcement

Access rules are enforced in real-time without requiring client reconnection:

1. **Admin Changes Rule**: Administrator modifies access rule in web UI
2. **Database Updated**: Control plane updates `access_rules` table
3. **Agent Polls**: Gateway agent calls API every 10 seconds
4. **Change Detected**: Agent compares current rules with previous state
5. **Firewall Updated**: nftables rules updated for all connected clients
6. **Traffic Blocked**: Client traffic to removed destinations is immediately blocked

**Total time from rule change to enforcement: under 15 seconds**

## Comparison with Traditional VPN

| Aspect | Traditional VPN | GateKey |
|--------|-----------------|---------|
| Default Policy | Allow all after connect | Deny all |
| Access Control | Network-level | User + Resource level |
| Certificate Life | Years | Hours |
| Access Revocation | Manual certificate revocation | Immediate (access check on connect) |
| Audit Trail | Connection logs only | Full resource access logging |
| Group Integration | None | Native IdP group support |

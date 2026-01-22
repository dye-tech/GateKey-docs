---
sidebar_position: 1
title: Introduction
description: What is GateKey and why you should use it
---

# Introduction to GateKey

GateKey is a **zero-trust VPN solution** that wraps OpenVPN and WireGuard. Users authenticate via their company's identity provider (Okta, Azure AD, Google Workspace, etc.) and get short-lived VPN credentials automatically.

**No passwords to remember. No certificates to manage. Just SSO and connect.**

![GateKey Interface](/img/screenshots/screenshot_full.png)

## Overview Video

<video controls width="100%">
  <source src="/video/overview.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## Why GateKey?

Traditional VPNs have fundamental security issues:

| Traditional VPN | GateKey |
|-----------------|---------|
| Long-lived certificates (years) | Short-lived certs (24 hours) |
| Full network access after connect | Per-user firewall rules |
| Separate VPN passwords | SSO with your identity provider |
| Manual certificate rotation | Automatic credential refresh |
| Static access control | Dynamic, role-based access |

## Key Features

### 🔐 Zero Trust Security

Every connection is authenticated and authorized. No user or device is trusted by default—access is verified continuously.

- **Never Trust, Always Verify**: Every access request is fully authenticated
- **Least Privilege**: Users only access resources explicitly permitted
- **Assume Breach**: Short-lived certificates limit exposure window
- **Default Deny**: All traffic blocked unless explicitly allowed

### 🔑 SSO Integration

Integrate with your existing identity provider:

- Okta
- Azure AD / Entra ID
- Google Workspace
- Any OIDC or SAML provider

### 🌐 Dual Protocol Support

Choose the VPN protocol that fits your needs:

| Protocol | Best For | Performance |
|----------|----------|-------------|
| **OpenVPN** | Maximum compatibility | Good |
| **WireGuard** | Performance, mobile | Excellent |

Both protocols use the same zero-trust security model.

### 🔗 Multi-Gateway

Connect to multiple VPN gateways simultaneously:

```bash
gatekey connect us-east-1    # Gets tun0
gatekey connect eu-west-1    # Gets tun1
gatekey status               # Shows all connections
```

### 🕸️ Mesh Networking

Hub-and-spoke topology for site-to-site connectivity with zero-trust access controls.

### ☸️ Kubernetes Native

Deploy with Helm in minutes. GateKey integrates seamlessly with Kubernetes and stores secrets natively in the cluster.

## Architecture Overview

![GateKey Architecture Overview](/img/diagrams/architecture-overview.svg)

## Components

| Component | Description |
|-----------|-------------|
| **Control Plane** | Central server handling auth, certs, and policy |
| **Gateway Agent** | Runs alongside OpenVPN/WireGuard on gateway servers |
| **CLI Client** | User-facing VPN client (`gatekey`) |
| **Android Client** | Native mobile app for Android devices |
| **Web UI** | Browser-based interface for config download |
| **Admin CLI** | Administrative tool for policy management |

## Next Steps

- [Quick Start Guide](./quickstart) - Get connected in 5 minutes
- [Installation](./installation) - Detailed installation instructions
- [Architecture Overview](/docs/architecture/overview) - Deep dive into system design

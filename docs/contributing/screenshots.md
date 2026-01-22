---
sidebar_position: 1
title: Screenshots Guide
description: Guide for capturing screenshots and videos for documentation
---

# Screenshots Guide

This guide documents the screenshots and videos available for the GateKey documentation.

## Available Screenshots

### Authentication & Login

| Screenshot | Description |
|------------|-------------|
| `login_page_sso.png` | Login page with SSO options |
| `oidc_providers.png` | OIDC identity provider configuration |
| `saml_providers.png` | SAML identity provider configuration |

### Dashboard & Overview

| Screenshot | Description |
|------------|-------------|
| `dashboard.png` | Main admin dashboard |
| `web-dashboard.png` | User web dashboard |
| `screenshot_full.png` | Full application screenshot |
| `menu.png` | Navigation menu |

### Gateways

| Screenshot | Description |
|------------|-------------|
| `gateway.png` | Gateway overview |
| `web-gateways.png` | User gateway selection |
| `gateway_add_gateway_openvpn.png` | Add OpenVPN gateway form |
| `gateway_add_gateway_wireguard.png` | Add WireGuard gateway form |

### Mesh Networking

| Screenshot | Description |
|------------|-------------|
| `mesh.png` | Mesh networking overview |
| `mesh-gateways.png` | Mesh gateways list |
| `mesh_add_hub_openvpn.png` | Add OpenVPN mesh hub form |
| `mesh_add_hub_wireguard.png` | Add WireGuard mesh hub form |
| `topology_mesh.png` | Network topology visualization |

### Access Control

| Screenshot | Description |
|------------|-------------|
| `access_rules.png` | Access rules list |
| `access_rules_add.png` | Add access rule form |
| `users_groups.png` | Users and groups management |
| `geo_fencing.png` | Geo-fencing configuration |

### VPN Configuration

| Screenshot | Description |
|------------|-------------|
| `vpn_configurations.png` | VPN configuration downloads |
| `vpn_settings.png` | VPN settings page |
| `certificate_authority.png` | Certificate authority management |

### Proxy & Security

| Screenshot | Description |
|------------|-------------|
| `proxy_apps.png` | Proxy applications list |
| `proxy_apps_add.png` | Add proxy application form |
| `proxy_security.png` | Proxy security settings |

### Monitoring & Tools

| Screenshot | Description |
|------------|-------------|
| `monitoring.png` | Monitoring dashboard |
| `network_tools.png` | Network diagnostic tools |

### Identity Providers

| Screenshot | Description |
|------------|-------------|
| `keycloak_saml_support.png` | Keycloak SAML configuration |

## Screenshot Naming Convention

```
{feature}_{action}.png
```

Examples:
- `access_rules_add.png` - Adding an access rule
- `gateway_add_gateway_openvpn.png` - Adding an OpenVPN gateway
- `mesh_add_hub_wireguard.png` - Adding a WireGuard mesh hub

## Using Screenshots in Documentation

```markdown
![Gateway Overview](/img/screenshots/gateway.png)

![Access Rules](/img/screenshots/access_rules.png)
```

## Capturing New Screenshots

### Settings

- **Resolution**: 1920x1080 or 2560x1440 for retina
- **Format**: PNG for UI screenshots
- **Browser**: Chrome or Firefox (hide bookmarks bar)
- **Theme**: Light mode preferred for consistency

### Process

1. Start the GateKey server locally:
   ```bash
   cd /home/jesse/Desktop/GateKey
   make run
   ```

2. Access the web UI at `http://localhost:3000`

3. Navigate to the desired page and capture

4. Save to `/static/img/screenshots/` with descriptive name

## File Organization

```
static/
├── img/
│   ├── screenshots/
│   │   ├── dashboard.png
│   │   ├── gateway.png
│   │   ├── access_rules.png
│   │   └── ...
│   └── diagrams/
│       ├── architecture-overview.svg
│       └── ...
└── video/
    ├── gatekey-demo.cast
    └── ...
```

## Required Videos

| Video | Description | Status |
|-------|-------------|--------|
| `quickstart.mp4` | Complete quickstart flow | Needed |
| `openvpn-setup.mp4` | OpenVPN client setup | Needed |
| `wireguard-setup.mp4` | WireGuard client setup | Needed |
| `mesh-demo.mp4` | Mesh networking demo | Needed |

### Recording Settings

- **Resolution**: 1920x1080 minimum
- **Frame rate**: 30 FPS
- **Format**: MP4 (H.264)
- **Audio**: Optional narration or text captions

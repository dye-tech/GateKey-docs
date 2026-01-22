---
sidebar_position: 1
title: Screenshots Guide
description: Guide for capturing screenshots for documentation
---

# Screenshots Guide

Screenshots are stored in `/static/img/screenshots/` and can be referenced in documentation using:

```markdown
![Description](/img/screenshots/filename.png)
```

## Capturing New Screenshots

1. Start the GateKey server locally
2. Access the web UI at `http://localhost:3000`
3. Navigate to the desired page and capture
4. Save to `/static/img/screenshots/` with a descriptive name

### Settings

- **Resolution**: 1920x1080
- **Format**: PNG
- **Browser**: Chrome or Firefox (hide bookmarks bar)
- **Theme**: Light mode for consistency

### Naming Convention

Use lowercase with underscores:

```
{feature}_{action}.png
```

Examples:
- `gateway.png` - Gateway overview
- `access_rules_add.png` - Adding an access rule
- `mesh_add_hub_wireguard.png` - Adding a WireGuard mesh hub

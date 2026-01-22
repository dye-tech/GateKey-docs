---
sidebar_position: 3
title: Multi-Gateway
description: Connect to multiple VPN gateways simultaneously
---

# Multi-Gateway Connections

GateKey supports connecting to multiple VPN gateways simultaneously, allowing you to access resources across different networks without disconnecting and reconnecting.

## How It Works

Each gateway connection gets its own network interface:

```bash
gatekey connect us-east-1    # Gets tun0
gatekey connect eu-west-1    # Gets tun1
```

The routing table is updated automatically so traffic goes to the correct gateway based on destination.

## Connecting to Multiple Gateways

```bash
# Connect to first gateway
gatekey connect us-east-1
# Output: Connected to us-east-1 (tun0)

# Connect to second gateway
gatekey connect eu-west-1
# Output: Connected to eu-west-1 (tun1)
```

## Checking Status

```bash
gatekey status
```

Output:
```
Status: Connected to 2 gateways

  us-east-1:
    Status:    Connected
    Interface: tun0
    Duration:  2h15m30s
    Local IP:  10.8.0.5
    Routes:    10.0.0.0/8

  eu-west-1:
    Status:    Connected
    Interface: tun1
    Duration:  1h30m15s
    Local IP:  10.9.0.12
    Routes:    172.16.0.0/12
```

## Disconnecting

```bash
# Disconnect from a specific gateway
gatekey disconnect us-east-1

# Disconnect from all gateways
gatekey disconnect --all
```

## Route Handling

Routes are automatically managed:

- Each gateway pushes its own routes based on your access rules
- No route conflicts between gateways (different CIDR blocks)
- Traffic is routed to the correct gateway based on destination

## Best Practices

1. **Don't overlap routes**: Ensure each gateway routes to different networks
2. **Monitor connections**: Use `gatekey status` to verify all connections
3. **Check logs**: If issues occur, check gateway-specific logs:
   ```bash
   cat ~/.gatekey/openvpn-us-east-1.log
   ```

## Troubleshooting

### "Route conflict detected"

Two gateways are trying to push the same route. Contact your administrator to review gateway route configurations.

### "Interface allocation failed"

Too many interfaces active. Disconnect some gateways first:

```bash
gatekey disconnect --all
gatekey connect us-east-1
```

### DNS Issues

When connected to multiple gateways, DNS may need manual configuration. Check which gateway should handle DNS resolution for your use case.

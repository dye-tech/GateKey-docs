---
sidebar_position: 5
title: Troubleshooting
description: Common issues and solutions
---

# Troubleshooting

Common issues and their solutions.

## "OpenVPN not found"

OpenVPN is not installed or not in your PATH:

```bash
# Check if OpenVPN is available
which openvpn

# Install if missing
# Ubuntu/Debian
sudo apt install openvpn

# Fedora/RHEL
sudo dnf install openvpn

# macOS
brew install openvpn
```

Or specify the path manually:

```bash
gatekey config set openvpn /path/to/openvpn
```

## "Authentication required"

Your session has expired. Re-authenticate:

```bash
gatekey login
```

## "Permission denied" / sudo issues

OpenVPN requires root privileges. The client will prompt for sudo password.

If you're having issues:

```bash
# Run with explicit sudo
sudo gatekey connect
```

## Connection fails immediately

Check the OpenVPN log:

```bash
cat ~/.gatekey/openvpn-<gateway-name>.log
```

Common issues:
- **Firewall blocking UDP 1194**: Check firewall rules
- **Certificate expired**: Re-run `gatekey connect` for a fresh config
- **DNS resolution issues**: Try using IP address instead of hostname

## "Already connected to gateway"

You're already connected. Either:

```bash
# Disconnect and reconnect
gatekey disconnect <gateway> && gatekey connect <gateway>

# Or connect to a different gateway
gatekey connect <other-gateway>
```

## Multi-gateway issues

When connected to multiple gateways:

```bash
# Check all connection statuses
gatekey status

# Check specific gateway log
cat ~/.gatekey/openvpn-<gateway>.log

# Disconnect from problematic gateway only
gatekey disconnect <gateway>
```

## Headless/SSH systems

Use `--no-browser` and copy the URL:

```bash
gatekey login --no-browser
# Copy the printed URL to a browser on another machine
```

## DNS resolution issues after connecting

If internal hostnames don't resolve after connecting:

1. Check if DNS is being pushed:
   ```bash
   cat /etc/resolv.conf
   ```

2. The VPN config may not be pushing DNS. Contact your administrator.

3. Manually add DNS servers:
   ```bash
   sudo bash -c 'echo "nameserver 10.0.0.1" >> /etc/resolv.conf'
   ```

## Slow connection

Possible causes:

1. **MTU issues**: Try a smaller MTU in the config
2. **UDP blocked**: Try TCP mode if available
3. **Distance to gateway**: Connect to a closer gateway

## Split tunnel not working

If traffic that should go through the VPN isn't:

1. Check your routes:
   ```bash
   gatekey status
   ```

2. Verify the destination is in one of your routes

3. Check your access rules with your administrator

## Getting more debug info

Enable debug logging:

```bash
gatekey config set log_level debug
gatekey connect
```

## Still having issues?

1. Check the [GitHub Issues](https://github.com/dye-tech/GateKey/issues)
2. Open a new issue with:
   - GateKey version (`gatekey version`)
   - Operating system
   - Error messages
   - Relevant log output

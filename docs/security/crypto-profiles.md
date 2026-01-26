---
sidebar_position: 2
title: Cryptographic Profiles
description: Understanding GateKey's cryptographic profiles and FIPS compliance
---

# Cryptographic Profiles

GateKey provides three cryptographic profiles for VPN connections, allowing organizations to balance security requirements with compatibility needs.

## Available Profiles

### Modern (Default)

The recommended profile for most deployments. Uses current best-practice algorithms with strong security margins.

| Setting | Value |
|---------|-------|
| Cipher | AES-256-GCM |
| Auth | SHA256 |
| TLS Cipher | TLS-ECDHE-ECDSA-WITH-AES-256-GCM-SHA384 |
| DH Parameters | ECDH P-384 |

### FIPS-Compatible

Configured with FIPS 140-2/140-3 approved algorithms. See [FIPS Compliance](#fips-compliance) below for important limitations.

| Setting | Value |
|---------|-------|
| Cipher | AES-256-GCM |
| Auth | SHA384 |
| TLS Cipher | TLS-ECDHE-ECDSA-WITH-AES-256-GCM-SHA384 |
| DH Parameters | ECDH P-384 |

### Compatible

For environments requiring compatibility with older clients or systems.

| Setting | Value |
|---------|-------|
| Cipher | AES-256-CBC |
| Auth | SHA256 |
| TLS Cipher | TLS-DHE-RSA-WITH-AES-256-CBC-SHA256 |
| DH Parameters | DH 2048-bit |

## Selecting a Profile

When creating or editing a gateway in the web UI:

1. Go to **Administration** → **Gateways**
2. Click **Add Gateway** or edit an existing gateway
3. Select the desired **Crypto Profile**

:::warning Profile Changes Require Reconnection
Changing a gateway's crypto profile requires all connected clients to disconnect and download new configuration files.
:::

## FIPS Compliance

### Important: FIPS-Compatible vs FIPS-Compliant

GateKey's **FIPS-Compatible** profile uses FIPS-approved algorithms, but this alone does **not** constitute true FIPS 140-2/140-3 compliance.

**True FIPS compliance requires:**

1. **Operating System FIPS Mode** - The underlying OS must be running in FIPS mode
2. **FIPS-Validated Cryptographic Modules** - The crypto libraries must be NIST-validated (not just using approved algorithms)
3. **End-to-End FIPS Chain** - All components must use the validated modules

### What GateKey's FIPS Profile Provides

| Aspect | Status |
|--------|--------|
| FIPS-approved algorithms | ✅ Yes |
| Algorithm configuration | ✅ Yes |
| FIPS-validated crypto module | ❌ Requires OS-level FIPS |
| NIST validation certificate | ❌ Requires OS-level FIPS |

### Achieving True FIPS Compliance

To achieve actual FIPS 140-2/140-3 compliance:

#### 1. Enable OS-Level FIPS Mode

**RHEL/Fedora/CentOS:**

```bash
# Enable FIPS mode (requires reboot)
sudo fips-mode-setup --enable
sudo reboot

# Verify FIPS mode is active
fips-mode-setup --check
# Expected output: FIPS mode is enabled.

# Alternative verification
cat /proc/sys/crypto/fips_enabled
# Expected output: 1
```

**Ubuntu:**

```bash
# Install FIPS packages (Ubuntu Pro/Advantage required)
sudo ua enable fips

# Reboot to activate
sudo reboot

# Verify
cat /proc/sys/crypto/fips_enabled
```

#### 2. Configure GateKey Gateway

On the gateway server with FIPS mode enabled:

```yaml
# /etc/gatekey/gateway.yaml
server_url: https://vpn.yourcompany.com
gateway_token: your-token

# OpenVPN will automatically use the OS FIPS-validated OpenSSL
openvpn_config: /etc/openvpn/server.conf
```

#### 3. Select FIPS-Compatible Profile

In the GateKey web UI, select the **FIPS-Compatible** crypto profile for your gateway.

### FIPS Mode Behavior

When the OS is in FIPS mode:

- OpenSSL automatically uses its FIPS-validated cryptographic module
- Non-approved algorithms are disabled and will fail if requested
- The kernel enforces FIPS-approved algorithms for all crypto operations
- SSH, TLS, and VPN connections use only approved ciphers

### Verification

After configuration, verify the complete FIPS chain:

```bash
# Check OS FIPS mode
cat /proc/sys/crypto/fips_enabled

# Check OpenSSL FIPS mode
openssl version
openssl md5 /dev/null  # Should fail in FIPS mode (MD5 not approved)

# Check OpenVPN is using FIPS-approved ciphers
openvpn --show-ciphers | grep -i aes-256-gcm
```

## Algorithm Reference

### FIPS 140-2 Approved Algorithms (Used by GateKey)

| Category | Algorithms |
|----------|------------|
| Symmetric Encryption | AES-128, AES-192, AES-256 (GCM, CBC, CTR modes) |
| Hashing | SHA-256, SHA-384, SHA-512 |
| Key Exchange | ECDH (P-256, P-384, P-521), DH (2048+ bit) |
| Digital Signatures | ECDSA, RSA (2048+ bit) |
| Message Authentication | HMAC-SHA-256, HMAC-SHA-384, GCM |

### Non-Approved Algorithms (Avoided)

| Category | Avoided Algorithms |
|----------|-------------------|
| Hashing | MD5, SHA-1 (for signatures) |
| Encryption | DES, 3DES, RC4, Blowfish |
| Key Exchange | DH < 2048 bit |

## Compliance Documentation

For organizations requiring compliance documentation:

1. **Algorithm Configuration**: GateKey's FIPS profile configuration can be documented
2. **OS FIPS Validation**: Reference your OS vendor's FIPS 140-2 certificate
3. **OpenSSL Validation**: Reference the OpenSSL FIPS module certificate
4. **Audit Trail**: GateKey provides comprehensive connection and access logging

### Relevant NIST Certificates

- **Red Hat Enterprise Linux OpenSSL**: Certificate #4750
- **Ubuntu OpenSSL FIPS Module**: Certificate #4282
- **OpenSSL FIPS Provider 3.0**: Certificate #4282

:::note Certificate Numbers Change
NIST certificate numbers are updated as vendors recertify. Always verify current certificates at [NIST CMVP](https://csrc.nist.gov/projects/cryptographic-module-validation-program/validated-modules).
:::

## Recommendations

| Use Case | Recommended Profile |
|----------|-------------------|
| General enterprise | Modern |
| Federal/government (with OS FIPS) | FIPS-Compatible |
| Healthcare (HIPAA) | Modern or FIPS-Compatible |
| Financial services | Modern or FIPS-Compatible |
| Legacy system compatibility | Compatible |
| Maximum security | Modern + TLS-Auth enabled |

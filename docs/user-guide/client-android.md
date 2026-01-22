---
sidebar_position: 2
title: Android Client
description: GateKey Android app for mobile VPN connectivity
---

# GateKey Android Client

The GateKey Android client provides native mobile VPN connectivity with the same zero-trust security model as the desktop CLI.

## Features

- **SSO Authentication** - Log in using your organization's identity provider (OIDC)
- **API Key Authentication** - Alternative authentication for service accounts
- **Gateway Connections** - Connect to VPN gateways for secure network access
- **Mesh Network Support** - Connect to mesh hubs for multi-site networking
- **Multi-connection Management** - View and manage active VPN connections
- **Material Design 3** - Modern UI built with Jetpack Compose
- **Embedded OpenVPN** - Built-in VPN support without requiring external apps

## Requirements

- Android 8.0 (API 26) or higher
- Network connectivity to your GateKey server

## Installation

### Download

Download the latest APK from your GateKey server's web interface:

1. Log in to your GateKey web dashboard
2. Navigate to **Downloads** or **Mobile Apps**
3. Download `gatekey-android.apk`
4. Install on your device (you may need to enable "Install from unknown sources")

### GitHub Releases

APKs are also available from the [GitHub Releases](https://github.com/gatekey/gatekey-android-client/releases) page.

## Getting Started

### Initial Setup

1. Launch the GateKey app
2. Enter your GateKey server URL (e.g., `vpn.example.com`)
3. Tap **Login with SSO** to authenticate via your identity provider

### Connecting to a Gateway

1. After login, you'll see a list of available gateways
2. Tap on a gateway to connect
3. Accept the VPN permission prompt (first time only)
4. The app will establish a secure connection

### Connecting to a Mesh Hub

1. Navigate to the **Mesh** tab
2. Select a mesh hub from the list
3. Tap to connect

### Viewing Connection Status

The home screen shows your current connection status including:

- Connection state (Connected/Disconnected)
- Gateway or mesh hub name
- Connection duration
- Data transfer statistics

## Authentication Methods

### SSO (Recommended)

1. Enter your server URL
2. Tap **Login with SSO**
3. Complete authentication in your browser
4. The app will automatically receive your credentials

### API Key

1. Enter your server URL
2. Tap **Use API Key**
3. Enter your API key (format: `gk_...`)
4. Tap **Login with API Key**

## Settings

Access settings by tapping the gear icon:

- **Server URL** - Change your GateKey server
- **Theme** - Toggle dark/light mode
- **Logout** - Clear credentials and disconnect

## Security

- Tokens are stored using Android's encrypted DataStore
- All server communication uses HTTPS
- VPN configurations include short-lived certificates (24-hour default)
- OAuth state validation prevents CSRF attacks
- OpenVPN3 provides AES-256-GCM encryption

## Troubleshooting

### VPN Permission Denied

If you accidentally denied VPN permission:

1. Go to Android Settings > Apps > GateKey
2. Tap Permissions
3. Enable VPN permission
4. Try connecting again

### Connection Timeout

- Verify your GateKey server URL is correct
- Check that you have network connectivity
- Ensure the server is accessible from your network

### Authentication Failed

- Verify your identity provider credentials
- Check that your account has VPN access permissions
- Try logging out and back in

## Permissions

| Permission | Purpose |
|------------|---------|
| Internet | Network communication |
| Network State | Check network connectivity |
| VPN Service | Establish VPN tunnel |
| Notifications | Connection status alerts |

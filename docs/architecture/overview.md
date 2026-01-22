---
sidebar_position: 1
title: Overview
description: GateKey system architecture overview
---

# Architecture Overview

GateKey is a Software Defined Perimeter (SDP) solution that wraps OpenVPN and WireGuard to provide zero-trust VPN capabilities while maintaining compatibility with existing clients.

## System Components

### Control Plane (`gatekey-server`)

The control plane is the central management component:

- **Authentication**: OIDC and SAML integration with identity providers
- **Authorization**: Policy-based access control
- **Certificate Management**: Embedded PKI for short-lived certificates
- **Configuration Generation**: Dynamic .ovpn/.conf file generation
- **Session Management**: User session tracking and validation
- **Gateway Management**: Registration and monitoring of gateway nodes
- **Audit Logging**: Comprehensive audit trail

![Control Plane Architecture](/img/diagrams/control-plane.svg)

### Gateway Agent (`gatekey-gateway`)

The gateway agent runs alongside OpenVPN on each gateway node:

- **Hook Handling**: Processes OpenVPN hook callbacks
- **Firewall Management**: Per-identity nftables/iptables rules
- **Connection Reporting**: Reports connection state to control plane
- **Health Monitoring**: Sends heartbeats to control plane

![Gateway Node Architecture](/img/diagrams/gateway-node.svg)

### WireGuard Gateway Agent (`gatekey-wireguard-gateway`)

The WireGuard gateway agent provides an alternative to OpenVPN:

- **WireGuard Interface Management**: Creates and manages wg0 interface
- **Peer Synchronization**: Syncs authorized peers from control plane
- **Firewall Management**: Per-peer nftables rules with zero-trust
- **Connection Reporting**: Reports peer handshakes and traffic stats

### Mesh Hub (`gatekey-hub`)

The mesh hub enables site-to-site VPN connectivity:

- **OpenVPN Server**: Runs the mesh OpenVPN server for spoke connections
- **Route Aggregation**: Collects routes from all connected spokes
- **Client VPN Access**: Allows authorized users to connect as VPN clients
- **Control Plane Sync**: Syncs configuration and access rules

### Mesh Spoke (`gatekey-mesh-gateway`)

The mesh spoke connects remote sites to the mesh hub:

- **Outbound Connection**: Initiates connection to hub (works behind NAT)
- **Local Network Advertisement**: Advertises local networks to the hub
- **Automatic Reconnection**: Maintains persistent connection to hub

### Network Topology Visualization

The web UI provides a real-time topology view showing the mesh network structure:

![Network Topology](/img/screenshots/topology_mesh.png)

## Data Flow

### User Authentication Flow

![User Authentication Flow](/img/diagrams/auth-flow.svg)

### VPN Connection Flow

![VPN Connection Flow](/img/diagrams/vpn-connection-flow.svg)

## Technology Stack

### Backend
- **Language**: Go 1.25+
- **Web Framework**: Gin
- **Database**: PostgreSQL
- **Authentication**: OIDC (go-oidc), SAML (crewjam/saml)
- **Firewall**: nftables (google/nftables)

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Bundler**: Vite

### Infrastructure
- **VPN**: OpenVPN (stock), WireGuard
- **Container**: Docker
- **Orchestration**: Kubernetes (Helm chart available)

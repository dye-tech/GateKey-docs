#!/bin/bash

# Simulated gatekey CLI for demo purposes
case "$1" in
    "login")
        echo "Authenticating with GateKey server..."
        sleep 0.5
        echo "Opening browser for authentication..."
        sleep 0.8
        echo "Waiting for authentication..."
        sleep 1.5
        echo ""
        echo "Authentication successful!"
        echo "Logged in as: jesse@example.com"
        ;;
    "list")
        echo "Available Gateways:"
        echo "-------------------"
        echo "✓ gateway [openvpn]"
        echo "  Public IP:   203.0.113.45"
        echo "  Status:      online"
        echo ""
        echo "✓ hub [wireguard-mesh]"
        echo "  Public IP:   198.51.100.22"
        echo "  Status:      online"
        ;;
    "connect")
        echo "Found mesh hub 'hub', connecting..."
        echo "Connecting to WireGuard mesh hub hub..."
        echo "WireGuard requires root privileges. You may be prompted for your password."
        sleep 0.3
        echo "[#] ip link add dev wg0 type wireguard"
        sleep 0.1
        echo "[#] wg setconf wg0 /dev/fd/63"
        sleep 0.1
        echo "[#] ip -4 address add 172.30.0.4/32 dev wg0"
        sleep 0.1
        echo "[#] ip link set mtu 1420 up dev wg0"
        sleep 0.1
        echo "[#] ip -4 route add 10.0.2.103/32 dev wg0"
        sleep 0.05
        echo "[#] ip -4 route add 10.0.19.210/32 dev wg0"
        sleep 0.05
        echo "[#] ip -4 route add 10.0.16.174/32 dev wg0"
        sleep 0.05
        echo "[#] ip -4 route add 10.0.0.101/32 dev wg0"
        sleep 0.05
        echo "[#] ip -4 route add 192.168.0.0/24 dev wg0"
        sleep 0.2
        echo "Connected to mesh hub hub (Interface: wg0)"
        echo "WireGuard mesh VPN connection established. Use 'gatekey status' to check connection."
        ;;
    "status")
        echo "Status: Connected"
        echo "Gateway:      mesh:hub"
        echo "Type:         wireguard"
        echo "Interface:    wg0"
        echo "Connected at: 2026-01-21T19:25:49-05:00"
        echo "Duration:     6s"
        echo "Local IP:     172.30.0.4"
        echo "Transfer:     ↓ 12.9 KB  ↑ 12.1 KB"
        echo ""
        echo "Routes:"
        echo "  10.0.0.101/32"
        echo "  10.0.2.103/32"
        echo "  192.168.0.0/24"
        ;;
    "disconnect")
        echo "[#] ip link delete dev wg0"
        echo "Disconnected from mesh:hub"
        ;;
esac

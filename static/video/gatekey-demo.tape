# GateKey CLI Demo
# VHS tape file for terminal animation

Output gatekey-demo.webm
Output gatekey-demo.gif

Set Shell "bash"
Set FontSize 16
Set Width 900
Set Height 550
Set Padding 20
Set Theme "Dracula"
Set TypingSpeed 60ms
Set PlaybackSpeed 1

# Setup alias
Hide
Type "alias gatekey='/home/jesse/Desktop/GateKey-docs/static/video/gatekey-sim.sh'"
Enter
Type "export PS1='jesse ~ via 🐍 v3.14.2 \n➜ '"
Enter
Type "clear"
Enter
Show

Sleep 1s

# Login
Type "gatekey login"
Sleep 400ms
Enter
Sleep 3s

# List gateways
Type "gatekey list"
Sleep 400ms
Enter
Sleep 2s

# Connect to hub
Type "gatekey connect hub"
Sleep 400ms
Enter
Sleep 3s

# Check status
Type "gatekey status"
Sleep 400ms
Enter
Sleep 2.5s

# Disconnect
Type "gatekey disconnect"
Sleep 400ms
Enter
Sleep 2s

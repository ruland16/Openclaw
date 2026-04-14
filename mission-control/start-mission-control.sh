#!/bin/bash
set -e
export PATH="/home/linuxbrew/.linuxbrew/Cellar/node/25.9.0_1/bin:/home/linuxbrew/.linuxbrew/bin:/usr/local/bin:/usr/bin:/bin"
cd /home/user/.openclaw/workspace/mission-control
exec npm start

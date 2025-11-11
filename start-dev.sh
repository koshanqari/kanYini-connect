#!/bin/bash

# Kill any existing Next.js processes
pkill -f "next dev" 2>/dev/null

# Wait a moment for processes to terminate
sleep 2

# Remove lock file and .next directory
rm -rf .next/dev/lock .next 2>/dev/null

# Start the dev server
npm run dev


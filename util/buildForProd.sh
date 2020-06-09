#!/usr/bin/env bash

### Bundle BackEnd ###

# Remove existing production folder
rm -rf ./build/

# Transpile .ts to .js
tsc --sourceMap false

### Bundle FrontEnd ###

# Create the directory for React
mkdir -p ./build/react/

# Navigate to the react directory
cd ./react

# Build React code
npm run build

# Rename
mv build react

# Move the contains to the build/ dir
mv react ../build/

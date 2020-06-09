#!/usr/bin/env bash

### Bundle BackEnd ###

# Remove existing production folder
rm -rf ./build/

# Transpile .ts to .js
tsc --sourceMap false

### Bundle FrontEnd ###

# Create the directory for React
mkdir -p ./build/react/

# Create the data folder
mkdir -p ./build/data/
touch ./build/data/FILE

# Copy package.json
cp package.json ./build/

# Navigate to the react directory
cd ./react

# Build React code
npm run build

# Rename
mv build react

# Move the contains to the build/ dir
mv react ../build/

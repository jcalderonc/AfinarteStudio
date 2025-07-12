#!/bin/bash

# ASAUTH Lambda Deployment Script
# This script automates the complete deployment process for the ASAUTH Lambda function

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
LAMBDA_NAME="ASAUTH"
PROJECT_DIR="ASAUTH"
DEPLOYMENT_DIR="ASAUTH/deployment"
OUTPUT_DIR="deployments"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}🚀 Starting ${LAMBDA_NAME} Lambda Deployment Process${NC}"
echo "=================================================="

# Ensure we're in the right directory
cd "$SCRIPT_DIR"

# Check if ASAUTH directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Error: $PROJECT_DIR directory not found${NC}"
    echo "   Please run this script from the AfinarteStudioLambda directory"
    exit 1
fi

# Step 1: Create output directory and clean up old deployment files
echo -e "${YELLOW}📁 Step 1: Setting up output directory...${NC}"

# Create deployments directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Remove old ASAUTH deployment files from output directory
if ls "$OUTPUT_DIR"/${LAMBDA_NAME}-lambda-*.zip 1> /dev/null 2>&1; then
    echo "   Removing old ${LAMBDA_NAME} deployment files..."
    rm -f "$OUTPUT_DIR"/${LAMBDA_NAME}-lambda-*.zip
    echo -e "${GREEN}   ✓ Old deployment files removed${NC}"
else
    echo -e "${GREEN}   ✓ No old deployment files to remove${NC}"
fi

# Step 2: Update deployment directory
echo -e "${YELLOW}📝 Step 2: Updating deployment files...${NC}"

# Copy the main Lambda file to deployment directory
if [ -f "$PROJECT_DIR/index.mjs" ]; then
    cp "$PROJECT_DIR/index.mjs" "$DEPLOYMENT_DIR/index.mjs"
    echo -e "${GREEN}   ✓ index.mjs copied to deployment directory${NC}"
else
    echo -e "${RED}   ❌ Error: $PROJECT_DIR/index.mjs not found${NC}"
    exit 1
fi

# Step 3: Verify deployment directory structure
echo -e "${YELLOW}🔍 Step 3: Verifying deployment structure...${NC}"

if [ ! -d "$DEPLOYMENT_DIR" ]; then
    echo -e "${RED}   ❌ Error: Deployment directory not found${NC}"
    exit 1
fi

# Check for required files
REQUIRED_FILES=("$DEPLOYMENT_DIR/index.mjs" "$DEPLOYMENT_DIR/package.json" "$DEPLOYMENT_DIR/package-lock.json")
for file in "${REQUIRED_FILES[@]}"; do
    filename=$(basename "$file")
    if [ -f "$file" ]; then
        echo -e "${GREEN}   ✓ $filename found${NC}"
    else
        echo -e "${RED}   ❌ Error: $filename not found${NC}"
        exit 1
    fi
done

# Check for node_modules
if [ -d "$DEPLOYMENT_DIR/node_modules" ]; then
    echo -e "${GREEN}   ✓ node_modules directory found${NC}"
    
    # Check for MongoDB dependency
    if [ -d "$DEPLOYMENT_DIR/node_modules/mongodb" ]; then
        echo -e "${GREEN}   ✓ MongoDB dependency verified${NC}"
    else
        echo -e "${RED}   ❌ Error: MongoDB dependency not found${NC}"
        exit 1
    fi
else
    echo -e "${RED}   ❌ Error: node_modules directory not found${NC}"
    echo -e "${YELLOW}   Please run: cd $DEPLOYMENT_DIR && npm install${NC}"
    exit 1
fi

# Step 4: Create deployment package
echo -e "${YELLOW}📦 Step 4: Creating deployment package...${NC}"

# Generate timestamp for unique filename
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ZIP_NAME="${LAMBDA_NAME}-lambda-${TIMESTAMP}.zip"
ZIP_PATH="$OUTPUT_DIR/$ZIP_NAME"

# Create the ZIP file from deployment directory
echo "   Creating $ZIP_NAME in $OUTPUT_DIR/..."
cd "$DEPLOYMENT_DIR"
zip -r "../../$ZIP_PATH" . -x "*.DS_Store" > /dev/null 2>&1
cd "$SCRIPT_DIR"

if [ -f "$ZIP_PATH" ]; then
    FILE_SIZE=$(ls -lh "$ZIP_PATH" | awk '{print $5}')
    echo -e "${GREEN}   ✓ Deployment package created: $ZIP_PATH ($FILE_SIZE)${NC}"
else
    echo -e "${RED}   ❌ Error: Failed to create deployment package${NC}"
    exit 1
fi

# Step 5: Validate package contents
echo -e "${YELLOW}🔍 Step 5: Validating package contents...${NC}"

# Check ZIP contents
if unzip -l "$ZIP_PATH" | grep -q "index.mjs"; then
    echo -e "${GREEN}   ✓ index.mjs found in package${NC}"
else
    echo -e "${RED}   ❌ Error: index.mjs not found in package${NC}"
    exit 1
fi

if unzip -l "$ZIP_PATH" | grep -q "mongodb/"; then
    echo -e "${GREEN}   ✓ MongoDB dependencies found in package${NC}"
else
    echo -e "${RED}   ❌ Error: MongoDB dependencies not found in package${NC}"
    exit 1
fi

# Step 6: Display deployment summary
echo -e "${YELLOW}📋 Step 6: Deployment Summary${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Deployment package ready!${NC}"
echo ""
echo -e "${BLUE}Package Details:${NC}"
echo "   📁 File: $ZIP_PATH"
echo "   📏 Size: $FILE_SIZE"
echo "   📅 Created: $(date)"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "   1. Upload $ZIP_PATH to AWS Lambda"
echo "   2. Set Lambda timeout to 30 seconds minimum"
echo "   3. Set Lambda memory to 256 MB minimum"
echo "   4. Test with the following event:"
echo ""
echo -e "${YELLOW}Test Event:${NC}"
cat << 'EOF'
{
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"email\": \"juan.prueba@afinartestudio.com\", \"password\": \"test\"}"
}
EOF
echo ""
echo -e "${GREEN}🎉 Deployment script completed successfully!${NC}"

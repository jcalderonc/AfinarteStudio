#!/bin/bash

# Simplified Lambda Deployment Script
# This script creates deployment packages for both ASAUTH and ASSIGNUP Lambda functions

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OUTPUT_DIR="deployments"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo -e "${BLUE}🚀 Starting Lambda Functions Deployment Package Creation${NC}"
echo "============================================================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Clean up old deployment packages
echo -e "${YELLOW}🧹 Cleaning up old deployment packages...${NC}"
if [ -d "$OUTPUT_DIR" ] && [ "$(ls -A $OUTPUT_DIR)" ]; then
    echo "   Removing old deployment files..."
    rm -f "$OUTPUT_DIR"/*.zip
    echo -e "${GREEN}   ✅ Old deployment packages removed${NC}"
else
    echo -e "${GREEN}   ✅ No old deployment packages to remove${NC}"
fi

# Function to install dependencies for a Lambda function
install_dependencies() {
    local FUNCTION_NAME=$1
    local FUNCTION_DIR=$2
    
    echo -e "${YELLOW}📦 Installing dependencies for ${FUNCTION_NAME}...${NC}"
    
    # Check if function directory exists
    if [ ! -d "$FUNCTION_DIR" ]; then
        echo -e "${RED}   ❌ Error: Function directory $FUNCTION_DIR not found${NC}"
        return 1
    fi
    
    # Check if package.json exists
    if [ ! -f "$FUNCTION_DIR/package.json" ]; then
        echo -e "${RED}   ❌ Error: package.json not found in $FUNCTION_DIR${NC}"
        return 1
    fi
    
    # Install dependencies
    echo "   🔧 Running npm install..."
    (cd "$FUNCTION_DIR" && npm install > /dev/null 2>&1)
    
    if [ $? -eq 0 ]; then
        # Verify node_modules was created
        if [ -d "$FUNCTION_DIR/node_modules" ]; then
            echo -e "${GREEN}   ✅ Dependencies installed successfully${NC}"
            return 0
        else
            echo -e "${RED}   ❌ node_modules directory not created${NC}"
            return 1
        fi
    else
        echo -e "${RED}   ❌ npm install failed${NC}"
        return 1
    fi
}

# Function to run tests for a Lambda function
run_function_tests() {
    local FUNCTION_NAME=$1
    local FUNCTION_DIR=$2
    
    echo -e "${YELLOW}🧪 Running tests for ${FUNCTION_NAME}...${NC}"
    
    # Check if test file exists
    if [ ! -f "$FUNCTION_DIR/test-lambda.mjs" ]; then
        echo -e "${YELLOW}   ⚠️  No test file found for $FUNCTION_NAME${NC}"
        return 0
    fi
    
    # Run the test
    echo "   🔍 Executing test-lambda.mjs..."
    (cd "$FUNCTION_DIR" && node test-lambda.mjs)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ Tests passed for ${FUNCTION_NAME}${NC}"
        return 0
    else
        echo -e "${RED}   ❌ Tests failed for ${FUNCTION_NAME}${NC}"
        return 1
    fi
}

# Function to create deployment package
create_deployment_package() {
    local FUNCTION_NAME=$1
    local FUNCTION_DIR=$2
    
    echo -e "${YELLOW}📦 Creating deployment package for ${FUNCTION_NAME}...${NC}"
    
    # Check if function directory exists
    if [ ! -d "$FUNCTION_DIR" ]; then
        echo -e "${RED}   ❌ Error: Function directory $FUNCTION_DIR not found${NC}"
        return 1
    fi
    
    # Check if required files exist
    if [ ! -f "$FUNCTION_DIR/index.mjs" ]; then
        echo -e "${RED}   ❌ Error: index.mjs not found in $FUNCTION_DIR${NC}"
        return 1
    fi
    
    if [ ! -f "$FUNCTION_DIR/package.json" ]; then
        echo -e "${RED}   ❌ Error: package.json not found in $FUNCTION_DIR${NC}"
        return 1
    fi
    
    # Create deployment package
    local PACKAGE_NAME="${FUNCTION_NAME}-lambda-${TIMESTAMP}.zip"
    local PACKAGE_PATH="$OUTPUT_DIR/$PACKAGE_NAME"
    
    echo "   📁 Creating ZIP package: $PACKAGE_NAME"
    
    # Create ZIP with only essential files (suppress verbose output)
    (cd "$FUNCTION_DIR" && zip -r "../$PACKAGE_PATH" \
        index.mjs \
        package.json \
        package-lock.json \
        node_modules/ \
        -x "*.env" "*.env.*" "test-*" "*.md" "*.txt" "*.log" > /dev/null 2>&1)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ Successfully created: $PACKAGE_PATH${NC}"
        echo "   📊 Package size: $(du -h "$PACKAGE_PATH" | cut -f1)"
    else
        echo -e "${RED}   ❌ Failed to create deployment package${NC}"
        return 1
    fi
}

# Install dependencies before running tests
echo -e "${BLUE}📦 Installing dependencies...${NC}"

if install_dependencies "ASAUTH" "ASAUTH"; then
    echo -e "${GREEN}   ✅ ASAUTH dependencies installed${NC}"
else
    echo -e "${RED}   ❌ ASAUTH dependency installation failed - aborting deployment${NC}"
    exit 1
fi

if install_dependencies "ASSIGNUP" "ASSIGNUP"; then
    echo -e "${GREEN}   ✅ ASSIGNUP dependencies installed${NC}"
else
    echo -e "${RED}   ❌ ASSIGNUP dependency installation failed - aborting deployment${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All dependencies installed! Proceeding with tests...${NC}"
echo ""

# Run tests before creating deployment packages
echo -e "${BLUE}🧪 Running tests before deployment...${NC}"

if run_function_tests "ASAUTH" "ASAUTH"; then
    echo -e "${GREEN}   ✅ ASAUTH tests completed${NC}"
else
    echo -e "${RED}   ❌ ASAUTH tests failed - aborting deployment${NC}"
    exit 1
fi

if run_function_tests "ASSIGNUP" "ASSIGNUP"; then
    echo -e "${GREEN}   ✅ ASSIGNUP tests completed${NC}"
else
    echo -e "${RED}   ❌ ASSIGNUP tests failed - aborting deployment${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All tests passed! Proceeding with deployment...${NC}"
echo ""

# Create deployment packages for both functions
echo -e "${BLUE}Creating deployment packages...${NC}"

if create_deployment_package "ASAUTH" "ASAUTH"; then
    echo -e "${GREEN}   ✅ ASAUTH package created successfully${NC}"
else
    echo -e "${RED}   ❌ Failed to create ASAUTH package${NC}"
    exit 1
fi

if create_deployment_package "ASSIGNUP" "ASSIGNUP"; then
    echo -e "${GREEN}   ✅ ASSIGNUP package created successfully${NC}"
else
    echo -e "${RED}   ❌ Failed to create ASSIGNUP package${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All deployment packages created successfully!${NC}"
echo -e "${BLUE}📁 Deployment packages are available in: $OUTPUT_DIR/${NC}"
echo ""
echo "Next steps:"
echo "1. Upload the ZIP files to AWS Lambda"
echo "2. Set environment variables in AWS Lambda console:"
echo "   - MONGODB_URI"
echo "   - DB_NAME"
echo "   - JWT_SECRET (for ASAUTH)"
echo "   - NODE_ENV=production"
echo ""
echo -e "${YELLOW}⚠️  Remember: The .env files are excluded from deployment packages${NC}"
echo -e "${YELLOW}   You must configure environment variables in AWS Lambda console${NC}"

# Exit successfully
exit 0

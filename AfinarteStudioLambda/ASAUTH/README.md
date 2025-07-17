# ASAUTH Lambda Deployment

This directory contains the AWS Lambda function for user authentication using MongoDB.

## Quick Deployment

From the **monorepo root directory** (`AfinarteStudioLambda/`), run:

```bash
./deploy-lambda.sh
```

This will create deployment packages for both ASAUTH and ASSIGNUP functions.

## What the Script Does

The deployment script (`deploy-lambda.sh`) automates the entire deployment process:

1. **Clean up** - Removes old ZIP files from the `deployments/` directory
2. **Package** - Creates timestamped ZIP files for both functions
3. **Validate** - Confirms packages contain all necessary components

## Manual Deployment (if needed)

If you prefer to deploy manually from the monorepo root:

1. Clean up old deployment files:
   ```bash
   rm -f deployments/ASAUTH-lambda-*.zip
   ```

2. Copy the main file to deployment directory:
   ```bash
   cp ASAUTH/index.mjs ASAUTH/deployment/index.mjs
   ```

3. Create the deployment package:
   ```bash
   cd ASAUTH/deployment
   zip -r ../../deployments/ASAUTH-lambda.zip . -x "*.DS_Store"
   cd ../..
   ```

## AWS Lambda Configuration

After uploading the ZIP file to AWS Lambda, make sure to configure:

- **Runtime**: Node.js 18.x or 20.x
- **Timeout**: 30 seconds (minimum)
- **Memory**: 256 MB (minimum)
- **Handler**: `index.handler`

## Test Event

Use this test event in AWS Lambda console:

```json
{
  "httpMethod": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"email\": \"juan.prueba@afinartestudio.com\", \"password\": \"test\"}"
}
```

## Dependencies

The function only uses:
- `mongodb` - For database connectivity
- No other external dependencies

## File Structure

```
ASAUTH/
├── deploy.sh          # Unix deployment script
├── deploy.bat         # Windows deployment script
├── index.mjs          # Main Lambda function
├── README.md          # This file
└── deployment/        # Deployment directory
    ├── index.mjs      # Lambda function (copied during deployment)
    ├── package.json   # Dependencies definition
    ├── package-lock.json
    └── node_modules/  # Installed dependencies
        └── mongodb/   # MongoDB driver
```

## Troubleshooting

If the deployment script fails:

1. Ensure you're in the ASAUTH directory
2. Check that `deployment/` directory exists
3. Verify `deployment/node_modules/mongodb/` exists
4. Run `npm install` in the deployment directory if needed

## Security Notes

- Uses plain text password comparison (as requested)
- MongoDB connection uses environment-specific credentials
- All responses include CORS headers for web compatibility

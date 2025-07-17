# Afinarte Studio Lambda Functions

Monorepo containing AWS Lambda functions for Afinarte Studio backend.

## Project Structure

```
AfinarteStudioLambda/          # Monorepo root
├── package.json               # Shared dependencies  
├── package-lock.json          
├── node_modules/              # Shared modules
├── deploy-lambda.sh           # Unified deployment script
├── deployments/               # Generated deployment packages
│   ├── ASAUTH-lambda-*.zip
│   └── ASSIGNUP-lambda-*.zip
├── README.md
├── ASAUTH/                    # Authentication Lambda function
│   ├── index.mjs              # Main handler
│   ├── package.json           # Function dependencies
│   ├── node_modules/          # Function modules
│   ├── test-lambda.mjs        # Local testing
│   └── README.md
└── ASSIGNUP/                  # User registration Lambda function
    ├── index.mjs              # Main handler
    ├── package.json           # Function dependencies
    ├── node_modules/          # Function modules
    ├── test-lambda.mjs        # Local testing
    └── README.md
    │   ├── package-lock.json
    │   └── node_modules/
    ├── README.md
    └── deploy.config
```

## Lambda Functions

### ASAUTH - Authentication Function

AWS Lambda function for user authentication using MongoDB with secure JWT token generation.

### ASSIGNUP - User Registration Function  

AWS Lambda function for user registration using MongoDB with validation and duplicate checking.

## Quick Deployment

Deploy both functions with a single command:

```bash
./deploy-lambda.sh
```

This creates deployment packages in `deployments/`:
- `ASAUTH-lambda-[timestamp].zip`
- `ASSIGNUP-lambda-[timestamp].zip`

## Local Testing

Test each function locally:

```bash
# Test ASAUTH function
cd ASAUTH && npm test

# Test ASSIGNUP function  
cd ASSIGNUP && npm test
```

#### API Endpoint

##### POST (any path)
Authenticates a user with email and password.

**Request:**
```json
{
  "email": "juan.prueba@afinartestudio.com",
  "password": "test"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "email": "juan.prueba@afinartestudio.com",
    "name": "Juan Prueba",
    "role": "admin",
    "timestamp": "2025-07-12T13:15:30.123Z"
  }
}
```

**Error Responses:**
- `400`: Missing or invalid request body, or missing email/password
- `401`: Invalid credentials
- `500`: Internal server error

### Future Lambda Functions

- **ASAPPOINTMENTS** - Appointment and booking management
- **ASNOTIFICATIONS** - Notification system
- **ASPAYMENTS** - Payment processing
- **ASREPORTS** - Report generation

## Environment Variables

For ASAUTH Lambda function:
- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name (default: "afinarte_studio")

## User Schema in MongoDB

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (plain text for now),
  name: String,
  role: String (default: "user"),
  status: String (default: "active"),
  createdAt: Date,
  lastLogin: Date,
  lastLoginIP: String
}
```

## AWS Lambda Configuration

When deploying to AWS Lambda, configure:
- **Timeout**: 30 seconds minimum
- **Memory**: 256 MB minimum
- **Environment Variables**: `MONGODB_URI`, `DB_NAME`

## Development

1. Each folder represents a separate Lambda function
2. Deployment scripts are in the monorepo root
3. Generated deployment packages go to `deployments/` directory
4. Each function has its own `deployment/` directory with minimal dependencies

## Adding New Lambda Function

To add a new Lambda function (e.g., `ASAPPOINTMENTS`):

1. **Create function directory**:
```bash
mkdir ASAPPOINTMENTS
cd ASAPPOINTMENTS
```

2. **Create basic structure**:
```bash
mkdir deployment src utils
touch index.mjs README.md deploy.config
```

3. **Create deployment script**:
```bash
cp ../deploy-asauth.sh ../deploy-asappointments.sh
# Edit the script to use ASAPPOINTMENTS instead of ASAUTH
```

4. **Set up deployment dependencies** in `ASAPPOINTMENTS/deployment/`

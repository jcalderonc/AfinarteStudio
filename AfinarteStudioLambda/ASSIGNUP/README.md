# ASSIGNUP Lambda Deployment

This directory contains the AWS Lambda function for user registration using MongoDB.

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

## User Registration Schema

The function expects the following user data structure:

```javascript
{
  "firstName": "Maria",
  "lastName": "Rodriguez", 
  "email": "maria.test@afinartestudio.com",
  "phone": "555-5678",
  "password": "testpass123",
  "acceptTerms": true
}
```

## AWS Lambda Configuration

After uploading the ZIP file to AWS Lambda, make sure to configure:

- **Function Name**: `ASSIGNUP` (or your preferred name)
- **Runtime**: Node.js 20.x (or 18.x)
- **Timeout**: 30 seconds minimum
- **Memory**: 256 MB minimum
- **Environment Variables**: None required (MongoDB URI is hardcoded for now)

## API Response Examples

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Welcome Maria! Your account has been created successfully",
  "data": {
    "user": {
      "id": "68794e9f01e7063da9fc473a",
      "firstName": "Maria",
      "lastName": "Rodriguez",
      "email": "maria.test@afinartestudio.com",
      "phone": "555-5678",
      "createdAt": "2025-07-17T19:27:27.396Z"
    },
    "registrationTime": "2025-07-17T19:27:27.471Z"
  }
}
```

### Error Response (409 Conflict - User Exists)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Error Response (400 Bad Request - Validation Error)
```json
{
  "success": false,
  "message": "All fields are required: firstName, lastName, email, phone, password, acceptTerms (must be true)"
}
```

## Validation Rules

- **firstName**: Required, non-empty string
- **lastName**: Required, non-empty string  
- **email**: Required, valid email format
- **phone**: Required, non-empty string
- **password**: Required, minimum 4 characters
- **acceptTerms**: Required, must be exactly `true`

## Database Schema

Users are stored in MongoDB with the following structure:

```javascript
{
  "_id": ObjectId("68794e9f01e7063da9fc473a"),
  "firstName": "Maria",
  "lastName": "Rodriguez",
  "email": "maria.test@afinartestudio.com",
  "phone": "555-5678", 
  "password": "testpass123",
  "acceptTerms": true,
  "createdAt": ISODate("2025-07-17T19:27:27.396Z")
}
```

## Testing

To test the function locally:

```bash
cd ASSIGNUP
node test-lambda.mjs
```

## Security Features

- **Email Uniqueness**: Prevents duplicate registrations
- **Input Validation**: Validates all required fields
- **Email Format**: Validates email format using regex
- **Password Requirements**: Minimum length validation
- **Terms Acceptance**: Requires explicit acceptance
- **Error Handling**: Comprehensive error responses
- **CORS**: Configured for cross-origin requests

## Future Enhancements

- Password hashing (bcrypt)
- Email verification workflow
- Phone number validation
- Stronger password requirements
- Rate limiting
- Input sanitization against XSS

import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file (for local testing)
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection instance
let cache = null;

export const handler = async (event) => {
  try {
    // CORS validation
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight successful' })
      };
    }

    // Parse request body
    let requestBody;
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            success: false,
            message: 'Request body is required'
          })
        };
      }

      requestBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Invalid JSON in request body'
        })
      };
    }

    // Extract email and password
    const { email, password } = requestBody;
    
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Email and password are required'
        })
      };
    }

    // Connect to database
    const client = await Promise.race([
      connectToDatabase(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      )
    ]);
    
    // Access users collection
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // Find user by email (case insensitive)
    const user = await usersCollection.findOne({
      email: email.toLowerCase()
    });
    
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
    }
    
    // Verify password (plain text comparison for now)
    if (password !== user.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
    }
    
    // Generate secure token using JWT_SECRET
    const tokenData = {
      userId: user._id.toString(),
      email: user.email,
      timestamp: Date.now()
    };
    
    // Create secure token using JWT_SECRET for signing
    const tokenString = JSON.stringify(tokenData);
    const signature = Buffer.from(JWT_SECRET + tokenString).toString('base64');
    const token = Buffer.from(tokenString).toString('base64') + '.' + signature;

    // Return success response with user data and token
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `Welcome ${user.firstName || user.name || 'User'}! Authentication successful`,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: user.name,
            role: user.role || 'user',
            createdAt: user.createdAt
          },
          token: token,
          loginTime: new Date().toISOString(),
          expiresIn: '24h'
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

const connectToDatabase = async () => {
  if (cache?.topology?.isConnected()) {
    return cache;
  }

  try {
    // Create a MongoClient with ServerApi version (official Atlas pattern)
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    cache = client;

    return client;
  } catch (error) {
    cache = null; // Reset cache on error
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

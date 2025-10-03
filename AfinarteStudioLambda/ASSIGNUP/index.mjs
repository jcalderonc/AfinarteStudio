import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file (for local testing)
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

let cachedClient = null;

const connectToDatabase = async () => {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {

    return cachedClient;
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
    
    
    cachedClient = client;
    
    return client;
  } catch (error) {
    
    cachedClient = null; // Reset cache on error
    throw new Error(`Database connection failed: ${error.message}`);
  }
};

// Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
const isValidPassword = (password) => {
  // At least 4 characters for now (can be made more strict later)
  return password && password.length >= 4;
};

export const handler = async (event) => {
  try {
    // CORS validation - Same as ASAUTH
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
          headers: corsHeaders,
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
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Invalid JSON in request body'
        })
      };
    }

    // Extract required fields matching the users collection schema
    const { firstName, lastName, email, phone, password, acceptTerms } = requestBody;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || acceptTerms !== true) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'All fields are required: firstName, lastName, email, phone, password, acceptTerms (must be true)'
        })
      };
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format'
        })
      };
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Password must be at least 4 characters long'
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
    
    // Check if user already exists (case insensitive email check)
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase()
    });
    
    if (existingUser) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'User with this email already exists'
        })
      };
    }
    // Create new user document matching the exact schema
    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: password, // Plain text for now (same as existing user)
      acceptTerms: true,
      createdAt: new Date()
    };
    
    // Insert the new user
    const result = await usersCollection.insertOne(newUser);
    
    if (result.insertedId) {
      // Return success response (no sensitive data)
      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: `Welcome ${firstName}! Your account has been created successfully`,
          data: {
            user: {
              id: result.insertedId.toString(),
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              email: newUser.email,
              phone: newUser.phone,
              createdAt: newUser.createdAt.toISOString()
            },
            registrationTime: new Date().toISOString()
          }
        })
      };
    } else {
      throw new Error('Failed to create user account');
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

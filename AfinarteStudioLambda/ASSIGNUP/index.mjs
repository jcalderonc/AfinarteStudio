import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file (for local testing)
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lambda:test@afinartestudio.czf6kai.mongodb.net/?retryWrites=true&w=majority&appName=AfinarteStudio';
const DB_NAME = process.env.DB_NAME || 'afinarteStudio';

let cachedClient = null;

const connectToDatabase = async () => {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    console.log('Using cached MongoDB connection');
    return cachedClient;
  }

  try {
    console.log('Creating new MongoDB connection...');
    console.log('Connection URI (without password):', MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));
    
    // Create a MongoClient with ServerApi version (official Atlas pattern)
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    console.log('Calling client.connect()...');
    await client.connect();
    console.log('Client.connect() completed');
    
    cachedClient = client;
    console.log('Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.error('Error name:', error.name);
    console.error('Error code:', error.code);
    console.error('Error cause:', error.cause);
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
    console.log('ASSIGNUP Lambda - User Registration');
    console.log('Lambda timeout should be at least 30 seconds');

    // Parse request body
    let requestBody;
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Password must be at least 4 characters long'
        })
      };
    }

    console.log('Creating new user account for:', email);

    // Connect to database
    const client = await Promise.race([
      connectToDatabase(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
      )
    ]);
    
    console.log('Database connection established');
    
    // Access users collection
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('users');
    
    // Check if user already exists (case insensitive email check)
    console.log('Checking if user already exists...');
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase()
    });
    
    if (existingUser) {
      console.log('User already exists');
      return {
        statusCode: 409,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'User with this email already exists'
        })
      };
    }
    
    console.log('User does not exist, creating new account...');
    
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
      console.log('User created successfully with ID:', result.insertedId);
      
      // Return success response (no sensitive data)
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
    console.error('Error in registration handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

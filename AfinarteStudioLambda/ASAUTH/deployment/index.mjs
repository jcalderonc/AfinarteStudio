import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB configuration - using official Atlas connection pattern with Stable API
const MONGODB_URI = 'mongodb+srv://lambda:test@afinartestudio.czf6kai.mongodb.net/?retryWrites=true&w=majority&appName=AfinarteStudio';
const DB_NAME = 'AfinarteStudio';

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

export const handler = async (event) => {
  try {
    console.log('ASAUTH Lambda - User Authentication');
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

    // Extract email and password
    const { email, password } = requestBody;
    
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Email and password are required'
        })
      };
    }

    console.log('Attempting to authenticate user:', email);

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
    
    // Find user by email (case insensitive)
    console.log('Searching for user in database...');
    const user = await usersCollection.findOne({
      email: email.toLowerCase()
    });
    
    if (!user) {
      console.log('User not found');
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
    }
    
    console.log('User found, verifying password...');
    
    // Verify password (plain text comparison for now)
    if (password !== user.password) {
      console.log('Password verification failed');
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      };
    }
    
    console.log('Password verified successfully');
    
    // Generate simple token (timestamp + user id encoded)
    const tokenData = {
      userId: user._id.toString(),
      email: user.email,
      timestamp: Date.now()
    };
    
    // Simple base64 encoding for token (not secure for production)
    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    
    console.log('Authentication successful, returning user data');
    
    // Return success response with user data and token
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
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
          expiresIn: '24h' // Token validity period
        }
      })
    };

  } catch (error) {
    console.error('Error in authentication handler:', error);
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

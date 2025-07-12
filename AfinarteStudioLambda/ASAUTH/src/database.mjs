import { MongoClient } from 'mongodb';

let cachedClient = null;

export const connectToDatabase = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
    });

    await client.connect();
    cachedClient = client;
    
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDatabase = async (dbName = process.env.DB_NAME || 'afinarteStudio') => {
  const client = await connectToDatabase();
  return client.db(dbName);
};

export const getUsersCollection = async () => {
  const db = await getDatabase();
  return db.collection('users');
};

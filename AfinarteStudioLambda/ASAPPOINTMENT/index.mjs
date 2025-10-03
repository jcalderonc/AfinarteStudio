import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file (for local testing)
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

// Database connection instance
let cache = null;

export const handler = async (event) => {
  try {
    // CORS validation
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight successful' })
      };
    }

    // Handle different HTTP methods
    if (httpMethod === 'GET') {
      return await getAppointments(event, corsHeaders);
    } else if (httpMethod === 'POST') {
      return await createAppointment(event, corsHeaders);
    } else if (httpMethod === 'PUT') {
      return await updateAppointment(event, corsHeaders);
    } else if (httpMethod === 'DELETE') {
      return await deleteAppointment(event, corsHeaders);
    } else {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: `Method ${httpMethod} not allowed`
        })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
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

// GET - Obtener todos los appointments
const getAppointments = async (event, corsHeaders) => {
  try {
    // Connect to database
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const appointmentsCollection = db.collection('appointments');
    
    // Get query parameters for filtering
    const queryParams = event.queryStringParameters || {};
    const { email, type, dateFrom, dateTo } = queryParams;
    
    // Build query filter
    let filter = {};
    if (email) {
      filter.email = email.toLowerCase();
    }
    if (type) {
      filter.type = type;
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.date.$lte = new Date(dateTo);
      }
    }
    
    // Get appointments
    const appointments = await appointmentsCollection.find(filter).sort({ date: 1 }).toArray();
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `Found ${appointments.length} appointments`,
        data: {
          appointments: appointments.map(appointment => ({
            id: appointment._id.toString(),
            email: appointment.email,
            date: appointment.date,
            type: appointment.type,
            comments: appointment.comments,
            location: appointment.location,
            createdAt: appointment.createdAt
          })),
          count: appointments.length,
          filters: filter
        }
      })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Error retrieving appointments',
        error: error.message
      })
    };
  }
};

// POST - Crear nuevo appointment
const createAppointment = async (event, corsHeaders) => {
  try {
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

    // Extract required fields
    const { email, date, type, comments, location } = requestBody;
    
    // Validate required fields
    if (!email || !date || !type) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Required fields: email, date, type'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Invalid email format'
        })
      };
    }

    // Validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Invalid date format'
        })
      };
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const appointmentsCollection = db.collection('appointments');
    
    // Create new appointment document
    const newAppointment = {
      email: email.toLowerCase().trim(),
      date: appointmentDate,
      type: type.trim(),
      comments: comments ? comments.trim() : '',
      location: location ? location.trim() : '',
      createdAt: new Date()
    };
    
    // Insert the new appointment
    const result = await appointmentsCollection.insertOne(newAppointment);
    
    if (result.insertedId) {
      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Appointment created successfully',
          data: {
            appointment: {
              id: result.insertedId.toString(),
              email: newAppointment.email,
              date: newAppointment.date.toISOString(),
              type: newAppointment.type,
              comments: newAppointment.comments,
              location: newAppointment.location,
              createdAt: newAppointment.createdAt.toISOString()
            }
          }
        })
      };
    } else {
      throw new Error('Failed to create appointment');
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Error creating appointment',
        error: error.message
      })
    };
  }
};

// PUT - Actualizar appointment
const updateAppointment = async (event, corsHeaders) => {
  try {
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

    // Extract fields
    const { id, email, date, type, comments, location } = requestBody;
    
    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Appointment ID is required'
        })
      };
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const appointmentsCollection = db.collection('appointments');
    
    // Build update object
    const updateData = { updatedAt: new Date() };
    if (email) {
      updateData.email = email.toLowerCase().trim();
    }
    if (date) {
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: 'Invalid date format'
          })
        };
      }
      updateData.date = appointmentDate;
    }
    if (type) {
      updateData.type = type.trim();
    }
    if (comments !== undefined) {
      updateData.comments = comments.trim();
    }
    if (location !== undefined) {
      updateData.location = location.trim();
    }
    
    // Update appointment
    const result = await appointmentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Appointment not found'
        })
      };
    }
    
    if (result.modifiedCount > 0) {
      // Get updated appointment
      const updatedAppointment = await appointmentsCollection.findOne({ _id: new ObjectId(id) });
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'Appointment updated successfully',
          data: {
            appointment: {
              id: updatedAppointment._id.toString(),
              email: updatedAppointment.email,
              date: updatedAppointment.date.toISOString(),
              type: updatedAppointment.type,
              comments: updatedAppointment.comments,
              location: updatedAppointment.location,
              createdAt: updatedAppointment.createdAt,
              updatedAt: updatedAppointment.updatedAt
            }
          }
        })
      };
    } else {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'No changes made to appointment'
        })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Error updating appointment',
        error: error.message
      })
    };
  }
};

// DELETE - Eliminar appointment
const deleteAppointment = async (event, corsHeaders) => {
  try {
    // Get appointment ID from query parameters or body
    let appointmentId;
    
    if (event.queryStringParameters && event.queryStringParameters.id) {
      appointmentId = event.queryStringParameters.id;
    } else if (event.body) {
      try {
        const requestBody = JSON.parse(event.body);
        appointmentId = requestBody.id;
      } catch (error) {
        // Ignore JSON parse error for query parameter case
      }
    }
    
    if (!appointmentId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Appointment ID is required'
        })
      };
    }

    // Connect to database
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const appointmentsCollection = db.collection('appointments');
    
    // Delete appointment
    const result = await appointmentsCollection.deleteOne({ _id: new ObjectId(appointmentId) });
    
    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Appointment not found'
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Appointment deleted successfully',
        data: {
          deletedId: appointmentId
        }
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: 'Error deleting appointment',
        error: error.message
      })
    };
  }
};

// Database connection function
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

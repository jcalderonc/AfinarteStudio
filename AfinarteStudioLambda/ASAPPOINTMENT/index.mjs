import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file (for local testing)
dotenv.config();

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection instance
let cache = null;

// Valid appointment statuses
const APPOINTMENT_STATUSES = ['Tentativo', 'Confirmado', 'Completado'];
const DEFAULT_STATUS = 'Tentativo';

export const handler = async (event) => {
  try {
    // CORS validation - Same as ASAUTH and ASSIGNUP
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Max-Age': '86400'
    };

    const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'CORS preflight successful' })
      };
    }

    // Validate authentication token for all methods except OPTIONS
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const token = authHeader?.replace('Bearer ', '') || authHeader;
    
    const tokenValidation = validateToken(token);
    if (!tokenValidation.valid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: 'Authentication required',
          error: tokenValidation.error
        })
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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400'
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
    const { email, type, status, dateFrom, dateTo } = queryParams;
    
    // Build query filter
    let filter = {};
    if (email) {
      filter.email = email.toLowerCase();
    }
    if (type) {
      filter.type = type;
    }
    if (status && APPOINTMENT_STATUSES.includes(status)) {
      filter.status = status;
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
            status: appointment.status ?? DEFAULT_STATUS,
            comments: appointment.comments,
            location: appointment.location,
            totalAmount: appointment.totalAmount ?? 0,
            balanceDue: appointment.balanceDue ?? 0,
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
    const { email, date, type, status, comments, location, totalAmount, balanceDue } = requestBody;
    
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

    // Parse and validate currency fields (optional; default 0)
    const parsedTotalAmount = parseCurrency(totalAmount, 'totalAmount');
    if (parsedTotalAmount.error) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: parsedTotalAmount.error }) };
    }
    const parsedBalanceDue = parseCurrency(balanceDue, 'balanceDue');
    if (parsedBalanceDue.error) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: parsedBalanceDue.error }) };
    }

    // Validate status (optional; default Tentativo)
    const appointmentStatus = status ? status.trim() : DEFAULT_STATUS;
    if (!APPOINTMENT_STATUSES.includes(appointmentStatus)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: `Invalid status. Allowed: ${APPOINTMENT_STATUSES.join(', ')}`
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
      status: appointmentStatus,
      comments: comments ? comments.trim() : '',
      location: location ? location.trim() : '',
      totalAmount: parsedTotalAmount.value,
      balanceDue: parsedBalanceDue.value,
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
              status: newAppointment.status,
              comments: newAppointment.comments,
              location: newAppointment.location,
              totalAmount: newAppointment.totalAmount,
              balanceDue: newAppointment.balanceDue,
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
    const { id, email, date, type, status, comments, location, totalAmount, balanceDue } = requestBody;
    
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
    if (status !== undefined) {
      const statusTrimmed = status.trim();
      if (!APPOINTMENT_STATUSES.includes(statusTrimmed)) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({
            success: false,
            message: `Invalid status. Allowed: ${APPOINTMENT_STATUSES.join(', ')}`
          })
        };
      }
      updateData.status = statusTrimmed;
    }
    if (comments !== undefined) {
      updateData.comments = comments.trim();
    }
    if (location !== undefined) {
      updateData.location = location.trim();
    }
    if (totalAmount !== undefined) {
      const parsed = parseCurrency(totalAmount, 'totalAmount');
      if (parsed.error) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: parsed.error }) };
      }
      updateData.totalAmount = parsed.value;
    }
    if (balanceDue !== undefined) {
      const parsed = parseCurrency(balanceDue, 'balanceDue');
      if (parsed.error) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: parsed.error }) };
      }
      updateData.balanceDue = parsed.value;
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
              status: updatedAppointment.status ?? DEFAULT_STATUS,
              comments: updatedAppointment.comments,
              location: updatedAppointment.location,
              totalAmount: updatedAppointment.totalAmount ?? 0,
              balanceDue: updatedAppointment.balanceDue ?? 0,
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

// Parse and validate currency (number or string); returns { value, error }
const parseCurrency = (input, fieldName) => {
  if (input === undefined || input === null) {
    return { value: 0, error: null };
  }
  const num = typeof input === 'string' ? parseFloat(input) : Number(input);
  if (Number.isNaN(num)) {
    return { value: null, error: `Invalid ${fieldName}: must be a number` };
  }
  if (num < 0) {
    return { value: null, error: `${fieldName} must be greater than or equal to 0` };
  }
  return { value: Math.round(num * 100) / 100, error: null };
};

// Token validation function - Same as ASAUTH
const validateToken = (token) => {
  try {
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    // Split token into payload and signature
    const [payload, signature] = token.split('.');
    if (!payload || !signature) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Decode payload
    const tokenData = JSON.parse(Buffer.from(payload, 'base64').toString());
    
    // Verify signature
    const expectedSignature = Buffer.from(JWT_SECRET + JSON.stringify(tokenData)).toString('base64');
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - tokenData.timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (tokenAge > maxAge) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, userData: tokenData };
  } catch (error) {
    return { valid: false, error: 'Token validation failed' };
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

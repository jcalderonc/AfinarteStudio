export const createResponse = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      ...headers
    },
    body: JSON.stringify(body)
  };
};

export const successResponse = (data, message = 'Success') => {
  return createResponse(200, {
    success: true,
    message,
    data
  });
};

export const errorResponse = (statusCode, message, error = null) => {
  return createResponse(statusCode, {
    success: false,
    message,
    error: error?.message || error
  });
};

export const unauthorizedResponse = (message = 'Unauthorized') => {
  return errorResponse(401, message);
};

export const badRequestResponse = (message = 'Bad Request') => {
  return errorResponse(400, message);
};

export const serverErrorResponse = (message = 'Internal Server Error', error = null) => {
  return errorResponse(500, message, error);
};

const sendResponse = (res, statusCode, success, message, data = {}, meta = undefined) => {
  const responseData = {
    success,
    message,
    data,
  };

  if (meta) {
    responseData.meta = meta;
  }

  return res.status(statusCode).json(responseData);
};

export const successResponse = (res, statusCode = 200, message = 'Success', data = {}, meta = undefined) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', error = undefined) => {
  const responseData = {
    success: false,
    message,
  };

  if (error) {
    responseData.error = typeof error === 'object' && error.message ? error.message : error;
  }

  return res.status(statusCode).json(responseData);
};

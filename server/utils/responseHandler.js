const responseHandler = (res, statusCode, message, data = null) => {
    if (!res) {
      throw new Error("Response object is null");
    }
  
    const responseObject = {
      status: statusCode < 400 ? "success" : "error",
      message,
      data
    };
  
    return res.status(statusCode).json(responseObject);
  };
  
  module.exports = responseHandler;
  
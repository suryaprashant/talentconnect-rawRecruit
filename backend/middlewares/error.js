const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.log(err);
  
    let statusCode = 500;
    let message = 'Server Error';
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      statusCode = 404;
      message = `Resource not found`;
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = Object.values(err.errors).map(val => val.message);
    }
  
    res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  
  export default errorHandler;
  
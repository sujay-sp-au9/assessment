const sendErrorDev = (err, res, req) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res, req) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR: ", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  err.message = err.message || "none";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res, req);
  } else if (process.env.NODE_ENV === "production") {
    if (
      err.name === "CastError" ||
      err.code === 11000 ||
      err.name === "ValidationError"
    ) {
      err.isOperational = true;
      err.statusCode = 400;
    }
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      err.isOperational = true;
      err.statusCode = 401;
    }
    sendErrorProd(err, res, req);
  }
  next();
};

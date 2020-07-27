/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.send({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = errorHandler;

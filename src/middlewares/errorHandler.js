const errorHandler = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.send({
    message: err.message,
    stack: err.stack,
  });
};

module.exports = errorHandler;

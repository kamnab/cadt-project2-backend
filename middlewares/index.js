const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}, user.sub: ${req.user.sub}, user.email: ${req.user.email}`);
  next(); // Call the next middleware function
};

const errorHandle = (err, req, res, next) => {
  console.error(`Server error message: ${err.message}, statusCode: ${res.statusCode}`);

  return res.status(500).send({ error: err.message });
};

module.exports = { logger, errorHandle };

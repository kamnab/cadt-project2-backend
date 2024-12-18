const logger = (req, res, next) => {
  console.log('Request Origin: ', req.headers.origin);
  console.log('Request referer: ', req.headers.referer);
  console.log('Request host: ', req.headers.host);

  !req.user ? console.log(`Hello ${!req.user ? 'Annonymous' : req.user.email}!`) :
    console.log(`${req.method} ${req.url}, user.sub: ${req.user.sub}, user.email: ${req.user.email}`);


  next(); // Call the next middleware function
};

const errorHandle = (err, req, res, next) => {
  console.error(`Server error message: ${err.message}, statusCode: ${res.statusCode}`);

  return res.status(500).send({ error: err.message });
};

module.exports = { logger, errorHandle };

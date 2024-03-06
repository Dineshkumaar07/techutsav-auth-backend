const jwt = require("jsonwebtoken");
const { handleError } = require("../util/profileErrorHandler");

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (token) {
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        const errors = handleError("Invalid Token", "token");
        res.status(400).json({ errors });
      } else {
        next();
      }
    });
  } else {
    const errors = handleError("Token Not Found", "token");
    res.status(400).json({ errors });
  }
};

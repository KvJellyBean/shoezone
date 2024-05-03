const jwt = require("jsonwebtoken");
const Account = require("../models/accounts");

/**
 * Middleware function to check and validate JWT token.
 * Redirects to login page if token is invalid or missing.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const requireAuth = (req, res, next) => {
  const token = req.cookies.shoezone_cookie;

  if (token) {
    // Verify JWT token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        // Redirect to login page if token is invalid
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        // Redirect to login page if token is invalid
        next();
      }
    });
  } else {
    // Redirect to login page if token is missing
    res.redirect("/login");
  }
};

/**
 * Middleware function to check current user based on JWT token.
 * Sets `res.locals.user` and `res.locals.userRole` accordingly.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkUser = (req, res, next) => {
  const token = req.cookies.shoezone_cookie;

  if (token) {
    // Verify JWT token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);

          // Set user to null if token is invalid
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);

          // Find user by decoded token's ID
          let user = await Account.findById(decodedToken.id);
          res.locals.user = user;

          // Set user to res.locals and determine user role
          if (user.username === "admin" || user.email === "admin@gmail.com") {
            res.locals.userRole = "admin";
          } else {
            res.locals.userRole = "user";
          }
          next();
        }
      }
    );
  } else {
    // Set user to null if token is missing
    res.locals.user = null;
    res.locals.userRole = "user";
    next();
  }
};

module.exports = { requireAuth, checkUser };

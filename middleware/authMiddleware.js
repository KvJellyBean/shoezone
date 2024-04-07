const jwt = require("jsonwebtoken");
const Account = require("../models/accounts");

// Middleware to check and validate JWT token
const requireAuth = (req, res, next) => {
  const token = req.cookies.shoezone_cookie;

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.shoezone_cookie;

  if (token) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
          next();
        } else {
          console.log(decodedToken);
          let user = await Account.findById(decodedToken.id);
          res.locals.user = user;

          // Check if user is admin
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
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };

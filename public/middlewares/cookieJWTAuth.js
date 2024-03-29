const jwt = require("jsonwebtoken");

exports.cookieJWTAuth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();

  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/");
  }
};

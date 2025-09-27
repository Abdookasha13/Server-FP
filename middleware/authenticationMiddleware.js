const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("no token provided");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(500).send("server erorre");
  }
}

module.exports = authenticate;

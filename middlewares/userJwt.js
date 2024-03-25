const jwt = require("jsonwebtoken");

function userJwt(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token is required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return res
          .status(401)
          .json({ success: false, message: "Token has expired" });
      case "JsonWebTokenError":
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      case "NotBeforeError":
        return res
          .status(401)
          .json({ success: false, message: "Token not active" });
      default:
        console.error(err);
        return res
          .status(401)
          .json({ success: false, message: "Token authentication failed" });
    }
  }
}

module.exports = userJwt;

const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_SECRET;

function generateAccessToken(userId, role) {
  return jwt.sign(
    {
      userId: userId,
      role: role,
    },
    secret,
    { expiresIn: "15m" }
  );
}

module.exports = generateAccessToken;

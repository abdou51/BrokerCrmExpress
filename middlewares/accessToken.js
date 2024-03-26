const jwt = require("jsonwebtoken");
const secret = process.env.ACCESS_TOKEN_SECRET;

function generateAccessToken(userId, role) {
  return jwt.sign(
    {
      userId: userId,
      role: role,
    },
    secret,
    { expiresIn: "30m" }
  );
}

module.exports = generateAccessToken;

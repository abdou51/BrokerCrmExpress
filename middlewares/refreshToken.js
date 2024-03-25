const jwt = require("jsonwebtoken");
const secret = process.env.REFRESH_SECRET;

function generateRefreshToken(userId, role) {
  return jwt.sign(
    {
      userId: userId,
      role: role,
    },
    secret
  );
}

module.exports = generateRefreshToken;

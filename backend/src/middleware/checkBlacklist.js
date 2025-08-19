const BlacklistedToken = require("../models/tokensModel");

async function checkIfTokenIsBlacklisted(token) {
  const blacklisted = await BlacklistedToken.findOne({ token });
  if (blacklisted) {
    return res.status(401).json({ error: "Token is invalidated" });
  }
}

module.exports = checkIfTokenIsBlacklisted;

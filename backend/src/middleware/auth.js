const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { checkIfTokenIsPresent } = require("./checkHeader");
const { checkIfTokenIsBlacklisted } = require("./checkBlacklist");

async function authMiddleware(req, res, next) {
  const token = checkIfTokenIsPresent(req); 

  await checkIfTokenIsBlacklisted(token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    throw new AppError("Invalid token", 401);
  }
}

module.exports = authMiddleware;

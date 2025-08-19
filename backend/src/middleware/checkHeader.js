async function checkIfTokenIsPresent(req) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
}

module.exports = checkIfTokenIsPresent;

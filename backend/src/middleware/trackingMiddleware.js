const Tracking = require("../models/Tracking");
const getNextId = require("../utils/getNextId");
const jwt = require("jsonwebtoken");

async function trackingMiddleware(req, res, next) {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const responseTime = Date.now() - start;

      
      let userId = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
        } catch (err) {
          // token inválido -> ignora
        }
      }

      const trackingData = {
        id: await getNextId("trackingid"),
        endpointAccess: req.originalUrl,
        requestMethod: req.method,
        statusCode: res.statusCode,
        responseTime: responseTime,
        timestamp: new Date(),
        userId,
      };

      await Tracking.create(trackingData);
    } catch (err) {
      console.error("Erro ao salvar log de tracking:", err);
    }
  });

  next();
}

module.exports = trackingMiddleware;

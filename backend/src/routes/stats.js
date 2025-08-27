const express = require("express");
const router = express.Router();
const Tracking = require("../models/Tracking");


router.get("/stats/requests", async (req, res, next) => {
  try {
    const logs = await Tracking.find();
    const breakdown = {};

    logs.forEach((log) => {
      if (!breakdown[log.endpointAccess]) breakdown[log.endpointAccess] = {};
      if (!breakdown[log.endpointAccess][log.requestMethod]) {
        breakdown[log.endpointAccess][log.requestMethod] = 0;
      }
      breakdown[log.endpointAccess][log.requestMethod]++;
    });

    res.json({
      total_requests: logs.length,
      breakdown,
    });
  } catch (err) {
    next(err);
  }
});


router.get("/stats/response-times", async (req, res, next) => {
  try {
    const logs = await Tracking.find();
    const result = {};

    logs.forEach((log) => {
      if (!result[log.endpointAccess]) {
        result[log.endpointAccess] = {
          total: 0,
          count: 0,
          min: log.responseTime,
          max: log.responseTime,
        };
      }

      const data = result[log.endpointAccess];
      data.total += log.responseTime;
      data.count++;
      data.min = Math.min(data.min, log.responseTime);
      data.max = Math.max(data.max, log.responseTime);
    });

    Object.keys(result).forEach((key) => {
      result[key].avg = result[key].total / result[key].count;
      delete result[key].total;
      delete result[key].count;
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});


router.get("/stats/status-codes", async (req, res, next) => {
  try {
    const logs = await Tracking.find();
    const statusSummary = {};

    logs.forEach((log) => {
      if (!statusSummary[log.statusCode]) statusSummary[log.statusCode] = 0;
      statusSummary[log.statusCode]++;
    });

    res.json(statusSummary);
  } catch (err) {
    next(err);
  }
});


router.get("/stats/popular-endpoints", async (req, res, next) => {
  try {
    const logs = await Tracking.find();
    const counts = {};

    logs.forEach((log) => {
      if (!counts[log.endpointAccess]) counts[log.endpointAccess] = 0;
      counts[log.endpointAccess]++;
    });

    let mostPopular = null;
    let maxCount = 0;
    Object.keys(counts).forEach((endpoint) => {
      if (counts[endpoint] > maxCount) {
        mostPopular = endpoint;
        maxCount = counts[endpoint];
      }
    });

    res.json({
      most_popular: mostPopular,
      request_count: maxCount,
    });
  } catch (err) {
    next(err);
  }
});

// Todos os logs de tracking
router.get("/stats/all", async (req, res, next) => {
  try {
    const logs = await Tracking.find().sort({ timestamp: -1 }); // mais recentes primeiro
    res.json(logs);
  } catch (err) {
    next(err);
  }
});


module.exports = router;

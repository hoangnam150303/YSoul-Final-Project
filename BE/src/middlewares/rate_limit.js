const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  keyGenerator: (req, res) => {
    return req.user ? req.user.id : req.ip;
  },

  skip: (req, res) => req.method === "OPTIONS",
});

module.exports = limiter;

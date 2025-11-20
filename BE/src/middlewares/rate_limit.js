const { rateLimit } = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 15,
  keyGenerator: (req, res) => {
    return req.user ? req.user.id : "guest";
  },
});

module.exports = limiter;

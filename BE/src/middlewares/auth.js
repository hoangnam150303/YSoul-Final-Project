const jwt = require("jsonwebtoken");
const { conectPostgresDb } = require("../configs/database");

// Check role, only admin can use function belong in admin
exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
        status: "ERROR",
      });
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN); // Giải mã token
    const adminResult = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1 AND is_admin = $2",
      [decode.id, true]
    );
    if (!adminResult) {
      return res.status(404).json({
        message: "User not found",
        status: "ERROR",
      });
    }
    req.user = adminResult.rows[0];
    next(); 
  } catch (error) {
    res.status(401).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

// Check role, only shop, seller can use function belong in shop
exports.isVip = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Trích xuất token từ headers

    if (!token) {
      return res.status(401).json({
        message: "Token not provided",
        status: "ERROR",
      });
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN); // Giải mã token

    const vipUser = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1 AND vip = $2",
      [decode.id, true]
    );

    if (vipUser.rows[0].status === false) {
      return res.status(404).json({
        message: "Your account is not active",
        status: "ERROR",
      });
    }
    if (vipUser.rows.length === 0) {
      return res.status(404).json({
        message: "not vip",
        status: "ERROR",
      });
    }

    req.user = vipUser.rows[0];
    next(); // Nếu hợp lệ, chuyển tiếp sang middleware tiếp theo
  } catch (error) {
    res.status(401).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

// Compare when users use website without login, they can see homepage but can not use any function in website
exports.isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Login first",
        status: "ERROR",
      });
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN);

    const userResult = await conectPostgresDb.query(
      "SELECT * FROM users WHERE id = $1",
      [decode.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Login first",
        status: "ERROR",
      });
    }
    if (userResult.rows[0].status === false) {
      return res.status(404).json({
        message: "Your account is not active",
        status: "ERROR",
      });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message,
      status: "ERROR",
    });
  }
};

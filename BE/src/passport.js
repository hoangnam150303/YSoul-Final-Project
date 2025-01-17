const passport = require("passport");
const GoogleStrategy = require("passport-google-token").Strategy;
const { conectPostgresDb } = require("./configs/database");

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_CLIENTID,
      clientSecret: process.env.GG_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, name, emails } = profile;
        const { familyName, givenName } = name;
        const email = emails[0].value;
        const avatar = profile._json.picture || "";
        // Kiểm tra người dùng có tồn tại không
        const res = await conectPostgresDb.query(
          "SELECT * FROM users WHERE authprovider = $1 AND email = $2",
          ["google", email]
        );

        let user = res.rows[0]; // Lấy người dùng nếu tồn tại

        if (!user) {
          // Tạo người dùng mới nếu chưa có
          const insertRes = await conectPostgresDb.query(
            "INSERT INTO users (name, email, lastlogin, status, authprovider, google_id, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [
              `${familyName} ${givenName}`,
              email,
              new Date(),
              true,
              "google",
              id,
              avatar,
            ]
          );
          user = insertRes.rows[0];
        }

        // Cập nhật thời gian đăng nhập của người dùng
        await conectPostgresDb.query(
          "UPDATE users SET lastlogin = $1 WHERE id = $2",
          [new Date(), user.id]
        );
        done(null, user); // Tiếp tục tới bước kế tiếp
      } catch (error) {
        console.error("Error in GoogleStrategy:", error.message);
        done(error, null);
      }
    }
  )
);

module.exports = passport;

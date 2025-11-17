const allowedOrigins = [
  process.env.CLIENT_URL, // Web dev
  process.env.MOBILE_URL, // Mobile dev
  process.env.MOBILE_EXPO_URL, // Mobile expo dev
  "https://ysoul.onrender.com"
];

const corsConfig = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS blocked:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },

  credentials: true,
  methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  allowedHeaders:
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization",
  exposedHeaders: "Content-Range,X-Content-Range,Authorization",
  optionsSuccessStatus: 200,
  crossOriginOpenerPolicy: "same-origin",
};

module.exports = corsConfig;

const allowedOrigins = [
  process.env.CLIENT_URL, // Web dev
  "exp://10.25.203.162:8081", // Mobile Expo Go
  "http://10.25.203.162:8081", // Mobile dùng fetch, axios
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

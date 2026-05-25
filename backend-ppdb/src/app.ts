import express from "express";
import cors from "cors";
import routes from "./routes";
import notifRoutes from "./routes/notifikasi.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-ppdb-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS origin:", origin);

      if (
        !origin ||
        origin === "undefined" ||
        origin === "null" ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Backend PPDB aktif",
  });
});

app.use("/api", routes);

// fallback untuk komponen lama yang masih panggil /notifikasi
app.use("/notifikasi", notifRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error: any, _req: any, res: any, _next: any) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message: error?.message || "Internal server error",
  });
});

export default app;

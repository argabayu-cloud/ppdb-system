import express from "express";
import cors from "cors";
import routes from "./routes";
import notifRoutes from "./routes/notifikasi.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://frontend-ppdb-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Jika origin tidak ada (falsy) atau bernilai string "undefined" / "null", izinkan tanpa log error/warning
      if (!origin || origin === "undefined" || origin === "null") {
        return callback(null, true);
      }

      // Jika origin ada di daftar allowedOrigins atau merupakan subdomain vercel.app
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        console.log("CORS Allowed for origin:", origin);
        return callback(null, true);
      }

      // Jika benar-benar diblokir
      console.warn("CORS Blocked for origin:", origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
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

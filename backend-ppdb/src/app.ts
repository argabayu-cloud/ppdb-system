import express from "express";
import cors from "cors";
import routes from "./routes";
import notifRoutes from "./routes/notifikasi.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.use("/api", routes);

app.use("/notifikasi", notifRoutes)

export default app;
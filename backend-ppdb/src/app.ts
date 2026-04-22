import express from "express";
import cors from "cors";
import routes from "./routes"; // ← ambil dari folder routes

const app = express();

app.use(cors());
app.use(express.json());

// ⬇️ TARUH DI SINI
app.use("/api", routes);

export default app;
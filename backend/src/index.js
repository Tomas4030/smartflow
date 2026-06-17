const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const intersectionRoutes = require("./routes/intersections");
const authRoutes = require("./routes/auth");
const municipalityRoutes = require("./routes/municipalities");
const eventRoutes = require("./routes/events");
const chatRoutes = require("./routes/chat");

const { requireAuth } = require("./middleware/auth");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "smartflow-api"
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/municipalities", municipalityRoutes);
app.use("/api/intersections", intersectionRoutes);
app.use("/api/events", requireAuth, eventRoutes);
app.use("/api/chat", chatRoutes);
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error"
  });
});
app.listen(PORT, () => {
  console.log(`SmartFlow API running on port ${PORT}`);
});
require("dotenv").config(); // 👈 IMPORTANT

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const mazeRoutes = require("./routes/maze.routes");
const performanceRoutes = require("./routes/performance.routes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mazes", mazeRoutes);
app.use("/api/performances", performanceRoutes);

app.get("/", (req, res) => {
  res.send("MazeMind API running");
});

module.exports = app;
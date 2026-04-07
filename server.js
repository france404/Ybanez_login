const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); 

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); 

const app = express();

// ✅ MIDDLEWARE (PUT CORS HERE — ONLY ONCE)
app.use(cors());
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// routes for pages
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Dashboard.html"));
});

// ✅ API routes (PUT ALL ROUTES HERE)
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// server start (ALWAYS LAST)
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
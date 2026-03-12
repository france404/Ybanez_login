const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve static files (CSS, JS, Bootstrap assets)
app.use(express.static(path.join(__dirname, "public")));

// routes for pages
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

// BOOTSTRAP DASHBOARD ROUTE
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Dashboard.html"));
});

// API routes
app.use("/api", authRoutes);

// server start
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
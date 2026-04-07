const express = require("express");
const cors = require("cors");
const path = require("path");
<<<<<<< HEAD
require("dotenv").config(); 

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); 

const app = express();

// ✅ MIDDLEWARE (PUT CORS HERE — ONLY ONCE)
app.use(cors());
app.use(express.json());

// serve static files
=======

const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// serve static files (CSS, JS, Bootstrap assets)
>>>>>>> 3af39a2ce4f406c7bfb587dae71b9aa81ec3d59f
app.use(express.static(path.join(__dirname, "public")));

// routes for pages
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Login.html"));
});

<<<<<<< HEAD
=======
// BOOTSTRAP DASHBOARD ROUTE
>>>>>>> 3af39a2ce4f406c7bfb587dae71b9aa81ec3d59f
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Dashboard.html"));
});

<<<<<<< HEAD
// ✅ API routes (PUT ALL ROUTES HERE)
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// server start (ALWAYS LAST)
=======
// API routes
app.use("/api", authRoutes);

// server start
>>>>>>> 3af39a2ce4f406c7bfb587dae71b9aa81ec3d59f
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
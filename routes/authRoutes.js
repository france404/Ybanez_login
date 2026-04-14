const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");


router.post("/register",auth.register);
exports.register = (req, res) => {
    res.send("Register route working");
};

router.post("/login",auth.login);
exports.login = (req, res) => {
    res.send("Login route working");
};

router.post("/reset-password", auth.resetPassword);

module.exports = router;
// controllers/authController.js
const db = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { sendWelcomeEmail } = require("../Config/email");
const axios = require("axios");
const qs = require("querystring");
const nodemailer = require("nodemailer");

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { name, email, password, confirmPassword, captcha } = req.body;

  if (!name || !email || !password || !confirmPassword || !captcha) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      qs.stringify({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captcha
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!response.data.success) {
      return res.status(400).json({
        message: "Captcha verification failed",
      });
    }

    // ================= EMAIL SETUP =================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS  // app password (NOT your real password)
      }
    });

    // ================= EMAIL MESSAGE =================
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Created Successfully",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been <b>successfully created</b>.</p>
        <p>You can now log in using your registered email and password.</p>
        <br>
        <p>Thank you for using our system!</p>
      `
    };

    // ================= SEND EMAIL =================
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Registration successful! Email sent."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const captcha = req.body["g-recaptcha-response"];

  if (!email || !password || !captcha) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Verify Google reCAPTCHA
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      qs.stringify({ secret: process.env.RECAPTCHA_SECRET_KEY, response: captcha }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("Login reCAPTCHA:", response.data);

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed",
        errors: response.data["error-codes"] || [],
      });
    }
  } catch (error) {
    console.error("Login Captcha error:", error);
    return res.status(500).json({ success: false, message: "Captcha verification error" });
  }

  // Check user in DB
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (result.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ success: false, message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    return res.status(200).json({ success: true, message: "Login successful", token });
  });
};

// ================= RESET PASSWORD =================
exports.resetPassword = (req, res) => {
  const { email } = req.body;
  return res.json({ message: `If ${email} is registered, you will receive reset instructions.` });
};
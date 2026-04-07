const db = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { sendWelcomeEmail } = require("../Config/email");

// ================= REGISTER =================
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    // 2. Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkSql, [email], async (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert user
        const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

        db.query(sql, [name, email, hashedPassword], async (err, result) => {
            if (err) return res.status(500).json(err);

            // 5. Send email notification
            console.log("About to call email function...");
            await sendWelcomeEmail(email, name);

            res.json({
                message: "User Registered Successfully"
            });
        });
    });
};
//Login
exports.login = (req,res)=>{

    const {email,password} = req.body;

    const sql = "SELECT * FROM users WHERE email=?";

    db.query(sql,[email],async (err,result)=>{

        if(result.length === 0){
            return res.json({message:"User not found"});
        }

        const user = result[0];

        const validPassword = await bcrypt.compare(password,user.password);

        if(!validPassword){
            return res.json({message:"Invalid Username or Password"});
        }

        const token = jwt.sign(
            {id:user.id},
            "secretkey",
            {expiresIn:"1h"}
        );

        res.json({
            message:"Login successful",
            token
        });

    });
};

exports.resetPassword = (req, res) => {
  const { email } = req.body;

  // TODO: Add logic to generate reset token & send email

  // For now, just simulate success
  res.json({ message: `If ${email} is registered, you will receive reset instructions.` });
};

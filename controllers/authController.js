const db = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register
exports.register = async (req,res)=>{

    const {name,email,password} = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    db.query(sql,[name,email,hashedPassword],(err,result)=>{
        if(err) return res.status(500).json(err);

        res.json({
            message:"User Registered Successfully"
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
            return res.json({message:"Invalid password"});
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

const db = require('../Config/db');
const bcrypt = require('bcrypt');
console.log("USING UPDATED CONTROLLER"); 
console.log("USER CONTROLLER LOADED"); 
console.log("LOADED UPDATED USER CONTROLLER");

// GET all users
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ADD user 
exports.addUser = async (req, res) => {
  console.log("ADD USER CONTROLLER HIT"); // debug log

  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("HASHED PASSWORD:", hashedPassword);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: 'User added successfully' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error hashing password' });
  }
};
// UPDATE user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const sql = 'UPDATE users SET name=?, email=? WHERE id=?';
  db.query(sql, [name, email, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User updated successfully' });
  });
};

// DELETE user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'User deleted successfully' });
  });

  
};
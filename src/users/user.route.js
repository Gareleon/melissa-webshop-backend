const express = require("express");
const User = require("./user.model");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post("/top-admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the admin by username
    const admin = await User.findOne({ username });

    // If admin is not found, send 404 response and return
    if (!admin) {
      return res.status(404).send({ message: "Admin not found!" });
    }

    // If password is incorrect, send 401 response and return
    if (admin.password !== password) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate the token if credentials are correct
    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send success response with token and user details
    return res.status(200).json({
      message: "Authentication successful",
      token: token,
      user: {
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("Failed to log in as admin", error);
    // Send a 500 response for unexpected errors
    if (!res.headersSent) {
      return res.status(500).send({ message: "Server error" });
    }
  }
});

module.exports = router;

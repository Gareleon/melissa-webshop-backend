const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // console.log("Authorization Header:", req.headers["authorization"]); Checking Headers for debugging purposes

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Odbijen pristup. Nema autorizacije." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Odbijen pristup. Nema tokena." });
  }
  //console.log("Received token:", token); For Debugging, shows encoded token

  jwt.verify(token, JWT_SECRET_KEY, (error, user) => {
    if (error) {
      console.error("JWT verification error:", error); // Improved log
      return res.status(403).json({ message: "Nepravilni kredentijali." });
    }
    //console.log("Decoded user:", user); This should not be used, only allowed for debugging
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({
          message: "Pristup odbijen. Samo administratori mogu pristupiti.",
        });
    }

    req.user = user; // Attach decoded token payload to req
    next();
  });
};

module.exports = verifyAdminToken;

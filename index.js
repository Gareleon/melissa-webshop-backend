const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const port = process.env.PORT || 5000;
require("dotenv").config(); // Import dotenv

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://melissa-webshop-frontend.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Add Helmet with CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://vercel.live", // Vercel Live reload scripts
        ],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'"],
      },
    },
  })
);

// Make DB URL with imported data from dotenv file
const DB_URL = `${process.env.DB_URL_BASE}:${process.env.SECRET_KEY}${process.env.DB_HOST}`;

// Routes for DB
const soapRoute = require("./src/soaps/soap.route");
const orderRoute = require("./src/orders/order.route");
const userRoute = require("./src/users/user.route");
const adminRoute = require("./src/stats/admin.stats");

app.use("/api/soaps", soapRoute);
app.use("/api/orders", orderRoute);
app.use("/api/melissa-admin", userRoute);
app.use("/api/top-admin", adminRoute);

async function main() {
  await mongoose.connect(DB_URL);
  app.get("/", (req, res) => {
    res.send("Melissa Shop is running!");
  });
}

main()
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

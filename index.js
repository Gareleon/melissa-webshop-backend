const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");

const allowedOrigins = [
  "http://localhost:5173",
  "https://melissa-webshop-backend.vercel.app",
  "http://localhost:5000",
  "https://melissa-webshop-frontend.vercel.app",
];

const port = process.env.PORT || 5000;

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Helmet for Security Headers
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://vercel.live"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'"],
      },
    },
  })
);

// MongoDB Connection String
const DB_URL = `${process.env.DB_URL_BASE}:${process.env.SECRET_KEY}${process.env.DB_HOST}`;

// Routes
const soapRoute = require("./src/soaps/soap.route");
const orderRoute = require("./src/orders/order.route");
const userRoute = require("./src/users/user.route");
const adminRoute = require("./src/stats/admin.stats");

app.use("/api/soaps", soapRoute);
app.use("/api/orders", orderRoute);
app.use("/api/melissa-admin", userRoute);
app.use("/api/top-admin", adminRoute);

// Home Route
const htmlMessage = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Melissa Shop</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #1f2937;
        color: white;
        text-align: center;
      }
      .footer {
        background-color: #1f2937;
        padding: 20px;
        font-weight: lighter;
      }
      .footer p {
        margin: 0;
        
      }
      .footer a {
        color: #38bdf8;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="footer">
    <h1>Melissa Shop Server</h1>
      <p>
        &copy; 2018-2024 HEMIJSKO-SAPUNSKA LABORATORIJA MELISSA. Sva prava
        zadržana. <br />
        Izradio 
        <a href="https://simplifyproblems.com" class="text-primary">Simplify Problems LLC</a>
      </p>
    </div>
  </body>
  </html>
`;

app.get("/", (req, res) => {
  res.send(htmlMessage);
});

// MongoDB Connection and Server Start
async function main() {
  try {
    await mongoose.connect(DB_URL);
    console.log("MongoDB connected successfully!");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

main();

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

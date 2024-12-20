const express = require("express");
const Soap = require("./soap.model");
const {
  postASoap,
  getAllSoaps,
  getSingleSoap,
  editSingleSoap,
  deleteSingleSoap,
} = require("./soap.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken.js");
const router = express.Router();

//Post a soap to MongoDB
router.post("/", verifyAdminToken, postASoap);

//Get a soap from MongoDB
router.get("/", getAllSoaps);

//Get a single soap from MongoDB
router.get("/:id", getSingleSoap);

//Update a soap from MongoDB
router.put("/:id", verifyAdminToken, editSingleSoap);

//Delete a soap from MongoDB
router.delete("/:id", deleteSingleSoap); //verifyAdminToken,

module.exports = router;

const Soap = require("./soap.model");

const postASoap = async (req, res) => {
  try {
    const newSoap = await Soap({ ...req.body });
    await newSoap.save(
      res
        .status(200)
        .send({ message: "Soap posted successfully", soap: newSoap })
    );
  } catch (error) {
    console.error("Error creating soap", error);
    res.status(500).send({ message: "Failed to create a soap" });
  }
};

const getAllSoaps = async (req, res) => {
  try {
    const soaps = await Soap.find().sort({ createdAt: -1 });
    res.status(200).send(soaps);
  } catch (error) {
    console.error("Error fetching soaps", error);
    res.status(500).send({ message: "Failed to fetch soaps" });
  }
};

const getSingleSoap = async (req, res) => {
  try {
    const { id } = req.params;
    const soap = await Soap.findById(id);
    if (!soap) {
      res.status(404).send({ message: "Soap is not found!" });
    }
    res.status(200).send(soap);
  } catch (error) {
    console.error("Error fetching soap", error);
    res.status(500).send({ message: "Failed to fetch soap" });
  }
};

const editSingleSoap = async (req, res) => {
  try {
    const { id } = req.params;
    const editedSoap = await Soap.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!editedSoap) {
      res.status(404).send({ message: "Soap is not found!" });
    }
    res.status(200).send({
      message: "Soap edited successfully!",
      soap: editedSoap,
    });
  } catch (error) {
    console.error("Error editing the soap", error);
    res.status(500).send({ message: "Failed to edit the soap" });
  }
};

const deleteSingleSoap = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSoap = await Soap.findByIdAndDelete(id);
    if (!deletedSoap) {
      res.status(404).send({ message: "Soap is not found!" });
    }
    res.status(200).send({
      message: "Soap deleted successfully!",
      soap: deletedSoap,
    });
  } catch (error) {
    console.error("Error deleting a soap", error);
    res.status(500).send({ message: "Failed to delete a soap" });
  }
};

module.exports = {
  postASoap,
  getAllSoaps,
  getSingleSoap,
  editSingleSoap,
  deleteSingleSoap,
};

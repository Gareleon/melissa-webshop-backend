const Soap = require("./soap.model");

const postASoap = async (req, res) => {
  try {
    const newSoap = await Soap({ ...req.body });
    await newSoap.save(
      res
        .status(200)
        .send({ message: "Proizvod uspešno kreiran!", soap: newSoap })
    );
  } catch (error) {
    console.error("Greška prilikom kreiranja.", error);
    res.status(500).send({ message: "Neuspešno kreiranje proizvoda." });
  }
};

const getAllSoaps = async (req, res) => {
  try {
    const soaps = await Soap.find().sort({ createdAt: -1 });
    res.status(200).send(soaps);
  } catch (error) {
    console.error("Greška prilikom prikaza proizvoda.", error);
    res.status(500).send({ message: "Neuspešno prikazivanje proizvoda." });
  }
};

const getSingleSoap = async (req, res) => {
  try {
    const { id } = req.params;
    const soap = await Soap.findById(id);
    if (!soap) {
      res.status(404).send({ message: "Proizvod ne postoji!" });
    }
    res.status(200).send(soap);
  } catch (error) {
    console.error("Greška prilikom prikaza proizvoda.", error);
    res.status(500).send({ message: "Neuspešno prikazivanje proizvoda." });
  }
};

const editSingleSoap = async (req, res) => {
  try {
    const { id } = req.params;
    const editedSoap = await Soap.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!editedSoap) {
      res.status(404).send({ message: "Proizvod ne postoji!" });
    }
    res.status(200).send({
      message: "Proizvod uspešno izmenjen!",
      soap: editedSoap,
    });
  } catch (error) {
    console.error("Greška prilikom izmene proizvoda.", error);
    res.status(500).send({ message: "Neuspešna izmena proizvoda." });
  }
};

const deleteSingleSoap = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSoap = await Soap.findByIdAndDelete(id);
    if (!deletedSoap) {
      res.status(404).send({ message: "Proizvod ne postoji!" });
    }
    res.status(200).send({
      message: "Proizvod uspešno izbrisan!",
      soap: deletedSoap,
    });
  } catch (error) {
    console.error("Greška prilikom brisanja proizvoda.", error);
    res.status(500).send({ message: "Neuspešno brisanje proizvoda." });
  }
};

module.exports = {
  postASoap,
  getAllSoaps,
  getSingleSoap,
  editSingleSoap,
  deleteSingleSoap,
};

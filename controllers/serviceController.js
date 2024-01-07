const Service = require("../models/service");
const Establishment = require("../models/establishment");

const createService = async (req, res) => {
  try {
    const serviceData = { ...req.body };
    const newService = new Service(serviceData);

    const createdService = await newService.save();
    for (const object of serviceData.establishments) {
      console.log(object);
      const establishment = await Establishment.findById(object);
      console.log(establishment);
      establishment.services.push(newService.id);
      await establishment.save();
    }

    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ error: "Error creating Service" });
    console.error(error);
  }
};

module.exports = {
  createService,
};

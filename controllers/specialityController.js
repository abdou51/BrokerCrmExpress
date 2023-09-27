const Speciality = require("../models/speciality");

const createSpeciality = async (req, res) => {
  try {
    const newSpeciality = new Speciality({
      name: req.body.name,
    });

    // Save the new Speciality to the database
    const createdSpeciality = await newSpeciality.save();

    res.status(201).json(createdSpeciality);
  } catch (error) {
    res.status(500).json({ error: "Error creating Speciality" });
  }
};

module.exports = {
  createSpeciality,
};

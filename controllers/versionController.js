const Version = require("../models/version");

const createVersion = async (req, res) => {
  try {
    const newVersion = new Version({
      ...req.body,
    });

    const createdVersion = await newVersion.save();

    res.status(201).json(createdVersion);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};
const getVersion = async (req, res) => {
  try {
    const version = await Version.findOne();

    res.status(200).json({ success: true, data: version });
  } catch (error) {
    res.status(500).json({ error: "Error getting Version" });
    console.error(error);
  }
};

module.exports = {
  createVersion,
  getVersion,
};

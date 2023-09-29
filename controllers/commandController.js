const Command = require("../models/command");

const createCommand = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/commands/${
      req.file.filename
    }`;
    console.log(imageUrl);
    const newCommand = new Command({
      invoice: imageUrl,
    });
    await newCommand.save();

    res.status(201).json(newCommand);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createCommand,
};

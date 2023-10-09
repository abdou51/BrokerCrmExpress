const Command = require("../models/command");
const Visit = require("../models/visit");

const createCommand = async (req, res) => {
  try {
    const signatureFileName = req.file.filename;
    const userId = req.user.userId;
    const userVisit = await Visit.findById(req.body.visit);
    if (!userVisit || userVisit.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to create a Command for this Visit.",
      });
    }
    if (userVisit.hasCommand == true) {
      return res.status(400).json({
        error: "A Command already exists for this visit.",
      });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const signatureUrl = `${baseUrl}/uploads/commands/${signatureFileName}`;
    const newCommand = new Command({
      signature: signatureUrl, // Store the complete URL
      visit: req.body.visit,
    });

    const savedCommand = await newCommand.save();
    userVisit.hasCommand = true;
    userVisit.command = savedCommand;
    await userVisit.save();
    res.status(201).json(savedCommand);
  } catch (error) {
    res.status(500).json({ error: "Error creating the command" });
    console.log(error);
  }
};
const getCommandById = async (req, res) => {
  try {
    const commandId = req.params.id;
    const command = await Command.findById(commandId).populate("visit");

    if (!command) {
      return res.status(404).json({ error: "Report not found." });
    }

    res.status(200).json(command);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the Command." });
    console.log(error);
  }
};

module.exports = {
  createCommand,
  getCommandById,
};

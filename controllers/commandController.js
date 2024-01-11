const Command = require("../models/command");
const Visit = require("../models/visit");

const createCommand = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userVisit = await Visit.findById(req.body.visit);
    if (!userVisit || userVisit.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to create a Command for this Visit.",
      });
    }
    if (userVisit.command == true) {
      return res.status(400).json({
        error: "A Command already exists for this visit.",
      });
    }
    const newCommand = new Command({
      ...req.body,
    });

    const savedCommand = await newCommand.save();
    userVisit.command = savedCommand;
    await userVisit.save();
    res.status(201).json(savedCommand);
  } catch (error) {
    res.status(500).json({ error: "Error creating the command" });
    console.error(error);
  }
};

const updateCommand = async (req, res) => {
  try {
    const commandId = req.params.id;
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ error: "Command not found." });
    }
    const userId = req.user.userId;
    const userVisit = await Visit.findById(command.visit);
    if (!userVisit || userVisit.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to update this Command.",
      });
    }
    const updatedCommand = await Command.findByIdAndUpdate(
      commandId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedCommand);
  } catch (error) {
    res.status(500).json({ error: "Error updating the command" });
    console.error(error);
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
    console.error(error);
  }
};

const getCommands = async (req, res) => {
  try {
    const commands = await Command.find().populate("visit");
    res.status(200).json(commands);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the Commands." });
    console.error(error);
  }
};

module.exports = {
  createCommand,
  getCommandById,
  getCommands,
  updateCommand,
};

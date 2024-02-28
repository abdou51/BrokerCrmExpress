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
      commandDate: userVisit.visitDate,
      user: req.user.userId,
      ...req.body,
    });

    const savedCommand = await newCommand.save();
    userVisit.command = savedCommand;
    await userVisit.save();
    res.status(201).json(savedCommand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating the command" });
  }
};

const updateCommand = async (req, res) => {
  try {
    const commandId = req.params.id;
    const command = await Command.findById(commandId);
    if (!command) {
      return res.status(404).json({ error: "Command not found." });
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
    console.error(error);
    res.status(500).json({ error: "Error updating the command" });
  }
};

const getCommandById = async (req, res) => {
  try {
    const commandId = req.params.id;

    const command = await Command.findById(commandId)
      .select("-user -visit")
      .populate({
        path: "motivations",
        select: "motivation",
      })
      .populate({
        path: "products.product",
        model: "Product",
        select: "name",
      })
      .populate({
        path: "finalSupplier",
        model: "Client",
        select: "fullName commune",
        populate: [
          {
            path: "wilaya",
          },
        ],
      })
      .populate({
        path: "signature",
        model: "File",
      })
      .populate({
        path: "invoice",
        model: "File",
      })
      .populate({
        path: "suppliers",
        model: "Client",
        select: "fullName commune",
        populate: [
          {
            path: "wilaya",
          },
        ],
      });

    if (!command) {
      return res.status(404).json({ error: "report not found." });
    }

    res.status(200).json(command);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the Report." });
  }
};

module.exports = {
  createCommand,
  getCommandById,
  updateCommand,
};

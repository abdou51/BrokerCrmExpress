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
    console.error(error);
    res.status(500).json({ error: "Error updating the command" });
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
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the Command." });
  }
};

const getCommandsByUserAndMonth = async (req, res) => {
  const { user, month, year, page = 1, limit = 10 } = req.body;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const options = {
    page: page,
    limit: limit,
    populate: [
      {
        path: "visit",
        populate: [{ path: "client" }],
      },
      {
        path: "products.product",
      },
      "motivations",
      "suppliers",
      "finalSupplier",
      "invoice",
      "signature",
    ],
  };

  try {
    const result = await Command.paginate(
      {
        "visit.user": user,
        createdAt: { $gte: startDate, $lt: endDate },
      },
      options
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the Commands." });
  }
};

module.exports = {
  createCommand,
  getCommandById,
  updateCommand,
  getCommandsByUserAndMonth,
};

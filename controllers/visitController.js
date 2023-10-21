const Visit = require("../models/visit");
const Command = require("../models/command");
const Report = require("../models/report");

const createVisit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { visitLocation, visitDate, client } = req.body;

    const newVisit = new Visit({
      user: userId,
      visitLocation,
      visitDate,
      client,
    });

    const createdVisit = await newVisit.save();

    res.status(201).json(createdVisit);
  } catch (error) {
    res.status(400).json({ error: "Failed to create the Visit." });
    console.log(error);
  }
};
const deleteVisit = async (req, res, next) => {
  const visitId = req.params.id;
  try {
    const visit = await Visit.findOneAndDelete({ _id: visitId });
    if (!visit) {
      return res
        .status(404)
        .json({ success: false, message: "Visit not found" });
    }

    if (visit.report) {
      await Report.findOneAndDelete({ _id: visit.report });
    }

    if (visit.command) {
      await Command.findOneAndDelete({ _id: visit.command });
    }

    return res.json({
      success: true,
      message: "Visit, report, and command deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createVisit,
  deleteVisit,
};

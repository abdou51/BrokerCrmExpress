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
    res.status(500).json({ error: "Failed to create the Visit." });
    console.log(error);
  }
};
const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const date = req.query.date;
    const { page = 1, limit = 10 } = req.query;
    if (!date) {
      res.status(400).json({ error: "Missing date in query params" });
    }
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      select: "-user -visitDate",
      populate: {
        path: "client",
        select: "fullName wilaya commune location type",
        populate: {
          path: "speciality",
        },
      },
    };
    const visits = await Visit.paginate(
      {
        user: userId,
        visitDate: date,
        state: "Planned",
      },
      options
    );
    const now = new Date();
    console.log(now);
    if (visits.docs.length == 0) {
      res.status(404).json({ error: "No task found" });
    } else {
      res.status(200).json(visits);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Get Tasks." });
    console.log(error);
  }
};
const cloneVisits = async (req, res) => {
  try {
    const { visitDate, clients } = req.body;
    const userId = req.user.userId;

    const visits = clients.map((client) => ({
      user: userId,
      visitLocation: client.visitLocation,
      visitDate: visitDate,
      client: client.client,
    }));

    await Visit.insertMany(visits);
    res
      .status(200)
      .json({ success: true, message: "Visits cloned Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clone visits." });
    console.log(error);
  }
};
const deleteVisit = async (req, res) => {
  try {
    const visitsToDelete = req.body;
    const visits = await Visit.deleteMany({ _id: { $in: visitsToDelete } });
    if (visits.length > 0) {
      await Report.findOneAndDelete({ _id: visit.report });
    }

    if (visits.length > 0) {
      await Command.findOneAndDelete({ _id: visit.command });
    }

    return res.status(200).json({
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
  cloneVisits,
  getTasks,
};

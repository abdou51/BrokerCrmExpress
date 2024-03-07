const UserTracking = require("../../models/userTracking");
const mongoose = require("mongoose");
const Visit = require("../../models/visit");
const getTrackingPerDay = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const user = req.query.user;
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const trackings = await UserTracking.find({
      user: new mongoose.Types.ObjectId(user),
      time: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    const tasks = await Visit.find({
      user: new mongoose.Types.ObjectId(user),
      state: "Planned",
      visitDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).populate("client");
    const tasksTracking = tasks.map(({ client }) => ({
      fullName: client.fullName,
      location: client.location,
    }));

    const visits = await Visit.find({
      user: new mongoose.Types.ObjectId(user),
      state: "Done",
      visitDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .populate("client")
      .populate("report");
    const visitsTracking = visits.map((visit) => ({
      fullName: visit.client.fullName,
      location: visit.report.location,
      createdAt: visit.report.createdAt,
    }));

    res.status(200).json({
      trackings: trackings,
      tasksTracking: tasksTracking,
      visitsTracking: visitsTracking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting tracking per day" });
  }
};

module.exports = {
  getTrackingPerDay,
};

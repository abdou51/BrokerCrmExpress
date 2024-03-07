const UserTracking = require("../../models/userTracking");

const getTrackingPerDay = async (req, res) => {
  try {
    const date = new Date(req.query.date);
    const user = req.query.user;
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const tracking = await UserTracking.find({
      user: user,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting tracking per day" });
  }
};

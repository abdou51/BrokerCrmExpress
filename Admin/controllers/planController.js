const mongoose = require("mongoose");
const Visit = require("../../models/visit");

const getPlan = async (req, res) => {
  try {
    const { user, month, year } = req.body;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const daysInMonth = [];
    for (let day = 1; day <= endDate.getDate(); day++) {
      daysInMonth.push(new Date(year, month - 1, day));
    }

    const visitsData = await Visit.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user),
          visitDate: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$visitDate" },
          month: { $month: "$visitDate" },
          year: { $year: "$visitDate" },
          state: 1,
        },
      },
      {
        $group: {
          _id: {
            day: "$day",
            month: "$month",
            year: "$year",
          },
          done: {
            $sum: {
              $cond: [{ $eq: ["$state", "Done"] }, 1, 0],
            },
          },
          total: { $sum: 1 },
        },
      },
    ]);

    const visits = daysInMonth.map((day) => {
      const visitData = visitsData.find(
        (data) =>
          data._id.day === day.getDate() &&
          data._id.month === day.getMonth() + 1 &&
          data._id.year === day.getFullYear()
      );

      return {
        day: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(day.getDate()).padStart(2, "0")}`,
        done: visitData ? visitData.done : 0,
        total: visitData ? visitData.total : 0,
      };
    });

    res.json(visits.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlan,
};

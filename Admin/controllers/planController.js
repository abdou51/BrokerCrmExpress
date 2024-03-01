const Visit = require("../../models/visit");
const Client = require("../../models/client");
const mongoose = require("mongoose");
const getPlan = async (req, res) => {
  try {
    const month = req.body.month;
    const year = req.body.year;
    const user = req.body.user;
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
          client: 1,
        },
      },
      {
        $group: {
          _id: {
            day: "$day",
            month: "$month",
            year: "$year",
            client: "$client",
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

    const visits = await Promise.all(
      daysInMonth.map(async (day) => {
        const visitDataForDay = visitsData.filter(
          (data) =>
            data._id.day === day.getDate() &&
            data._id.month === day.getMonth() + 1 &&
            data._id.year === day.getFullYear()
        );

        const locations = await Promise.all(
          visitDataForDay.map(async (visitData) => {
            const client = await Client.findById(visitData._id.client).populate(
              "wilaya"
            );
            return `${client.commune} , ${client.wilaya.name}`;
          })
        );

        const done = visitDataForDay.reduce(
          (sum, visitData) => sum + visitData.done,
          0
        );
        const total = visitDataForDay.reduce(
          (sum, visitData) => sum + visitData.total,
          0
        );

        return {
          day: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(
            2,
            "0"
          )}-${String(day.getDate()).padStart(2, "0")}`,
          done,
          total,
          locations,
        };
      })
    );

    res.json(visits.reverse());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlan,
};

const Visit = require("../../models/visit");
const User = require("../../models/user");

const getVisitsPerDay = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
    } = req.body;
    let userIds = [];
    let users = [];
    const date = new Date(req.body.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    let supervisorId;

    if (req.user.role === "Admin") {
      supervisorId = req.body.supervisorId;
      if (supervisorId !== undefined) {
        users = await User.find({ createdBy: supervisorId }, "_id");
      } else {
        users = await User.find({ role: "Kam" }, "_id");
      }
    } else if (req.user.role === "Supervisor") {
      supervisorId = req.user.userId;
      users = await User.find({ createdBy: supervisorId }, "_id");
    } else if (req.user.role === "Operator") {
      users = await User.find({ role: req.body.role }, "_id");
    }
    if (users.length > 0) {
      userIds = users.map((user) => user._id);
    }

    const options = {
      page,
      limit,
      sort: { [sortBy]: sortDirection === "desc" ? -1 : 1 },
      populate: [
        { path: "user", select: "fullName commune" },
        {
          path: "client",
          populate: [{ path: "wilaya" }, { path: "speciality" }],
          select:
            "visitsNumber fullName wilaya speciality totalSellers totalPostChifa potential phoneNumberOne phoneNumberTwo location commune email",
        },
      ],
    };
    console.log(options);
    const query = {
      user: { $in: userIds },
      visitDate: { $gte: startOfDay, $lte: endOfDay },
      state: "Done",
    };
    const result = await Visit.paginate(query, options);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVisitsPerDay,
};

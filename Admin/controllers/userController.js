const User = require("../../models/user");

const getUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let queryCondition = {};

    if (user.role === "SuperAdmin") {
      queryCondition = { role: "Admin" };
    } else if (user.role === "Admin") {
      const roles = ["Supervisor", "Kam", "Operator"];
      const requestedRoles =
        req.body.roles && req.body.roles.length
          ? req.body.roles.filter((role) => roles.includes(role))
          : roles;
      queryCondition = { role: { $in: requestedRoles } };
    } else if (user.role === "Supervisor") {
      queryCondition = { createdBy: user._id };
    } else {
      return res.status(403).json({ message: "Unauthorized to view users" });
    }
    const users = await User.find(queryCondition)
      .populate("wilayas")
      .select("-clients -passwordHash -createdBy");
    return res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

module.exports = {
  getUsers,
};

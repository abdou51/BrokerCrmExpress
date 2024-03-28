const User = require("../../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    let { password, ...userData } = req.body;

    let user = await User.findOne({
      username: userData.username,
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with given username already exists",
      });
    }

    if (userData.username === password) {
      return res.status(400).json({
        success: false,
        message: "Your username cannot be your password",
      });
    }
    if (req.user.role === "Supervisor") {
      user = new User({
        ...userData,
        createdBy: userId,
        passwordHash: bcrypt.hashSync(password, 10),
      });
    } else {
      user = new User({
        ...userData,
        passwordHash: bcrypt.hashSync(password, 10),
      });
    }
    user = await user.save();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "The user cannot be created" });
    }

    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error });
  }
};

const getUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const supervisorId = req.body.supervisorId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let queryCondition = {};

    if (user.role === "SuperAdmin") {
      queryCondition = { role: "Admin" };
    } else if (user.role === "Admin") {
      if (supervisorId) {
        queryCondition = { createdBy: supervisorId };
      } else {
        const roles = ["Supervisor", "Kam", "Operator"];
        const requestedRoles =
          req.body.roles && req.body.roles.length
            ? req.body.roles.filter((role) => roles.includes(role))
            : roles;
        queryCondition = { role: { $in: requestedRoles } };
      }
    } else if (user.role === "Supervisor") {
      queryCondition = { createdBy: user._id };
    } else {
      return res.status(403).json({ message: "Unauthorized to view users" });
    }
    const users = await User.find(queryCondition)
      .populate("wilayas")
      .select("-clients -passwordHash -createdBy")
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

const getSupervisors = async (req, res) => {
  try {
    const users = await User.find({
      role: "Supervisor",
    }).select("fullName");
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ message: "Error fetching supervisors", error: error.message });
  }
};

module.exports = {
  getUsers,
  registerUser,
  getSupervisors,
};

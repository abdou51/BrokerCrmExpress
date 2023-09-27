const User = require("../models/user");
const Client = require("../models/client");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/jwtMiddleware");

const registerUser = async (req, res) => {
  try {
    let { password, ...userData } = req.body;

    let user = await User.findOne({ username: userData.username });

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

    user = new User({
      ...userData,
      passwordHash: bcrypt.hashSync(password, 10),
    });

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
    res.status(500).json({ success: false, error: error });
  }
};
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate({
      path: "createdBy",
      select: "-passwordHash",
      populate: {
        path: "createdBy",
        select: "-passwordHash",
      },
    });

    if (!user) {
      return res.status(400).send("The user not found");
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        const token = generateToken(user.id, user.role);
        console.log(token);
        const userWithoutPassword = {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          role: user.role,
          createdBy: user.createdBy,
        };
        res.status(200).json({
          message: "Login successful",
          success: true,
          user: userWithoutPassword,
          token: token,
        });
      } catch (tokenError) {
        res.status(500).send("An error occurred while generating the token.");
      }
    } else {
      res.status(400).send("Password is wrong!");
    }
  } catch (error) {
    res.status(500).send("An error occurred while finding the user.");
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).send("The user cannot be found!");
    }

    if (
      req.user.role === "Admin" ||
      (req.user.role === "Supervisor" && userExist.role !== "Admin") ||
      userId === req.user.userId
    ) {
      let newPassword;
      if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
      } else {
        newPassword = userExist.passwordHash;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          username: req.body.username,
          passwordHash: newPassword,
          firstName: req.body.firstName,
          wilayas: req.body.wilayas,
        },
        { new: true }
      ).populate({
        path: "createdBy",
        select: "-passwordHash",
        populate: {
          path: "createdBy",
          select: "-passwordHash",
        },
      });

      const userWithoutPassword = {
        id: updatedUser.id,
        updatedUsername: updatedUser.username,
        firstName: updatedUser.firstName,
        role: updatedUser.role,
        createdBy: updatedUser.createdBy,
      };

      res.send(userWithoutPassword);
    } else {
      return res.status(403).send("Permission denied");
    }
  } catch (error) {
    res.status(500).send("An error occurred while updating the user.");
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .populate({
        path: "wilayas",
      })
      .populate({
        path: "createdBy",
        select: "-passwordHash",
      })
      .populate({
        path: "portfolio",
      });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users.");
  }
};
const addClientToPortfolio = async (req, res, next) => {
  const userId = req.params.id;
  const clientId = req.body.clientId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!user.portfolio.includes(clientId)) {
      user.portfolio.push(clientId);
      await user.save();

      return res.status(200).json({ message: "Client added to the portfolio" });
    } else {
      return res
        .status(400)
        .json({ message: "Client is already in the portfolio" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding the client to the portfolio",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getAllUsers,
  addClientToPortfolio,
};

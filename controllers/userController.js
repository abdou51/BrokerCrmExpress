const User = require("../models/user");
const Client = require("../models/client");
const Visit = require("../models/visit");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../middlewares/accessToken");
const generateRefreshToken = require("../middlewares/refreshToken");
const { buildMongoQueryFromFilters } = require("../utils/queryBuilder");

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.identifier }, { email: req.body.identifier }],
    }).select("-clients -createdBy -wilayas -username");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }

    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);
        const expiresIn = 15;
        const expirationDate = new Date(
          new Date().getTime() + expiresIn * 60000
        );

        const userWithoutPassword = {
          _id: user.id,
          username: user.username,
          firstName: user.firstName,
          role: user.role,
        };
        res.status(200).json({
          success: true,
          message: "Connexion réussie",
          data: {
            ...userWithoutPassword,
            accessToken,
            refreshToken,
            accessTokenExpiresAt: expirationDate,
          },
        });
      } catch (tokenError) {
        res.status(500).json({
          success: false,
          message: "Une erreur s'est produite lors de la génération du jeton.",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de la recherche de l'utilisateur.",
    });
  }
};

const updateUser = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.params.id;

    const userExist = await User.findById(userId).session(session);
    if (!userExist) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "The user cannot be found!" });
    }

    let newPassword = req.body.password
      ? bcrypt.hashSync(req.body.password, 10)
      : userExist.passwordHash;

    await User.findByIdAndUpdate(
      userId,
      { passwordHash: newPassword, ...req.body },
      { new: true, session }
    );

    await Visit.updateMany(
      { user: userId },
      { $set: { "reference.delegateFullName": req.body.fullName } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "L'utilisateur a été mis à jour avec succès",
    });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de la mise à jour de l'utilisateur.",
    });
  } finally {
    session.endSession();
  }
};

const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("clients");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const { filters, orderBy, pageNumber, pageSize } = req.body;
    const userClientsQuery = { _id: { $in: user.clients } };
    const filterQuery = buildMongoQueryFromFilters(filters);
    let query = { $and: [userClientsQuery, filterQuery] };

    const sortOrder =
      orderBy.operator === "asc" ? orderBy.value : `-${orderBy.value}`;

    const options = {
      page: pageNumber,
      limit: pageSize,
      sort: sortOrder,
      populate: [
        {
          path: "speciality",
        },
        {
          path: "service",
          select: "-establishments",
        },
        {
          path: "establishment",
          select: "-services",
        },
      ],
    };

    const result = await Client.paginate(query, options);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving portfolio.");
  }
};
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .select("-passwordHash -clients")
      .populate({
        path: "wilayas createdBy",
      });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user.");
  }
};
const getUniverse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .populate("wilayas")
      .populate("clients");

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const userWilayas = user.wilayas.map((wilaya) => wilaya._id);
    const userClients = user.clients.map((client) => client._id);
    let baseQuery = {
      wilaya: { $in: userWilayas },
      _id: { $nin: userClients },
    };

    const { filters, orderBy, pageNumber, pageSize } = req.body;
    const filterQuery = buildMongoQueryFromFilters(filters);
    let query = { $and: [baseQuery, filterQuery] };

    const sortOrder =
      orderBy.operator === "asc" ? orderBy.value : `-${orderBy.value}`;

    const options = {
      page: pageNumber,
      limit: pageSize,
      sort: sortOrder,
      populate: [
        {
          path: "speciality",
        },
        {
          path: "service",
          select: "-establishments",
        },
        {
          path: "establishment",
          select: "-services",
        },
      ],
    };

    const result = await Client.paginate(query, options);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving universe data.");
  }
};

const addClientToPortfolio = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const clientId = req.body.clientId;

    const user = await User.findById(userId);
    const client = await Client.findById(clientId);

    if (!user || !client) {
      return res.status(404).json({ message: "User or client not found" });
    }

    const isClientInPortfolio = user.portfolio.some(
      (item) => item.client && item.client.toString() === clientId
    );

    if (isClientInPortfolio) {
      return res
        .status(400)
        .json({ message: "Client is already in the user's portfolio" });
    }

    user.portfolio.push({ client: clientId });

    await user.save();

    res.status(200).json({ message: "Client added to the user's portfolio" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const removeClientFromPortfolio = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const clientId = req.body.clientId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const clientIndex = user.portfolio.findIndex(
      (item) => item.client && item.client.toString() === clientId
    );

    if (clientIndex === -1) {
      return res
        .status(400)
        .json({ message: "Client not found in the user's portfolio" });
    }

    user.portfolio.splice(clientIndex, 1);

    await user.save();

    res
      .status(200)
      .json({ message: "Client removed from the user's portfolio" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  loginUser,
  updateUser,
  addClientToPortfolio,
  removeClientFromPortfolio,
  getPortfolio,
  getUniverse,
  getMe,
};

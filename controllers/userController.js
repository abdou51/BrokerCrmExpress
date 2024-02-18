const User = require("../models/user");
const Client = require("../models/client");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/jwtMiddleware");
const { buildMongoQueryFromFilters } = require("../utils/queryBuilder");

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    }).select("-clients -createdBy -wilayas -username");

    if (!user) {
      return res.status(400).json({
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }

    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        const token = generateToken(user.id, user.role);
        const userWithoutPassword = {
          _id: user.id,
          username: user.username,
          firstName: user.firstName,
          role: user.role,
        };
        res.status(200).json({
          message: "Connexion réussie",
          user: userWithoutPassword,
          token: token,
        });
      } catch (tokenError) {
        res.status(500).send("An error occurred while generating the token.");
      }
    } else {
      res.status(400).json({
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send("Une erreur s'est produite lors de la recherche de l'utilisateur.");
    console.error(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(400).send("The user cannot be found!");
    }

    let newPassword;
    if (req.body.password) {
      newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
      newPassword = userExist.passwordHash;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        passwordHash: newPassword,
        ...req.body,
      },
      { new: true }
    );
    res.status(200).send("User updated successfully");
  } catch (error) {
    res.status(500).send("An error occurred while updating the user.");
    console.error(error);
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

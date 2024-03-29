const Client = require("../models/client");
const User = require("../models/user");
const Wilaya = require("../models/wilaya");

const createClient = async (req, res) => {
  const user = req.user;
  try {
    const clientData = { ...req.body };
    const wilaya = await Wilaya.findById(clientData.wilaya);
    const createdClient = await Client.create({
      ...clientData,
      wilayaref: wilaya.name,
    });
    if (user.role === "Delegate" || user.role === "Cam") {
      const delegate = await User.findById(user.userId);
      delegate.clients.push(createdClient.id);
      await delegate.save();
    }
    res.status(201).json(createdClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Client" });
  }
};
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving Clients.");
  }
};
const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await Client.findById(clientId)
      .populate("speciality")
      .populate({
        path: "service",
        select: "-establishments",
      })
      .populate({
        path: "establishment",
        select: "-services",
      });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching client" });
  }
};
const updateClient = async (req, res) => {
  try {
    const clientData = { ...req.body };
    const clientId = req.params.id;
    const updatedClient = await Client.findByIdAndUpdate(clientId, clientData, {
      new: true,
    });
    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client n'est pas trouvé",
      });
    }
    res.json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du client",
    });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
};

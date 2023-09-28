const Client = require("../models/client");

const createClient = async (req, res) => {
  try {
    const clientData = { ...req.body };
    const createdClient = await Client.create(clientData);

    res.status(201).json(createdClient);
  } catch (error) {
    res.status(500).json({ error: "Error creating Client" });
    console.log(error);
  }
};
const getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await Client.findById(clientId)
      .populate("speciality")
      .populate("wilaya");

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Error fetching client" });
    console.log(error);
  }
};

module.exports = {
  createClient,
  getClientById,
};

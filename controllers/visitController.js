const Visit = require("../models/visit");
const Client = require("../models/client");
const User = require("../models/user");

const createVisit = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const client = await Client.findById(req.body.client).populate(
      "wilaya speciality"
    );
    console.log(client);
    const newVisit = new Visit({
      ...req.body,
      user: userId,
      reference: {
        clientFullName: client.fullName,
        delegateFullName: user.fullName,
        clientSpeciality: client.speciality.name,
        clientWilaya: client.wilaya.name,
      },
    });

    const createdVisit = await newVisit.save();

    res.status(201).json(createdVisit);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};
const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const date = req.query.date;
    const { page = 1, limit = 10 } = req.query;
    if (!date) {
      res.status(400).json({ error: "Missing date in query params" });
    }
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      select: "-user",
      populate: {
        path: "client",
        select: "fullName wilaya commune location type",
        populate: {
          path: "speciality",
        },
        populate: {
          path: "wilaya",
          select: "name",
        },
      },
    };
    const visits = await Visit.paginate(
      {
        user: userId,
        visitDate: date,
      },
      options
    );
    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ error: "Failed to Get Tasks." });
    console.error(error);
  }
};
const cloneVisits = async (req, res) => {
  try {
    const { visitDate, clients } = req.body;
    const userId = req.user.userId;

    const visits = clients.map((client) => ({
      user: userId,
      visitLocation: client.visitLocation,
      visitDate: visitDate,
      client: client.client,
    }));

    await Visit.insertMany(visits);
    res
      .status(200)
      .json({ success: true, message: "Visits cloned Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to clone visits." });
    console.error(error);
  }
};
const deleteVisit = async (req, res) => {
  try {
    const visitsToDelete = req.body;
    Visit.deleteMany({ _id: { $in: visitsToDelete } });

    return res.status(200).json({
      success: true,
      message: "Visits deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getVisitsHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { client, page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { visitDate: -1 },
      populate: [
        {
          path: "report",
          populate: [
            { path: "products.product", select: "name" },
            { path: "suppliers" },
            { path: "comments" },
          ],
        },
        {
          path: "command",
          populate: [
            { path: "products.product", select: "name" },
            { path: "motivations" },
            { path: "suppliers" },
            { path: "finalSupplier" },
          ],
        },
      ],
    };

    const query = { user: userId, client, state: { $ne: "Planned" } };
    const visits = await Visit.paginate(query, options);

    res.json({ success: true, data: visits });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createVisit,
  deleteVisit,
  cloneVisits,
  getTasks,
};

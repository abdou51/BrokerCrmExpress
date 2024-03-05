const User = require("../../models/user");
const Client = require("../../models/client");
const Visit = require("../../models/visit");
const mongoose = require("mongoose");

const getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortDirection = "desc",
      type = "Pharmacy",
      fullName,
      user,
    } = req.body;

    let clientIdsWithDoneVisit = [];
    if (user) {
      const visits = await Visit.find({
        user: new mongoose.Types.ObjectId(user),
        state: "Done",
      }).distinct("client");

      clientIdsWithDoneVisit = visits;
    }

    const options = {
      page,
      limit,
      sort: { [sortBy]: sortDirection === "desc" ? -1 : 1 },
      populate: [
        { path: "wilaya", select: "name" },
        { path: "speciality", select: "name" },
      ],
      select: "fullName potential",
    };

    let query = {
      type: type,
      ...(fullName && {
        fullName: { $regex: fullName, $options: "i" },
      }),
    };

    if (user) {
      if (clientIdsWithDoneVisit.length > 0) {
        query._id = { $in: clientIdsWithDoneVisit };
      } else {
        query._id = null;
      }
    }

    const result = await Client.paginate(query, options);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getWholesalers = async (req, res) => {
  try {
    const type = req.query.type;
    const clients = await Client.find({ type: type })
      .populate({ path: "speciality", select: "name" })
      .select("fullName")
      .sort({ fullName: 1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

module.exports = {
  getClients,
  getWholesalers,
};

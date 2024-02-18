const User = require("../../models/user");
const Client = require("../../models/client");
const Visit = require("../../models/visit");
const mongoose = require("mongoose");

const getClients = async (req, res) => {
  try {
    const {
      supervisorId,
      delegateId,
      type,
      page = 1,
      limit = 10,
      sortBy = "fullName",
      sortDirection = "asc",
    } = req.body;
    let userIds = [];

    if (supervisorId) {
      const delegates = await User.find({ createdBy: supervisorId }).select(
        "_id"
      );
      userIds = [
        new mongoose.Types.ObjectId(supervisorId),
        ...delegates.map((d) => d._id),
      ];
    } else if (delegateId) {
      const delegate = await User.findById(delegateId);
      if (!delegate) {
        return res.status(404).json({ error: "Delegate not found" });
      }
      userIds = [
        new mongoose.Types.ObjectId(delegateId),
        new mongoose.Types.ObjectId(delegate.createdBy),
      ];
    } else {
      return res
        .status(400)
        .json({ error: "Supervisor or Delegate ID is required" });
    }
    const options = {
      page,
      limit,
      sort: { [sortBy]: sortDirection === "desc" ? -1 : 1 },
      populate: [{ path: "wilaya" }],
    };
    const query = {
      createdBy: { $in: userIds },
      type: type,
    };
    const result = await Client.paginate(query, options);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};
const getKamClients = async (req, res) => {
  try {
    const {
      type,
      page = 1,
      limit = 10,
      sortBy = "fullName",
      sortDirection = "asc",
    } = req.body;
    let userIds = [];

    const kams = await User.find({ role: "Kam" }).select("_id");
    userIds = [...kams.map((d) => d._id)];
    const options = {
      page,
      limit,
      sort: { [sortBy]: sortDirection === "desc" ? -1 : 1 },
      populate: [{ path: "wilaya" }],
    };
    const query = {
      createdBy: { $in: userIds },
      type: type,
    };
    const result = await Client.paginate(query, options);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in processing request" });
  }
};

module.exports = {
  getClients,
};

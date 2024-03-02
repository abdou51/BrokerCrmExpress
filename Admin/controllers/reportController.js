const Visit = require("../../models/visit");

const getVisitsPerMonth = async (req, res) => {
  try {
    const { page = 1, limit = 10, user, month, year } = req.body;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const options = {
      page,
      limit,
      select: "-user -reference",
      sort: { visitDate: -1 },
      populate: [
        {
          path: "client",
          populate: [{ path: "wilaya" }, { path: "speciality" }],
          select:
            "visitsNumber fullName wilaya speciality totalSellers totalPostChifa potential phoneNumberOne phoneNumberTwo location commune email",
        },
      ],
    };
    const query = {
      user: user,
      visitDate: { $gte: startDate, $lte: endDate },
      state: "Done",
    };
    const result = await Visit.paginate(query, options);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getVisitsPerMonth };

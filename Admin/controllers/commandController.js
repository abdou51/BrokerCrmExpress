const Command = require("../../models/command");

getCommandsByUserAndMonth = async (req, res) => {
  const { user, month, year, page = 1, limit = 10 } = req.body;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const options = {
    page: page,
    limit: limit,
    select: "-user",
    sort: { createdAt: -1 },
    populate: [
      {
        path: "visit",
        select: "-user -report -command -reference",
        populate: [
          {
            path: "client",
            select: "-createdBy ",
            populate: [{ path: "speciality" }, { path: "wilaya" }],
          },
        ],
      },
      {
        path: "products.product",
        select: "name",
      },
      {
        path: "motivations",
        select: "motivation",
      },
      {
        path: "suppliers",
        select: "wilaya fullName commune",
        populate: [{ path: "wilaya" }],
      },
      {
        path: "finalSupplier",
        select: "wilaya fullName commune",
        populate: [{ path: "wilaya" }],
      },
      {
        path: "invoice",
        select: "url",
      },
      {
        path: "signature",
        select: "url",
      },
    ],
  };

  try {
    const result = await Command.paginate(
      {
        user: user,
        createdAt: { $gte: startDate, $lt: endDate },
      },
      options
    );
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve the Commands." });
  }
};

module.exports = {
  getCommandsByUserAndMonth,
};

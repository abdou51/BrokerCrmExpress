const Report = require("../models/report");
const Visit = require("../models/visit");
const Client = require("../models/client");
const ExpensesDay = require("../models/expensesDay");
const ExpensesUser = require("../models/expensesUser");

const createReport = async (req, res) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    const userId = req.user.userId;
    const { visit, note, objectif, products, suppliers, comments, client } =
      req.body;

    const userVisit = await Visit.findById(visit).populate("client");
    if (!userVisit || userVisit.user.toString() !== userId) {
      return res.status(403).json({
        error: "You are not allowed to create a Report for this Visit.",
      });
    }

    if (userVisit.isDone) {
      return res.status(400).json({
        error: "A Report already exists for this visit.",
      });
    }
    if (client) {
      await Client.findByIdAndUpdate(userVisit.client, client);
    }
    const newReport = new Report({
      visit,
      note,
      objectif,
      products,
      suppliers,
      comments,
    });
    const createdReport = await newReport.save();
    userVisit.isDone = true;
    userVisit.report = createdReport;
    await userVisit.save();
    const update = {
      $inc: {
        totalVisitsDoctor: 0,
        totalVisitsPharmacy: 0,
        totalVisitsWholesaler: 0,
      },
    };

    if (userVisit.client.type === "Doctor") {
      update.$inc.totalVisitsDoctor = 1;
    } else if (userVisit.client.type === "Pharmacy") {
      update.$inc.totalVisitsPharmacy = 1;
    } else if (userVisit.client.type === "Wholesaler") {
      update.$inc.totalVisitsWholesaler = 1;
    }
    const expensesUser = await ExpensesUser.findOne({
      user: userId,
      createdDate: `${year}-${month}`,
    });
    console.log(expensesUser);
    const updatedExpensesDay = await ExpensesDay.findOneAndUpdate(
      { userExpense: expensesUser.id, createdDate: formattedDate },
      update,
      { new: true }
    );

    res.status(200).json(createdReport);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create the Report." });
  }
};

const getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;

    const report = await Report.findById(reportId)
      .populate({
        path: "visit",
        select: "-report",
        populate: [
          {
            path: "client",
            model: "Client",
          },
          {
            path: "user",
            model: "User",
            select: "-passwordHash -createdBy -wilayas -portfolio",
          },
        ],
      })
      .populate("comments")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "suppliers",
        model: "Client",
      });

    if (!report) {
      return res.status(404).json({ error: "report not found." });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve the Report." });
    console.log(error);
  }
};

const updateReport = async (req, res) => {
  try {
    const { visit, note, objectif, products, suppliers, comments } = req.body;
    const reportId = req.params.id;

    const existingReport = await Report.findById(reportId).populate({
      path: "visit",
    });
    if (!existingReport) {
      return res.status(404).json({
        error: "Report not found.",
      });
    }
    if (visit.client) {
      await Client.findByIdAndUpdate(
        existingReport.visit.client,
        visit.client,
        {
          new: true,
        }
      );
    }
    existingReport.objectif = objectif;
    existingReport.note = note;
    existingReport.products = products;
    existingReport.suppliers = suppliers;
    existingReport.comments = comments;
    const updatedReport = await existingReport.save();
    const report = await Report.findById(updatedReport._id)
      .populate({
        path: "visit",
        select: "-report",
        populate: [
          {
            path: "client",
            model: "Client",
          },
          {
            path: "user",
            model: "User",
            select: "-passwordHash -createdBy -wilayas -portfolio",
          },
        ],
      })
      .populate("comments")
      .populate({
        path: "products.product",
        model: "Product",
      })
      .populate({
        path: "suppliers",
        model: "Client",
      });
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: "Failed to edit the Rapport." });
    console.log(error);
  }
};

module.exports = {
  createReport,
  getReportById,
  updateReport,
};

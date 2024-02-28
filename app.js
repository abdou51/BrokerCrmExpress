const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
app.use(express.json());

require("dotenv").config();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
require("./cronjobs/expensesDay");

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "brokerCrm",
  })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Define routes
const userRoutes = require("./routes/userRoutes");
const wilayaRoutes = require("./routes/wilayaRoutes");
const specialityRoutes = require("./routes/specialityRoutes");
const clientRoutes = require("./routes/clientRoutes");
const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
const coProductRoutes = require("./routes/coProductRoutes");
const commentRoutes = require("./routes/commentRoutes");
const motvationRoutes = require("./routes/motivationRoutes");
const visitRoutes = require("./routes/visitRoutes");
const reportRoutes = require("./routes/reportRoutes");
const commandRoutes = require("./routes/commandRoutes");
const expensesConfigRoutes = require("./routes/expensesConfigRoutes");
const expensesDayRoutes = require("./routes/expensesDayRoutes");
const goalRoutes = require("./routes/goalRoutes");
const establishmentRoutes = require("./routes/establishmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const fileRoutes = require("./routes/fileRoutes");

//stats Routes
const delegateMonthRoutes = require("./stats/routes/delegateMonthRoutes");
const supervisorMonthRoutes = require("./stats/routes/supervisorMonthRoutes");
const adminMonthRoutes = require("./stats/routes/adminMonthRoutes");
const delegateYearRoutes = require("./stats/routes/delegateYearRoutes");
const supervisorYearRoutes = require("./stats/routes/supervisorYearRoutes");

// dashboard routes
const dashboardClientRoutes = require("./Admin/routes/clientRoutes");
const dashboardUserRoutes = require("./Admin/routes/userRoutes");
const dashboardVisitRoutes = require("./Admin/routes/visitRoutes");
const dashboardCommandRoutes = require("./Admin/routes/commandRoutes");

app.use("/users", userRoutes);
app.use("/wilayas", wilayaRoutes);
app.use("/specialities", specialityRoutes);
app.use("/clients", clientRoutes);
app.use("/companies", companyRoutes);
app.use("/products", productRoutes);
app.use("/coproducts", coProductRoutes);
app.use("/comments", commentRoutes);
app.use("/motivations", motvationRoutes);
app.use("/visits", visitRoutes);
app.use("/reports", reportRoutes);
app.use("/commands", commandRoutes);
app.use("/expensesconfig", expensesConfigRoutes);
app.use("/expensesdays", expensesDayRoutes);
app.use("/goals", goalRoutes);
app.use("/establishments", establishmentRoutes);
app.use("/services", serviceRoutes);
app.use("/upload", fileRoutes);
app.use("/uploads", express.static("uploads"));

//stats Routes
app.use("/stats/month/delegate", delegateMonthRoutes);
app.use("/stats/month/supervisor", supervisorMonthRoutes);
app.use("/stats/month/admin", adminMonthRoutes);
app.use("/stats/year/delegate", delegateYearRoutes);
app.use("/stats/year/supervisor", supervisorYearRoutes);
//dashboard routes
app.use("/dashboard/clients", dashboardClientRoutes);
app.use("/dashboard/users", dashboardUserRoutes);
app.use("/dashboard/visits", dashboardVisitRoutes);
app.use("/dashboard/commands", dashboardCommandRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status).json({ message: err });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

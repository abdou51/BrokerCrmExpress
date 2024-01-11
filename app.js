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
const commentRoutes = require("./routes/commentRoutes");
const motvationRoutes = require("./routes/motivationRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const visitRoutes = require("./routes/visitRoutes");
const reportRoutes = require("./routes/reportRoutes");
const commandRoutes = require("./routes/commandRoutes");
const expensesConfigRoutes = require("./routes/expensesConfigRoutes");
const expensesDayRoutes = require("./routes/expensesDayRoutes");
const statsRoutes = require("./routes/statsRoutes");
const goalRoutes = require("./routes/goalRoutes");
const establishmentRoutes = require("./routes/establishmentRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const fileRoutes = require("./routes/fileRoutes");

const api = process.env.API_URL;
app.use("/users", userRoutes);
app.use("/wilayas", wilayaRoutes);
app.use("/specialities", specialityRoutes);
app.use("/clients", clientRoutes);
app.use("/companies", companyRoutes);
app.use("/products", productRoutes);
app.use("/comments", commentRoutes);
app.use("/motivations", motvationRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/visits", visitRoutes);
app.use("/reports", reportRoutes);
app.use("/commands", commandRoutes);
app.use("/expensesconfig", expensesConfigRoutes);
app.use("/expensesday", expensesDayRoutes);
app.use("/stats", statsRoutes);
app.use("/goals", goalRoutes);
app.use("/establishments", establishmentRoutes);
app.use("/services", serviceRoutes);
app.use("/upload", fileRoutes);
app.use("/uploads", express.static("uploads"));

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

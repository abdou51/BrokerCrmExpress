const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
require("dotenv").config();

// Connect to the database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "brokerCrm",
  })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

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
const rapportRoutes = require("./routes/rapportRoutes");
const commandRoutes = require("./routes/commandRoutes");

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
app.use("/rapports", rapportRoutes);
app.use("/commands", commandRoutes);
app.use("/uploads/commands", express.static("uploads/commands"));

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

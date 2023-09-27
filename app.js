const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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

const api = process.env.API_URL;
app.use("/users", userRoutes);
app.use("/wilayas", wilayaRoutes);
app.use("/specialities", specialityRoutes);
app.use("/clients", clientRoutes);

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

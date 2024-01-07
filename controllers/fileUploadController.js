const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const fs = require("fs");
const fsPromises = fs.promises;

// Temporary upload location
const tempUploadPath = "uploads/temp";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the temporary directory exists
    fs.mkdirSync(tempUploadPath, { recursive: true });
    cb(null, tempUploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

const uploadImage = async (req, res) => {
  try {
    // Upload the file to a temporary location
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return res.status(400).send({ message: "No file selected" });
    }

    // Create a new File document and get the ID
    const newFile = new File();
    const newFileId = newFile._id.toString();

    // Move the file from the temp location to the new folder
    const newFolderPath = `uploads/${newFileId}`;
    fs.mkdirSync(newFolderPath, { recursive: true });

    const oldPath = req.file.path;
    const newPath = path.join(newFolderPath, req.file.originalname);
    await fsPromises.rename(oldPath, newPath);

    // Update the file document with the new path and save it
    newFile.url = newPath.replace(/\\/g, "/");
    await newFile.save();

    res.send({
      message: "File uploaded and saved successfully",
      file: newFile,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error occurred during upload or database operation",
      error: err,
    });
    console.error(err);
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.send(files);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving files" });
    console.error(err);
  }
};

module.exports = {
  uploadImage,
  getFiles,
};

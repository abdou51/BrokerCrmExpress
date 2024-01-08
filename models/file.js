const mongoose = require("mongoose");
const baseUrl = process.env.BASE_URL;

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      get: (url) => baseUrl + url,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;

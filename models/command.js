const mongoose = require("mongoose");

// const commandSchema = new mongoose.Schema(
//   {
//     visit: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Visit",
//       required: true,
//     },
//     isHonored: {
//       type: Boolean,
//       default: false,
//     },
//     note: {
//       type: String,
//     },
//     total: {
//       type: Number,
//       default: 0,
//     },
//     remise: {
//       type: Number,
//       default: 0,
//     },
//     totalRemised: {
//       type: Number,
//       default: 0,
//     },
//     products: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         total: {
//           type: Number,
//         },
//       },
//     ],
//     motivations: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Motivation",
//       },
//     ],
//     suppliers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Supplier",
//       },
//     ],
//     commandSupplier: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Supplier",
//     },
//   },
//   { versionKey: false }
// );

const commandSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
    },
  },
  { versionKey: false }
);
const Command = mongoose.model("Command", commandSchema);

module.exports = Command;

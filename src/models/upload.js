const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema(
  {
    images: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Upload", schema);

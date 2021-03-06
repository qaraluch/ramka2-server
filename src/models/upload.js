const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema(
  {
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Image",
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Upload", schema);

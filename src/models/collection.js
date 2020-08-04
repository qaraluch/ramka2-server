const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema(
  {
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Image",
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Collection", schema);

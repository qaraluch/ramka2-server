const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema(
  {
    imageOriginalName: {
      type: String,
      required: true,
    },
    imageFileName: {
      type: String,
      required: true,
    },
    imageServerPath: {
      type: String,
      required: true,
    },
    imageMimeType: {
      type: String,
      required: true,
    },
    imageSize: {
      type: Number,
      required: true,
    },
    imageExif: { type: mongoose.Schema.Types.Mixed },
    thumbnail: { type: mongoose.Schema.Types.Mixed },
    imageHash: { type: mongoose.Schema.Types.Mixed },
    parsedCSFilename: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamp: true }
);

//TODO: fix - should not be Mixed?

module.exports = mongoose.model("Image", schema);

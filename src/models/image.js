const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema(
  {
    imageUploadTimestamp: {
      type: String,
      required: true,
    },
    imageUploadTimestampISO: {
      type: String,
      required: true,
    },
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
    imageExif: {
      exifResults: {
        success: { type: Boolean },
        message: { type: mongoose.Schema.Types.Mixed },
      },
      data: { type: mongoose.Schema.Types.Mixed },
    },
    thumbnail: {
      cropResults: {
        success: { type: Boolean },
        message: { type: mongoose.Schema.Types.Mixed },
      },
      path: { type: String },
    },
    imageHash: {
      hashResults: {
        success: { type: Boolean },
        message: { type: mongoose.Schema.Types.Mixed },
      },
      data: { type: String },
    },
    parsedCSFilename: {
      parseResults: {
        success: { type: Boolean },
        message: { type: mongoose.Schema.Types.Mixed },
      },
      data: {
        year: { type: String },
        month: { type: String },
        day: { type: String },
        time: { type: String },
        version: { type: String },
        comment: { type: String },
        extension: { type: String },
      },
    },
  },
  { timestamp: true }
);

//TODO: fix - should not be Mixed?

module.exports = mongoose.model("Image", schema);

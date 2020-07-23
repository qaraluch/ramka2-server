const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var ImageSchema = new Schema({
  imageUploadTimeStamp: {
    type: String,
    required: true,
  },
  imageUploadTimeStampISO: {
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
});

module.exports = mongoose.model("Image", ImageSchema);

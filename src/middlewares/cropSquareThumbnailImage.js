const jimp = require("jimp");
// https://github.com/oliver-moran/jimp
const { serializeError } = require("serialize-error");
// https://github.com/sindresorhus/serialize-error

const thumbnailSizeDefault = [150, 150];

const cropSquareThumbnailImage = async (req, _, next) => {
  await multiCropImages(req);
  next();
};

function multiCropImages(req) {
  return Promise.all(
    req.files.map(async (file) => {
      const [message, success, path] = await cropSquareImage(
        file.path,
        `${file.path}_small`,
        thumbnailSizeDefault
      );
      const thumbnailCropResults = {
        success,
        message,
        path,
      };
      // save results for DB in routes/images.js
      file.thumbnailCropResults = thumbnailCropResults;
    })
  );
}

async function cropSquareImage(file, outputPath, defaultSize) {
  try {
    const image = await jimp.read(file);
    image.cover(defaultSize[0], defaultSize[1]); // size
    image.write(outputPath);
    return [null, true, outputPath];
  } catch (error) {
    const jimpErr = new Error(
      `cropSquareThumbnailImage.js - Sth. went wrong: with ${file} to ${outputPath}...\n ${error}`
    );
    const jimpErrObj = serializeError(jimpErr);
    return [jimpErrObj, false, null];
  }
}

module.exports = cropSquareThumbnailImage;

const exiftool = require("node-exiftool");
const exiftoolBin = require("dist-exiftool");
//github.com/Sobesednik/node-exiftool
const { serializeError } = require("serialize-error");
// https://github.com/sindresorhus/serialize-error

const getExifData = async (req, _, next) => {
  await multiGetExifData(req);
  next();
};

function multiGetExifData(req) {
  return Promise.all(
    req.files.map(async (file) => {
      const [message, success, data] = await getExif(file.path);
      const exifData = {
        success,
        message,
        data,
      };
      // save results for DB in routes/images.js
      file.exifData = exifData;
    })
  );
}

async function getExif(path) {
  const ep = new exiftool.ExiftoolProcess(exiftoolBin);
  await ep.open();
  let info;
  try {
    info = await ep.readMetadata(path, ["-File:all"]);
    await ep.close();
    if (info.error) {
      const exifToolError = new Error(
        `module node-exiftool internal error - sth. went wrong with getting exif data of a file: ${path}. \n ${info.error}`
      );
      const exifToolErrorObj = serializeError(exifToolError);
      return [exifToolErrorObj, false, null];
    }
    const dataCleanedUp = info.data[0];
    return [null, true, dataCleanedUp];
  } catch (error) {
    await ep.close();
    const exifError = new Error(
      `getExifData.js - sth. went wrong with getting exif data of a file: ${path}. \n ${error}`
    );
    const exifErrorObj = serializeError(exifError);
    return [exifErrorObj, false, null];
  }
}

module.exports = getExifData;

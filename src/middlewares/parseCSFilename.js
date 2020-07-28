const { serializeError } = require("serialize-error");
// https://github.com/sindresorhus/serialize-error

const parseCSFilename = async (req, _, next) => {
  await multiParse(req);
  next();
};

function multiParse(req) {
  req.files.map((file) => {
    const [message, success, data] = parseCSFilenameFn(file.originalname);
    const parsedData = {
      success,
      message,
      data,
    };
    // save results for DB in routes/images.js
    file.parsedCSFilename = parsedData;
  });
}

function parseCSFilenameFn(baseName) {
  const regexFileName = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\s(?<time>\d{2}\.\d{2}\.\d{2})(-)?(?<version>\d)?(\s)?(?<comment>[^.]+)?(?<ext>\..+)/;
  try {
    const match = regexFileName.exec(baseName);
    const year = match && match.groups.year;
    const month = match && match.groups.month;
    const day = match && match.groups.day;
    const time = match && match.groups.time;
    const version = match && match.groups.version;
    const commentRaw = match && match.groups.comment;
    const comment = commentRaw && commentRaw.trim();
    const extension = match && match.groups.ext;
    const resultObj = { year, month, day, time, version, comment, extension };
    if (match) {
      return [null, true, resultObj];
    }
    return [{ message: "No match!" }, false, null];
  } catch (error) {
    const parseError = new Error(
      `parseCSFilename.js - sth. went wrong with parse CS filename for a file: ${baseName}. \n ${error}`
    );
    const parseErrorObj = serializeError(parseError);
    return [parseErrorObj, false, null];
  }
}

module.exports = { parseCSFilename, parseCSFilenameFn };

const md5File = require("md5-file");
// https://github.com/kodie/md5-file
const { serializeError } = require("serialize-error");
// https://github.com/sindresorhus/serialize-error

const getHash = async (req, _, next) => {
  await multiGetHash(req);
  next();
};

function multiGetHash(req) {
  return Promise.all(
    req.files.map(async (file) => {
      const [message, success, data] = await hashIt(file.path);
      const hashData = {
        success,
        message,
        data,
      };
      // save results for DB in routes/images.js
      file.imageHash = hashData;
    })
  );
}

async function hashIt(path) {
  try {
    const hash = await md5File(path);
    return [null, true, hash];
  } catch (error) {
    const hashError = new Error(
      `getHash.js - sth. went wrong with calculate hash for a file: ${path}. \n ${error}`
    );
    const hashErrorObj = serializeError(hashError);
    return [hashErrorObj, false, null];
  }
}

module.exports = getHash;

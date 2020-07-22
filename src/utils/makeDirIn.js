const makeDir = require("make-dir");

async function makeDirIn(path) {
  try {
    await makeDir(path);
  } catch (error) {
    throw new Error(`makeDir.js - make dir failed: ${error}`);
  }
}

module.exports = makeDirIn;

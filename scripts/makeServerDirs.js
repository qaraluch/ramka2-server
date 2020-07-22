const makeDirIn = require("../src/utils/makeDirIn");

async function makeServerDirs() {
  try {
    await makeDirIn("./logs");
    await makeDirIn("./public");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
makeServerDirs();

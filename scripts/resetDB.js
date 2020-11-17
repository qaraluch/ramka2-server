/*eslint no-console: "off"*/
// script:
// resetDB.js
// node.js script that wipe out data (db records and files)
// in the process of app dev.
// Do not erase test data.
const { seedDBFirstTime, resetDB, connectDB, closeDB } = require("../src/db");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));

require("dotenv").config();

async function resetDBScript() {
  // eslint-disable-next-line no-console
  console.log("[!] Reset DB ...");
  console.log("[!] Removing files form dir: %s ", process.env.STORAGE_PATH);
  try {
    await rimraf(process.env.STORAGE_PATH);
    await connectDB();
    await resetDB();
    await seedDBFirstTime();
    await closeDB();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

resetDBScript();

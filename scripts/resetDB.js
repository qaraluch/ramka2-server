const { seedDBFirstTime, resetDB, connectDB, closeDB } = require("../src/db");

require("dotenv").config();

async function resetDBScript() {
  // eslint-disable-next-line no-console
  console.log("[!] Reset DB ...");
  try {
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

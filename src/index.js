const app = require("./server");
const { connectDB } = require("./db");

require("dotenv").config();

async function startAppServer() {
  try {
    await connectDB();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
  const port = process.env.PORT || 9000;
  // eslint-disable-next-line no-console
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App listening on port: ${port}`);
  });
}
startAppServer();

process.on("uncaughtException", (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});

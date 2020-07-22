const mongoose = require("mongoose");
const { models } = require("./models/");

const connectDB = () => {
  try {
    const protocol = "mongodb+srv://";
    const user = process.env.DB_USER;
    const pass = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const dbname =
      process.env.NODE_ENV === "test"
        ? process.env.DB_NAME_TEST
        : process.env.DB_NAME;
    const args = "?retryWrites=true&w=majority";
    const fullDbUrl = `${protocol}${user}:${pass}@${host}/${dbname}${args}`;
    return mongoose.connect(fullDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

async function seedDBFirstTime() {
  try {
    const userZero = new models.User({
      username: "anonymous",
    });
    await userZero.save();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function resetDB() {
  try {
    await Promise.all([
      models.User.deleteMany({}),
      models.Image.deleteMany({}),
    ]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

module.exports = {
  connectDB,
  resetDB,
  seedDBFirstTime,
  closeDB,
};

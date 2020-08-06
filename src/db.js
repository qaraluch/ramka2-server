const mongoose = require("mongoose");
const { models } = require("./models/");

const mongooseOptions = {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

function connectDB(type) {
  if (type === "atlas") {
    return connectDBAtlas();
  } else {
    return connectDBLocal();
  }
}

const connectDBAtlas = () => {
  try {
    const protocol = "mongodb+srv://";
    const user = process.env.DB_ATLAS_USER;
    const pass = process.env.DB_ATLAS_PASSWORD;
    const host = process.env.DB_ATLAS_HOST;
    const dbName =
      process.env.NODE_ENV === "test"
        ? process.env.DB_ATLAS_NAME_TEST
        : process.env.DB_ATLAS__NAME;
    const args = "?retryWrites=true&w=majority";
    const fullDbUrl = `${protocol}${user}:${pass}@${host}/${dbName}${args}`;
    return mongoose.connect(fullDbUrl, mongooseOptions);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const connectDBLocal = () => {
  const dbName =
    process.env.NODE_ENV === "test"
      ? process.env.DB_LOCAL_NAME_TEST
      : process.env.DB_LOCAL_NAME;
  const uriFull = `${process.env.DB_LOCAL_URI}/${dbName}`;
  try {
    return mongoose.connect(uriFull, mongooseOptions);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

async function seedDBFirstTime() {
  try {
    const userAnon = new models.User({
      username: "anonymous",
    });
    await userAnon.save();

    const collectionAll = new models.Collection({
      name: "all",
    });
    await collectionAll.save();
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
      models.Upload.deleteMany({}),
      models.Collection.deleteMany({}),
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

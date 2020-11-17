const mongoose = require("mongoose");
const { models } = require("./models/");

const mongooseOptions = {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

function returnDBName() {
  const dbName = process.env.NODE_ENV === "test" ? "ramka2-test" : "ramka2";
  return dbName;
}

function connectDB() {
  // connect to docker's mongo service; see: docker-compose.yml
  const user = process.env.DB_DOCKER_USER;
  const pass = process.env.DB_DOCKER_USER_PASS;
  const host = process.env.DB_DOCKER_HOST;
  const port = process.env.DB_DOCKER_PORT;
  const dbName = returnDBName();
  const uriFull = `mongodb://${user}:${pass}@${host}:${port}/${dbName}`;
  try {
    return mongoose.connect(uriFull, mongooseOptions);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

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

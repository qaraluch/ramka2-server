const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

const routes = require("./routes");
const middlewares = require("./middlewares");

const app = express();
const logger = morgan("dev");

app.use(cors());
app.use(helmet());
app.use(logger);
app.use(express.json({ limit: process.env.UPLOAD_LIMIT }));
app.use(
  express.urlencoded({ limit: process.env.UPLOAD_LIMIT, extended: true })
);

app.use("/public", express.static("public"));

app.use(middlewares.addContext);

app.get("/", (_, res) => {
  res.json({
    message: "This is api server for ptoject: Ramka v2",
  });
});

app.use("/session", routes.session);
app.use("/users", routes.users);
app.use("/images", routes.images);
app.use("/collections", routes.collections);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

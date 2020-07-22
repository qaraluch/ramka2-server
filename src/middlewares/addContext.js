const { models } = require("../models");

const addContext = async (req, _, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin("anonymous"),
  };
  next();
};

module.exports = addContext;

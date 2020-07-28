const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamp: true }
);

schema.statics.findByLogin = async function (login) {
  let user = await this.findOne({ username: login });
  if (!user) {
    user = await this.findOne({ email: login });
  }
  return user;
};

module.exports = mongoose.model("User", schema);

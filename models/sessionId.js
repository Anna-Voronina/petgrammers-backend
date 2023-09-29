const mongoose = require("mongoose");

const sessionIdSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
});

const RefreshToken = mongoose.model("sessionId", sessionIdSchema);

module.exports = RefreshToken;

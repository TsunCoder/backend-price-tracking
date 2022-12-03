const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    require: true,
  },
});

urlSchema.set("timestamps", true);

let Url = mongoose.model("Url", urlSchema);
module.exports = Url;

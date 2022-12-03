const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  icon_url: {
    type: String,
  },
  url: {
    type: String,
  },
});

let Category = mongoose.model("Category", categorySchema);
module.exports = Category;

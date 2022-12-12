const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
  },
  url: {
    type: String,
  },
});

let Category = mongoose.model("Category", categorySchema);
module.exports = Category;

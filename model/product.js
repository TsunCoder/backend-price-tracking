const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product = new Schema({
  id: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
  },
  name: {
    type: String,
  },
  url_key: {
    type: String,
  },
  inventory_status: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category'
  },
  price: {
    type: Number,
  },
});
product.set("timestamps", true);
let Product = mongoose.model("Product", product);

module.exports = Product;

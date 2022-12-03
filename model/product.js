const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const breadcrumbs = new Schema({
  name: {
    type: String,
  },
});

const images = new Schema({
  base_url: {
    type: String,
  },
});

const product = new Schema({
  id: {
    type: Number,
    required: true,
  },
  images: [images],
  name: {
    type: String,
  },
  short_url: {
    type: String,
  },
  inventory_status: {
    type: String,
  },
  categories: {
    type: String,
    required: true,
  },
  breadcrumbs: [breadcrumbs],

  price: {
    type: Number,
  },
});
product.set("timestamps", true);
let Product = mongoose.model("Product", product);

module.exports = Product;

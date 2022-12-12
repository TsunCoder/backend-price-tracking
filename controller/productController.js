const axios = require("axios");
const { response } = require("express");
const Category = require("../model/Category");
const Product = require("../model/Product");
const PriceTracker = require("../model/PriceTracker");
const productController = {

  getProduct: async (req, res, next) => {
    let listProduct = [];
    const category = await Category.find({}, { _id: 1, url: 1, category_name: 1 });
    category.map(async (s) => {
      axios.get(s.url).then((response) => {
        response.data.data.map(async (data) => {
          console.log(data);
          const product = new Product({
            id: data.id,
            image_url: data.thumbnail_url,
            name: data.name,
            url_key: data.url_key,
            inventory_status: data.inventory_status,
            category: s._id,
            price: data.price
          })
          listProduct.push(product);
          // console.log(data);
        });
      })
    });
    setTimeout(async () => {
      await Product.deleteMany({});
      await Product.insertMany(listProduct).then((r) => {
        res.json(r);
      });
    }, 3000);
  },

  getAll: async (req, res) => {
    const keyword = req.query.keyword
      ? {
        short_url: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};
    const products = await Product.find({ ...keyword }).sort({ _id: -1 });
    res.json({ products });
  },

  getPricesOfProductById: async (req, res) => {
    const keyword = req.query.keyword
      ? {
        short_url: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};
    const product = await Product.findOne({ ...keyword }).sort({ _id: -1 });
    console.log(product);
    if (product) {
      const prices = await PriceTracker.findOne({ id: [product.id] });
      res.json({ prices });
    }
  },

  getProductByCategory: async (req, res) => {
    const category = req.query.category;
    const products = await Product.find({
      breadcrumbs: { $elemMatch: { name: category } },
    }).sort({
      _id: -1,
    });
    res.json({ products });
  },
};
module.exports = productController;

const axios = require("axios");
const { response } = require("express");
const Category = require("../model/Category");
const Product = require("../model/Product");
const PriceTracker = require("../model/PriceTracker");
const { URL, URLSearchParams } = require("url");
const console = require("console");
const productController = {

  getProduct: async (req, res, next) => {
    let listProduct = [];
    const category = await Category.find({}, { _id: 1, url: 1, category_name: 1 });
    category.map(async (s) => {
      axios.get(s.url).then((response) => {
        response.data.data.map(async (data) => {
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
        $match: {
          _id: req.query.keyword.toString()
        }
      }
      : {};
    const products = await Product.find({ ...keyword }).sort({ _id: -1 });
    res.json({ products });
  },

  getProductByID: async (req, res) => {
    const id = req.query.id;
    const products = await Product.find({ _id: id }).sort({ _id: -1 });
    res.json({ products });
  },

  getProductByUrl: async (req, res) => {
    const regex = /([A-Za-z0-9]+(-+[A-Za-z0-9]+)+)/i;
    const keyword = req.query.keyword;

    const parsed = new URL(keyword);
    parsed.toString();
    const url_key = parsed.pathname.match(regex);
    const products = await Product.find({ url_key }).sort({ _id: -1 });

    res.json({ products });
  },

  getPricesOfProductByURL: async (req, res) => {
    const regex = /([A-Za-z0-9]+(-+[A-Za-z0-9]+)+)/i;
    var keyword = req.query.keyword;
    const parsed = new URL(keyword);
    parsed.toString();

    const url_key = parsed.pathname.match(regex);
    const product = await Product.findOne({ url_key });
    console.log(product);
    if (product) {
      const prices = await PriceTracker.findOne({ id: product.id });
      res.json({ prices });
    }
  },

  getPricesOfProductById: async (req, res) => {
    var id = req.query.id;

    const product = await Product.findOne({ id: id });
    if (product) {
      const prices = await PriceTracker.findOne({ id: product.id });
      res.json({ prices });
    }
  },

  getProductByCategory: async (req, res) => {
    const id = req.query.id;
    const products = await Product.find({
      category: id
    },
    ).sort({
      _id: -1,
    });
    res.json({ products });
  },
};
module.exports = productController;

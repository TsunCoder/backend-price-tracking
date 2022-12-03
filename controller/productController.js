const axios = require("axios");
const { response } = require("express");
const urlController = require("../controller/urlController");
const Category = require("../model/category");
const Product = require("../model/product");
const PriceTracker = require("../model/priceTracker");
const productController = {
  getProduct: async (req, res) => {
    let data = [];
    let listId = await urlController.getProductId();

    listId.map(async (id) => {
      const currentProduct = await Product.findOne({ id });
      if (id === currentProduct) {
        console.log("data exists");
      } else {
        axios
          .get(`https://tiki.vn/api/v2/products/${id}`)
          .then(async (response) => {
            const product = new Product({
              id: response.data.id,
              images: response.data.images,
              name: response.data.name,
              short_url: response.data.short_url,
              inventory_status: response.data.inventory_status,
              categories: response.data["categories"].name,
              breadcrumbs: response.data.breadcrumbs,
              price: response.data.price,
            });

            data.push(product);
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
    setTimeout(async () => {
      await Product.deleteMany({});
      await Product.insertMany(data).then((r) => {
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

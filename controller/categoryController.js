const axios = require("axios");
const urlController = require("../controller/urlController");
const Category = require("../model/category");
const Product = require("../model/product");
const category = require("../data/category");

const categoryController = {
  getCategories: async (req, res) => {
    await Category.deleteMany({});
    const importCategory = await Category.insertMany(category);
    res.send({ importCategory });
  },

  getAll: async (req, res) => {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const data = await Category.find({ ...keyword }).sort({ _id: -1 });
    res.json({ data });
  },
};
module.exports = categoryController;

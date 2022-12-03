const axios = require("axios");
const Url = require("../model/url");
const Tiki = require("../config/tiki");

const urlController = {
  getAllUrl: async (req, res) => {
    const url = await Url.find({}, { _id: 0, url: 1 });
    res.status(200).json(url);
  },

  addUrl: async (req, res) => {
    const newUrl = new Url(req.body);
    newUrl.save();
    res.status(200).json(newUrl);
  },

  getProductId: async (req, res) => {
    let listId = [];
    const listUrl = await Url.find({}, { _id: 0, url: 1 }).distinct("url");
    // console.log(listUrl);
    listUrl.forEach(async (url) => {
      // console.log(url);
      const productId = await Tiki.productId(url);
      listId.push(productId);
      // console.log(productId);
    });
    return listId;
  },
};

module.exports = urlController;

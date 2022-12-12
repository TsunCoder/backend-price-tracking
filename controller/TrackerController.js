const axios = require("axios");
const PriceTracker = require("../model/PriceTracker");
const Product = require("../model/Product");
const cron = require("node-cron");
const Category = require("../model/Category");

const trackerController = {
  autoUpdate: async (req, res) => {
    const category = await Category.find({}, { _id: 1, url: 1, category_name: 1 });
    category.map(async (s) => {
      try {
        axios
          .get(s.url)
          .then(async (response) => {
            response.data.data.map(async (data) => {
              const product = new Product({
                id: data.id,
                name: data.name,
                price: data.price,
              });
              const pricesObj = await PriceTracker.findOne({ id: product.id });
              console.log(pricesObj.prices);
              const lastPrice = pricesObj.prices.at(-1);
              console.log(lastPrice);

              if (product.price != lastPrice.price) {
                Product.findOneAndUpdate(
                  { id: product.id },
                  { $set: { price: product.price1 } },
                  (err, data) => {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Added");
                    }
                  }
                );
                if (pricesObj) {
                  pricesObj.prices.push({ price: product.price });
                  pricesObj.save();
                } else {
                  console.log("Not found");
                }
              }
            })




          });
      } catch (err) { }
    });
  },

  createTracking: async (req, res) => {
    try {
      axios
        .get("http://localhost:8000/api/AllProducts")
        .then(async (response) => {
          // get price from product
          response.data["products"].map(async (e) => {
            const { id, price } = e;
            const tracking = new PriceTracker({
              id: id,
              prices: [{ price: price }],
            });
            const currentTracking = await PriceTracker.findOne({ id });
            if (currentTracking) {
              console.log("Data exists");
            } else {
              tracking.save();
            }
            console.log(tracking.id);
          });
          res.json(response.data["products"]);
        });
    } catch (err) { }
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
    const data = await PriceTracker.find({ ...keyword }).sort({ _id: -1 });
    res.json({ data });
  },
};
module.exports = trackerController;

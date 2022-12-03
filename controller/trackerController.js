const axios = require("axios");
const urlController = require("../controller/urlController");
const PriceTracker = require("../model/priceTracker");
const Product = require("../model/product");
const cron = require("node-cron");

const trackerController = {
  autoUpdate: async () => {
    let listId = await urlController.getProductId();
    listId.map(async (id) => {
      try {
        axios
          .get(`https://tiki.vn/api/v2/products/${id}`)
          .then(async (response) => {
            try {
              const product = new Product({
                id: response.data.id,
                name: response.data.name,
                price: response.data.price,
              });
              // console.log(product);
              const pricesObj = await PriceTracker.findOne({ id });
              const lastPrice = pricesObj.prices.at(-1);

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
            } catch (e) {
              console.log(e);
            }
          });
      } catch (err) {}
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
    } catch (err) {}
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

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const price = new Schema(
  {
    price: { type: Number, required: true},
  },
  { timestamps: true }
);

const priceTracker = new Schema({
  id: { type: Number, required: true },
  prices: [price],
});

priceTracker.set("timestamps", true);

let PriceTracker = mongoose.model("PriceTracker", priceTracker);

module.exports = PriceTracker;

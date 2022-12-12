const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const route = require("./routes/route");

dotenv.config();
// Connect Database
const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://thienson:thienson@pricetracker.uqrulqw.mongodb.net/pricetracker?retryWrites=true&w=majority', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDatabase()

app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, Authorization, Accept, yourHeaderField');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
})

app.use(morgan("common"));

// Routes
app.use("/api/", route);
var port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});

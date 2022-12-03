const productController = require("../controller/productController");
const router = require("express").Router();
const urlController = require("../controller/urlController");
const trackerController = require("../controller/trackerController");
const cron = require("node-cron");
const categoryController = require("../controller/categoryController");

// URL Controller
router.post("/AddUrl", urlController.addUrl);
router.get("/AllURL", urlController.getAllUrl);
router.get("/AllProductID", urlController.getProductId);

// Category Controller
router.get("/AddCategory", categoryController.getCategories);
router.get("/AllCategory", categoryController.getAll);
// Product Controller
router.get("/AddProduct", productController.getProduct);
router.get("/AllProducts", productController.getAll);
router.get("/PricesOfProduct", productController.getPricesOfProductById);
// Category Controller
router.get("/ProductByCategory", productController.getProductByCategory);
// Tracking Controller
router.get("/Tracker/Create", trackerController.createTracking);
router.get("/Tracker/GetAllTrackings", trackerController.getAll);

cron.schedule("30 23 * * *", async () => {
  try {
    console.log("Running a task at 11:30 PM every day");
    const handler = trackerController.autoUpdate;
    handler();
  } catch (err) {
    console.log(err);
  }
}, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh",
});

module.exports = router;

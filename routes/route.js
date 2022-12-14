const productController = require("../controller/ProductController");
const router = require("express").Router();
const trackerController = require("../controller/TrackerController");
const cron = require("node-cron");
const categoryController = require("../controller/CategoryController");

// Category Controller
router.get("/AddCategory", categoryController.getCategories);
router.get("/AllCategory", categoryController.getAll);
// Product Controller
router.get("/AddProduct", productController.getProduct);
router.get("/AllProducts", productController.getAll);
router.get("/ProductById", productController.getProductByID);
router.get("/ProductByUrl", productController.getProductByUrl)
router.get("/PricesOfProduct", productController.getPricesOfProductByURL);
router.get("/PricesOfProductById", productController.getPricesOfProductById)
// Category Controller
router.get("/ProductByCategory", productController.getProductByCategory);
// Tracking Controller
router.get("/Tracking/Create", trackerController.createTracking);
router.get("/Tracking/GetAllTrackings", trackerController.getAll);

router.get("/TrackingProduct", trackerController.autoUpdate);
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

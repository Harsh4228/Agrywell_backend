const express = require("express");
const router = express.Router();
const controller = require("../controllers/upcomingProductController");

router.get("/", controller.getAllUpcomingProducts);
router.post("/", controller.addUpcomingProduct);
router.put("/:id", controller.updateUpcomingProduct);
router.delete("/:id", controller.deleteUpcomingProduct);

module.exports = router;

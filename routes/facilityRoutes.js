const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");

router.get("/", facilityController.getAllFacilities);
router.post("/", facilityController.addFacility);
router.put("/:id", facilityController.updateFacility);
router.delete("/:id", facilityController.deleteFacility);

module.exports = router;

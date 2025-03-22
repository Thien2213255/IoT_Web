const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

// Route để cập nhật dữ liệu từ Adafruit IO
router.get("/update-data/:feed", sensorController.updateData);

// Route để lấy dữ liệu từ MongoDB
router.get("/data/:feed", sensorController.getData);

// Route để cập nhật trạng thái thiết bị
router.post("/update-device/:feed", sensorController.updateDevice);
module.exports = router;
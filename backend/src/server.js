require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Tạo Schema
const SensorSchema = new mongoose.Schema({
  value: Number,
  timestamp: { type: Date, default: Date.now }
});
const Sensor = mongoose.model("Sensor", SensorSchema);

// API lấy dữ liệu từ Adafruit IO và lưu vào MongoDB
app.get("/update-data", async (req, res) => {
  try {
    const response = await axios.get(
      `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}/feeds/bbc-led/data`,
      {
        headers: { "X-AIO-Key": process.env.AIO_KEY },
      }
    );

    const latestData = response.data[0];
    const value = parseFloat(latestData.value);

    // Lưu vào MongoDB
    const newSensorData = new Sensor({ value });
    await newSensorData.save();

    console.log("Dữ liệu đã lưu:", value);
    res.json({ message: "Dữ liệu đã được cập nhật", value });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Adafruit IO:", error);
    res.status(500).json({ error: error.message });
  }
});

// API lấy dữ liệu từ MongoDB để hiển thị trên web
app.get("/sensor-data", async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu" });
  }
});

app.listen(5000, () => console.log("Server chạy tại http://localhost:5000"));

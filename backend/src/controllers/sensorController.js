const axios = require("axios");
const Fan_1 = require("../models/fan_1");
const Fan_2 = require("../models/fan_2");
const Light_1 = require("../models/light_1");
const Light_2 = require("../models/light_2");
const Temperature = require("../models/temperature");
const Humidity = require("../models/humidity");
const Light = require("../models/light");

// Map feed với model tương ứng
const feedModelMap = {
  "fan-1": Fan_1,
  "fan-2": Fan_2,
  "light-1": Light_1,
  "light-2": Light_2,
  temperature: Temperature,
  humidity: Humidity,
  light: Light
};

// Lấy dữ liệu từ Adafruit IO và lưu vào MongoDB
const updateData = async (req, res) => {
    const feedName = req.params.feed;
    const Model = feedModelMap[feedName];
  
    if (!Model) {
      return res.status(400).json({ error: `Feed ${feedName} không hợp lệ` });
    }
  
    try {
      console.log("AIO_USERNAME:", process.env.AIO_USERNAME);
      console.log("AIO_KEY:", process.env.AIO_KEY);
  
      if (!process.env.AIO_USERNAME || !process.env.AIO_KEY) {
        return res.status(500).json({ error: "Thiếu thông tin xác thực Adafruit IO" });
      }
  
      const response = await axios.get(
        `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}/feeds/${feedName}/data?limit=1`,
        {
          headers: { "X-AIO-Key": process.env.AIO_KEY }
        }
      );
  
      console.log("Dữ liệu từ Adafruit IO:", response.data);
  
      if (!response.data || response.data.length === 0) {
        return res.status(404).json({ error: `Không có dữ liệu từ feed ${feedName}` });
      }
  
      const latestData = response.data[0];
      console.log("latestData:", latestData);
  
      const value = parseFloat(latestData.value);
      console.log("Giá trị value sau parseFloat:", value);
  
      if (isNaN(value)) {
        return res.status(400).json({ error: `Giá trị từ feed ${feedName} không hợp lệ: ${latestData.value}` });
      }
  
      // Lấy giá trị mới nhất từ MongoDB
      const latestMongoData = await Model.findOne().sort({ timestamp: -1 });
      const latestMongoValue = latestMongoData ? latestMongoData.value : null;
  
      // So sánh giá trị từ Adafruit IO với giá trị trong MongoDB
      if (latestMongoValue !== null && latestMongoValue === value) {
        console.log(`Dữ liệu từ feed ${feedName} không thay đổi: ${value}. Bỏ qua lưu vào MongoDB.`);
        return res.status(200).json({ message: `Dữ liệu từ feed ${feedName} không thay đổi`, value });
      }
  
      // Nếu giá trị thay đổi hoặc không có dữ liệu trong MongoDB, lưu document mới
      const newData = new Model({ value });
      await newData.save();
  
      console.log(`✅ Dữ liệu từ feed ${feedName} đã lưu:`, value);
      res.json({ message: `Dữ liệu từ feed ${feedName} đã được cập nhật`, value });
    } catch (error) {
      console.error(`❌ Lỗi khi lấy dữ liệu từ feed ${feedName}:`, error.message);
      res.status(500).json({ error: "Lỗi khi lấy hoặc lưu dữ liệu", details: error.message });
    }
  };

// Lấy dữ liệu từ MongoDB
const getData = async (req, res) => {
  const feedName = req.params.feed;
  const Model = feedModelMap[feedName];

  if (!Model) {
    return res.status(400).json({ error: `Feed ${feedName} không hợp lệ` });
  }

  try {
    const data = await Model.find().sort({ timestamp: -1 }).limit(10);
    // console.log(`Dữ liệu từ MongoDB (${feedName}):`, data); // Debug
    res.json(data);
  } catch (error) {
    // console.error(`❌ Lỗi khi lấy dữ liệu từ ${feedName}:`, error.message);
    res.status(500).json({ error: `Lỗi khi lấy dữ liệu từ ${feedName}`, details: error.message });
  }
};

const updateDevice = async (req, res) => {
    const feedName = req.params.feed;
    const { value } = req.body; // Giá trị mới (0 hoặc 1)
  
    const Model = feedModelMap[feedName];
  
    if (!Model) {
      return res.status(400).json({ error: `Feed ${feedName} không hợp lệ` });
    }
  
    if (value !== 0 && value !== 1) {
      return res.status(400).json({ error: `Giá trị không hợp lệ: ${value}. Chỉ chấp nhận 0 hoặc 1.` });
    }
  
    try {
      // Gửi dữ liệu lên Adafruit IO
      await axios.post(
        `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}/feeds/${feedName}/data`,
        { value },
        {
          headers: { "X-AIO-Key": process.env.AIO_KEY }
        }
      );
  
      // Lưu vào MongoDB
      const newData = new Model({ value });
      await newData.save();
  
    //   console.log(`✅ Đã cập nhật trạng thái thiết bị ${feedName}:`, value);
      res.json({ message: `Đã cập nhật trạng thái thiết bị ${feedName}`, value });
    } catch (error) {
    //   console.error(`❌ Lỗi khi cập nhật trạng thái thiết bị ${feedName}:`, error.message);
      res.status(500).json({ error: "Lỗi khi cập nhật trạng thái thiết bị", details: error.message });
    }
  };

module.exports = { updateData, getData, updateDevice };
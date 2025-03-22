require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sensorRoutes = require("./routes/sensorRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Route gốc
app.get("/", (req, res) => {
  res.send("Chào mừng đến với server Smart Home! Các endpoint: /update-data/:feed, /data/:feed");
});

// Sử dụng routes
app.use("/api", sensorRoutes);

// Cấu hình cổng linh hoạt
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`✅ Server chạy tại http://localhost:${PORT}`));

// Đóng kết nối MongoDB khi server dừng
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("✅ Kết nối MongoDB đã đóng");
  process.exit(0);
});
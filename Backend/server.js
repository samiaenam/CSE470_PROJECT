const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const routes = require("./routes"); // central routes
const connectDB = require("./config/db");

dotenv.config();
console.log("MONGO_URI from env:", process.env.MONGO_URI);
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

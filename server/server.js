const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const connectDB = require("./config/dbconfig");

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

connectDB();



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
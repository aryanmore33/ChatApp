const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const connectDB = require("./config/dbconfig");
const authRoutes = require("./routes/authRoutes")

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

//middlewares
app.use(express.json()) // parse body data
app.use(cookieParser()) //parse token on every req
app.use(bodyParser.urlencoded({extended:true}));

connectDB();

app.get("/", (req, res) => {
    res.send("Server working");
  });
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
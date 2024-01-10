require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const mediaRouter = require("./routes/media");
const courseRouter = require("./routes/courses");
const orderRouter = require("./routes/orders");
const paymentRouter = require("./routes/payments");

const app = express();

app.use(logger("dev"));
app.use(express.json( { limit: "50mb" } ));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", courseRouter);
app.use("/media", mediaRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);

module.exports = app;

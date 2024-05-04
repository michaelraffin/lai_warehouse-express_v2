const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

var bodyParser = require("body-parser");

const scheduler = import("./api/scheduler.js");

const { auth } = require("express-oauth2-jwt-bearer");
require("dotenv").config();

const checkJwt = auth({
  audience: "USER-",
  issuerBaseURL: `https://florist-app.auth0.com/`,
});
const middlewares = require("./middlewares");
const api = require("./api");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// app.get('/', (req, res) => {
//   res.json({
//     message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
//   });
// });
scheduler;
app.use("/api/v1", api);
app.post("/api/getRecords/:Type", api);
app.post("/search/item", api);
app.post("/search/item/category", api);
app.post("/search/filter", api);
app.post("/search/find", api);
app.get("/get/filter", api);

app.post("/search/any", api);
app.post("/smartSearch", api);
app.post("/smartSearchV2", api);
app.post("/item/details", api);
app.post("/dummySeend", api);
app.post("/getMenuItem", api);
app.post("/placeOrder", api);
app.post("/orderTracker", api);
app.post("/store/details", api);
app.post("/details/:type", api);
app.post("/store/:Item", api);
app.post("/storeV2/:Item", api);

//Top and reports
app.post("/reports/:className/:type", api);
app.post("/top/:className", api);

app.post("/upload", api);
app.post("/updateReceipt", api);
app.post("/product/add", api);
app.post("/updateAdmn/Product/Multiple", api);
app.post("/sendMessage", api);

app.post("/createAuthToken", api);
app.post("/authToken", api);
app.post("/validateToken", api);

app.post("/Qrcode", api);
app.post("/notification/waitinglist", api);

app.post("/auth", api);
app.post("/validate", api);
app.post("/deleteProduct", api);

app.post("/updateAdmin/Store", api);
app.post("/support", api);
app.post("/stockman/fullfillment", api);
app.post("/product/transfer", api);
app.post("/updateAdmin/Product", api);
app.post("/update/:type", api);
app.post("/updateItem/:className", api);
app.post("/get/Order", api);
app.post("/notifier", api);

app.get("/get/allOrders", api);
app.get("/get/allOrders", api);

app.post("/search/:product", api);
app.post("/Loogy/Matrix", api);
app.post("/Loogy/SMSAuth", api);
app.post("/Loogy/create/:group", api);
app.post("/record/delete/:type", api);
app.post("/getNearestBooking", api);

app.post("/testDate", api);
app.post("/statistics", api);
app.post("/user/account/delete", api);

app.post("/user/Loogy/update_profile", api);
app.post("/user/Loogy/update_profileV2", api);
app.post("/user/Loogy/profile", api);
app.post("/user/Loogy/updateUser", api);
app.post("/user/Loogy/newPassword", api);
app.post("/user/Loogy/signout", api);
app.post("/user/Loogy/resetp", api);
app.post("/signin/Loogy", api);
app.post("/signup/Loogy", api);
app.post("/Loogy/verify/auth/sms", api);
app.post("/Loogy/placeOrder", api);
app.post("/Loogy/placeOrderV2", api);
app.post("/Loogy/load", api);
app.post("/Loogy/modifyLoad", api);

app.post("/Loogy/add", api);

app.post("/validate/:type", api);
app.post("/user/DeleteAccount", api);
app.post("/user/fetchProfile", api);

//stockman

app.post("/restock/stockman/:type", api);

// ** Signup LasoPH ** //
app.post("/signup", api);
app.post("/signup/facebook", api);
app.post("/signup/authService", api);
app.post("/user/create", api); // Manual

app.post("/user/fetchProfileByEmail", api); // Manual

app.put("/Order", api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;

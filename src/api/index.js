const express = require("express");
const crypto = require("crypto");
const emojis = require("./emojis");
var Jimp = require("jimp");
const fileUploader = require("express-fileupload");
const router = express.Router();
const db = require("monk")(
  "mongodb+srv://lookyClient:michaelmichael@cluster0-ae1yv.mongodb.net/Loogy?SMECredentials=true&w=majority",
);
var ObjectId = require("mongodb").ObjectID;
const Pooling = db.get("Poolig");
const B2 = require("backblaze-b2");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
var QRCode = require("qrcode");
var jwt = require("jsonwebtoken");
var Semaphore = require("node-semaphore-sms");
var moment = require("moment");
var sempahoreApikey = "50440f22bcac4a4826d49defd03eed3b";
var sms = new Semaphore(sempahoreApikey);
var { createClient } = require("@supabase/supabase-js");
const { auth } = require("express-oauth2-jwt-bearer");
var RPCClient = require("@alicloud/pop-core").RPCClient;
const Redis = require("ioredis");
const { CANCELLED } = require("dns");
const { Console } = require("console");
const redis = new Redis({
  port: 17791, // 6379, // Redis port
  host: "redis-17791.c257.us-east-1-3.ec2.cloud.redislabs.com", //"127.0.0.1", // Redis host
  //family: 4, // 4 (IPv4) or 6 (IPv6)
  password: "BlnGrxidVpaJhnNuUb7zvifngmukC7wW",
  // db: 0,
});
//new Redis(); // uses defaults unless given configuration object

var emailServer = "https://emailsender.loogyapi.digital"; //'http://192.168.1.148:9092' //

let lai = {
  laiURL: "https://kcmbvtljmfvslvswltqw.supabase.co",
  laiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbWJ2dGxqbWZ2c2x2c3dsdHF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk0NTUzOTksImV4cCI6MjAxNTAzMTM5OX0.v8XsaprXvCjMp7Anps_MDHjhhXsUUUyXz-dXuLr3un8",
};
let loogy = {
  loogyURL: "https://qthtoedmibuvqobvxagd.supabase.co",
  loogyKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDA4NDI2NywiZXhwIjoxOTU1NjYwMjY3fQ.xolRkFiSZYYgBKQkH4NzNstJJVPtABmJBQwFtAHgDg0",
};

const supabaseUrl = lai.laiURL;
const supabaseKey = lai.laiKey;
const supabase = createClient(supabaseUrl, supabaseKey);
const b2 = new B2({
  applicationKeyId: "000811d5e91ed390000000002", // or accountId: 'accountId'
  applicationKey: "K000NhvAf5VPIpTHWjyYcQX0uJGorhk", // or masterApplicationKey
});
var params = {
  Body: "The contents of the file",
  Bucket: "https://localflowershop.sgp1.digitaloceanspaces.com", // "https://nidz.fra1.digitaloceanspaces.com",
  Key: "pMbv9vaiDxkOLkjoYnYvIJXEi6Moag8etgcCv3OUAlg",
};

aws.config.update({
  accessKeyId: "HHAEL6AYSIVEU2CKJHKB",
  secretAccessKey: "Z7PAOdiRWioaBCF8RdTMq1lqYBothtAeuSJ9JUXRe1Y",
});

const spacesEndpoint = new aws.Endpoint("https://sgp1.digitaloceanspaces.com"); //https://fra1.digitaloceanspaces.com
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const checkJwt = auth({
  audience: "/login", //API IDENTIFIER
  issuerBaseURL: `https://florist-app.auth0.com/`,
});

const schedule = require("node-schedule");
schedule.scheduleJob("10	0	0	?	*	*	*", function (fireDate) {
  console.log(
    "This job was supposed to run at " +
      fireDate +
      ", but actually ran at " +
      new Date(),
  );
});

const options = (e) => ({
  method: "POST",
  uri: "https://exp.host/--/api/v2/push/send",
  body: {
    to: "ExponentPushToken[ID5nrIDdIvI2QG7k1nai1F]",
    title: "Order Has been made",
    body: `${e}`,
  },
  json: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const verifyUserAuthSupbase = (e, req) => ({
  method: "GET",
  json: true,
  uri: `https://qthtoedmibuvqobvxagd.supabase.co/auth/v1/user`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: req.headers.authorization,
    apikey: supabaseKey,
  },
});
const emailServiceAPI = (e, req) => ({
  method: "POST",
  json: true,
  uri: `${emailServer}/email-send`,
  body: e,
  headers: {
    "Content-Type": "application/json",
  },
});
const updateServiceAPI = (e, req) => ({
  method: "POST",
  json: true,
  uri: `${emailServer}/email-send-update-load`,
  body: e,
  headers: {
    "Content-Type": "application/json",
  },
});

const emailSignupAPI = (e, req) => ({
  method: "POST",
  json: true,
  uri: `${emailServer}/email-send-signup`,
  body: e,
  headers: {
    "Content-Type": "application/json",
  },
});
const matrixServiceParameter = (e) => ({
  // ?access_token=pk.eyJ1IjoibWFtbmlkeiIsImEiOiJjanZsNnhhZ24wdDE1NDlwYmRvczJzNDk2In0.Bl06Qp0TgR-KfisAsKbciQ
  // 121.001576,14.58277;121.11618,14.577658 $
  method: "GET",
  json: true,
  uri: `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${e}?access_token=pk.eyJ1IjoibWFtbmlkeiIsImEiOiJjanZsNnhhZ24wdDE1NDlwYmRvczJzNDk2In0.Bl06Qp0TgR-KfisAsKbciQ`,
  // body: {
  //   "access_token": "pk.eyJ1IjoibWFtbmlkeiIsImEiOiJjanZsNnhhZ24wdDE1NDlwYmRvczJzNDk2In0.Bl06Qp0TgR-KfisAsKbciQ"
  // }
});
const notifyUser = function (owner) {
  const request = require("request-promise");
  request(options(owner))
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log("error", err);
    });
};
const generateItineraryOrder = function (details, subject, introductionTitle) {
  console.log("generateItineraryOrder", details);
  var url = "https://loogyapi.digital/"; // "http://192.168.1.148:9092/" //
  var trackOrder = "https://tracker.loogy.co/";
  const request = require("request-promise");
  request(
    emailServiceAPI({
      buttonUrl: `${trackOrder}${details.referenceOrder}`,
      email: details.userEmail,
      subject: `${subject} ${details.referenceOrder}`,
      refrenceOrder: details.referenceOrder,
      companyName: "Loogy.co",
      introductionTitle: introductionTitle,
      loadType: details.loadType,
      trips: details.trips,
    }),
  )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log("request-promise error", err);
    });
};
const updateLoadItinerary = function (details, subject, introductionTitle) {
  console.log("generateItineraryOrder", details);
  var trackOrder = "https://tracker.loogy.co/";
  const request = require("request-promise");
  request(
    updateServiceAPI({
      buttonUrl: `${trackOrder}${details.referenceOrder}`,
      email: details.userEmail,
      subject: `${subject} ${details.referenceOrder}`,
      refrenceOrder: details.referenceOrder,
      companyName: "Loogy.co",
      introductionTitle: introductionTitle,
      loadType: details.loadType,
      taker: details.driverProfile, //Create a Itinerary Generator for Updates
      trips: details.trips,
    }),
  )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log("error", err);
    });
};
const generateSignupWelcome = function (
  req,
  res,
  next,
  details,
  subject,
  introductionTitle,
) {
  console.log("details", details);

  const request = require("request-promise");
  request(
    emailSignupAPI({
      buttonUrl: `https://loogyapi.digital//${details.referenceOrder}`,
      email: "michaelraffinpaculba@gmail.com",
      subject: `${subject} ${details.referenceOrder}`,
      refrenceOrder: details.referenceOrder,
      companyName: "Loogy.co",
      introductionTitle: introductionTitle,
      loadType: details.loadType,
      trips: details.trips,
    }),
  )
    .then(function (response) {
      console.log(response);
      next();
    })
    .catch(function (err) {
      console.log("error", err);
      next(error);
    });
};

const notifyMerchant = function (param, idCart) {
  const request = require("request-promise");
  var message = ", you've got an order worth of P";
  var payload = {
    from: "PHDelivery",
    to: param.storeDetails,
    message:
      "Hello " +
      param.storeCodeName +
      message +
      param.total +
      " with booking reference:  " +
      idCart +
      `. To view please tap this link  ${param.storeWebsite}/${idCart}`,
  };
  sms.sendsms(payload, function (error, result) {
    if (!error) {
      console.log(result);
    } else console.log(error);
  });
};
const requestSupbaseAuth = function (req, res, next) {
  var param = req.body;
  var coordinates = params;
  console.log("SUPBASEEE");
  const request = require("request-promise");
  request(verifyUserAuthSupbase(coordinates, req))
    .then(function (response) {
      req.user = response;
      console.log("SUCCESS");
      next();
    })
    .catch(function (err) {
      console.log("err");
      res.status(403).json({ status: false, message: err.message });
    });
};
const requestMatrixAPI = function (req, res, next) {
  var param = req.body;
  var coordinates = param.coordinates.join(";");
  const request = require("request-promise");
  request(matrixServiceParameter(coordinates))
    .then(function (response) {
      res.json(response);
    })
    .catch(function (err) {
      console.log("error", err);
    });
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "localflowershop/product",
    acl: "public-read",
    key: function (request, file, cb) {
      console.log("user request", request.files);
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
router.post("/", async (req, res, next) => {
  res.json({ name: "Michael Raffin Paculba" });
});

function capitalizeFirstLetter(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

// users.find({}, {sort: {name: 1}}).then(function () {
//   // sorted by name field
// })
router.post("/api/getRecords/:Type", async (req, res, next) => {
  var param = req.body;
  var queryLimit = Number(param.limit);
  var className = req.params.Type;

  var customerQuery = req.body.query;
  const classType = db.get(className);
  try {
    // ', '-privilege', '-username','-role','-categoryDetails'
    // ,['serviceName','description']

    if (customerQuery != undefined) {
      const list = await db
        .get("Categories")
        .find({ title: "Supplier" }, "-bigdata", { limit: param.limit })
        .then((docs) => {
          res.json({
            status: true,
            results: docs,
            count: docs.length,
            limit: param.limit,
          });
        });
    } else {
      const list = await classType
        .find({}, { limit: param.limit })
        .then((docs) => {
          res.json({
            status: true,
            results: docs,
            count: docs.length,
            limit: param.limit,
          });
        });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/updateAdmn/Product/Multiple", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const classType = db.get("Product");
  try {
    const list = await classType
      .update({ _id: param._id }, { $set: param })
      .then((updatedDoc) => {
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/updateItem/:className", async (req, res, next) => {
  var param = req.body;
  let className = req.params.className;
  const classType = db.get(className);
  try {
    const list = await classType
      .findOneAndUpdate({ _id: param._id }, { $set: param })
      .then((updatedDoc) => {
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/updateAdmin/Product", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const classType = db.get("Product");
  try {
    const list = await classType
      .findOneAndUpdate({ _id: param._id }, { $set: param })
      .then((updatedDoc) => {
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/Loogy/create/:group", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const LoogyGroup = db.get("LoogyGroup");
  param.dateCreated = new Date();
  param.groupID = makeidNumber(32);
  const isFound = await LoogyGroup.findOne({
    data: { title: param.data.title },
  });
  console.log("isFound", isFound);
  if (isFound === null) {
    const insets = await LoogyGroup.insert(param);
    return res.json({ results: insets, status: true });
  } else {
    res.status(402).json({
      status: false,
      message: `${param.data.title} is already existed, please change your title`,
      status: false,
    });
  }
});

router.post("/updateAdmin/Store", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("Store");
  console.log(param);
  try {
    const list = await classType
      .findOneAndUpdate({ _id: param._id }, { $set: param })
      .then((updatedDoc) => {
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/top/:className", async (req, res, next) => {
  var param = req.body;
  var classname = req.params.className;
  const classType = db.get(classname);
  console.log("param", classname);
  try {
    const aggregatedData = await classType.find(param.query, param.filter);
    // .sort({ stocks: 1 })
    // .limit(10);
    res.json({ results: aggregatedData, count: aggregatedData.length });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/reports/:className/:type", async (req, res, next) => {
  var param = req.body;
  var classname = req.params.className;
  const classType = db.get(classname);
  console.log("classname -> ", classname);
  console.log("param -> ", JSON.stringify(param));
  try {
    const aggregationPipeline = [
      {
        $project: {
          day: {
            $dayOfMonth: {
              $dateFromString: { dateString: "$transaction.date_created" },
            },
          },
          month: {
            $month: {
              $dateFromString: { dateString: "$transaction.date_created" },
            },
          },
          year: {
            $year: {
              $dateFromString: { dateString: "$transaction.date_created" },
            },
          },
          grandTotal: { $toDouble: "$transaction.grandTotal" },
          vendor: 1,
          transaction: 1,
        },
      },
      {
        $match: {
          $or: param.query,
          // { "$and": [{ "year": 2024 }, { "month": { "$gte": 1, "$lte": 2 } }, { "day": 7 }] }
        },
      },
      {
        $group: {
          _id: { day: "$day", month: "$month", year: "$year" },
          transactions: { $push: "$transaction" },
          vendors: { $push: "$vendor" },
          grandTotal: { $sum: "$grandTotal" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ];

    // const list = await   classType.findOneAndUpdate({_id: param.reference}, { $set: { orderStatus: param.orderStatus} }).then((updatedDoc) => {
    //   res.json({results:updatedDoc});
    // })
    const aggregatedData = await classType.aggregate(aggregationPipeline);
    res.json({
      results: aggregatedData,
      count: aggregatedData.length,
      type: req.params.type,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/update/:type", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const classType = db.get(param.type);
  try {
    const list = await classType
      .findOneAndUpdate(
        { _id: param.reference },
        { $set: { orderStatus: param.orderStatus } },
      )
      .then((updatedDoc) => {
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/get/allOrders", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("StoreOrders");
  try {
    //Distinc
    const list = await classType.find({}).then((docs) => {
      res.json({ results: docs, count: docs.length });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/get/Order", async (req, res, next) => {
  var param = req.body;
  const classType = db.get(param.type);
  try {
    //Distinc
    const list = await classType
      .find({ OrderType: param.OrderType }, { limit: param.numberofItems })
      .then((docs) => {
        res.json({ results: docs, count: docs.length });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/search/:product", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("LoogyGroup");
  try {
    //Distinc
    // 'shortName':param.value
    // var object = { field1: <value>, field2: <value> ... }
    const list = await classType.findOne(param.query).then((docs) => {
      res.json({ results: docs, status: docs === null ? false : true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/get/filter", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("Services");
  try {
    //Distinc
    const list = await classType.distinct("productImageList").then((docs) => {
      res.json({ results: docs, count: docs.length });
    });

    // const list = await classType.find({}, {sort: {priceStart: 1}}).then((item)=> {
    // // sorted by name field
    // res.json({results:item,others:[]});
    // })
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// checkJwt,async
// ,validateTokens,
router.post("/Loogy/placeOrder", async (req, res, next) => {
  const params = req.body;
  const rental = db.get("LoogyPooling");
  var data = params;
  data.referenceOrder = makeid(6);
  data.user = params.user;
  data.status = "Pending";
  try {
    var results = [];
    var totalItems = 0;
    const insets = await rental.insert(data).then((item) => {
      console.log("booked item", item);
      res.json({ results: item });
      item.userEmail = data.userEmail;
      generateItineraryOrder(
        item,
        "Load has been created",
        "New load has been created! ",
      );
    });
  } catch (error) {
    console.log("params", params);
    console.log(error);
    next(error);
  }
});

router.post("/validate/video", async (req, res, next) => {
  const param = req.body;
  const oders = db.get("StoreOrders");
  param.mobileReference;
  console.log(param);

  try {
    const list = await oders
      .find({
        orderReference: param.mobileReference,
        orderReference: param.mobileReference,
      })
      .then((docs) => {
        console.log(docs[0]);
        if (docs[0].deliveryDetails.SenderName.includes(param.lastName)) {
          res.json({
            results: docs[0].videoGreetings,
            status: true,
            count: docs.length,
          });
        } else {
          res.json({ results: docs, status: false, count: [] });
        }
      });
  } catch (error) {
    console.log(error);
    next();
  }
});

router.post("/stockman/fullfillment", async (req, res, next) => {
  console.log("weocme");
  try {
    var param = req.body;
    var moments = require("moment-timezone");
    var ph = moments().tz("Asia/Singapore");
    var userDate = ph.format("YYYY-MM-DD");
    const lesseeFullfilmentData = param.payload;
    const payloadProduct = param.payload.products;
    const LesseeProducts = db.get("LesseeProduct");
    const LesseeAgent = db.get("LesseeAgent");
    let parentFullFillment = "LesseeFullfilment";
    const LesseeFullfilmentClass = db.get(parentFullFillment);
    const transactionRefence = makeid(6);
    let fullfilmentData = param.payload;
    fullfilmentData.date_created = userDate;
    fullfilmentData.transactionID = transactionRefence;
    const lesseeFullfilmentResult = await LesseeFullfilmentClass.insert(
      lesseeFullfilmentData,
    );
    const lesseeFullfilmentId = lesseeFullfilmentResult;
    let ids = payloadProduct;
    // Update Product Logs and Quantity
    for (const item of ids) {
      const { id, quantity } = item;
      console.log("ohhhh", item);
      await LesseeProducts.update(
        { _id: id },
        {
          $set: { stocks: quantity },
          $push: {
            transactionLogs: {
              transactionID: transactionRefence,
              stockman: param.payload.stockman,
              assigned_to: param.payload.assigned_to,
              type: param.payload.type,
              date_created: userDate,
            },
          },
        },
      );
    }
    // Update Agent Onhand Products
    let agentID = param.payload.assigned_to._id;
    for (const item of payloadProduct) {
      await LesseeAgent.update(
        { _id: agentID },
        {
          $push: {
            onHandProducts: {
              product: item,
              transactionID: transactionRefence,
            },
          },
        },
      );
    }
    let fillid = `${parentFullFillment}.${transactionRefence}`;
    await LesseeAgent.update(
      { _id: agentID },
      {
        $push: {
          agentLogs: {
            fullFillmentID: fillid,
            transactionID: transactionRefence,
            product: param.payload.products,
            action_type: param.payload.type,
            stockman: param.payload.stockman,
          },
        },
      },
    ).then((docs) => {
      res.json({
        transactionID: transactionRefence,
        status: true,
        message: "Fullfilment  has been successfully created",
      });
    });
  } catch (error) {
    console.log("error stockman/fullfillment", error);
    next(error);
  }
});

router.post("/restock/stockman/:type", async (req, res, next) => {
  var moments = require("moment-timezone");
  var ph = moments().tz("Asia/Singapore");
  var userDate = ph.format("YYYY-MM-DD");
  const LesseeProduct = db.get("LesseeProduct");
  const LesseeStockman = db.get("LesseeStockman");
  const transactionID = makeid(6);
  var payload = req.body;
  console.log(payload);
  var type = req.params.type;
  let product = await LesseeProduct.update(
    { _id: payload.payload.productID },
    {
      $inc: { stocks: payload.payload.stocks },
      $push: {
        restockLogs: {
          dateCreated: userDate,
          type: type,
          transactionID: transactionID,
          stockmanID: payload.stockman,
        },
      },
    },
  );

  await LesseeStockman.update(
    { _id: payload.payload.stockman },
    {
      $push: {
        restockLogs: {
          dateCreated: userDate,
          product: product,
          type: type,
          transactionID: transactionID,
          stocks: payload.payload.stocks,
        },
      },
    },
  ).then((docs) => {
    res.json({
      transactionID: transactionID,
      status: true,
      message: "Stock has been successfully updated",
    });
  });
});
//Template
router.post("/product/transfer", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const classType = db.get("Product");
  try {
    const list = await classType
      .findOneAndUpdate({ _id: param._id }, { $set: { type: param.to } })
      .then((docs) => {
        console.log("data", docs);
        res.json({ results: docs, status: true });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// SIGNUP
router.post("/signup", async (req, res, next) => {
  var param = req.body;
  const Signup = db.get("Signup");

  console.log(param);
  try {
    // const list = await Signup.insert(param).then((updatedDoc) => {
    //   res.json({results:updatedDoc});
    // })
    const list = await Signup.insert(param);
    res.json({ results: list });
    var requestOption = {
      method: "POST",
    };
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/deleteProduct", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("LoogyPooling");
  try {
    const list = await classType
      .findOneAndDelete({ _id: param._id })
      .then((updatedDoc) => {
        console.log("has been deleted", updatedDoc);
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/smartSearchV2", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const Products = db.get("Product");
  let query = { $text: { $search: param.value }, storeOwner: param.owner };
  console.log("tra", query);
  try {
    const products = await Products.find(query).then((item) => {
      console.log(item);
      res.json({ results: item });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/smartSearch", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  var quertType = param.filter;
  const Services = db.get("Services");
  const Rental = db.get("Rental");
  const Supplier = db.get("Merchant");
  // rental.createIndex({loc:"2dsphere"});
  var data = {
    country: "PH",
    city: "Cagayan",
    address: "Cagayan",
    loc: {
      type: "Point",
      coordinates: [
        124.64592, //latitude
        8.477217, //longitude
      ],
    },
  };
  var filterNameCoordinates = {
    // [param.by]: {
    //   $regex: param.to,
    //   $options: 'i'
    // },
    // { $text: { $search: "java coffee shop" } },
    $text: { $search: param.to },
    // "loc": {
    //   $near: {
    //     $geometry: {
    //        type: "Point" ,
    //        coordinates:param.coordinates    // <longitude> , <latitude> ]
    //     },   $maxDistance : 100000,$minDistance:1
    //   }
    // }
  };
  var filterCoordinates = {
    // $text: { $search:  param.to },
    [param.by]: {
      $regex: param.to,
      $options: "i",
    },
    loc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: param.coordinates, // <longitude> , <latitude> ]
        },
        $maxDistance: param.maxDistance,
        $minDistance: 1,
        // 15000
      },
    },
  };

  var filterType =
    quertType === "location" ? filterCoordinates : filterNameCoordinates;
  try {
    var results = [];
    var totalItems = 0;
    var nearService = [];
    const insets = await Services.find(filterNameCoordinates, [
      "-loc",
      "-bookings",
      "-_created_at",
      "-_updated_at",
    ]).then((item) => {
      // res.json({results:item,count:item.length,type:quertType});
      var result = {};
      result.name = "Services";
      result.description = "Found items";
      result.items = item;
      result.count = item.length;
      results.push(result);
      // console.log(item)
      totalItems = totalItems + item.length;
    });
    const nearestServices = await Services.find(filterCoordinates, [
      "-loc",
      "-bookings",
      "-_created_at",
      "-_updated_at",
    ]).then((item) => {
      var result = {};
      result.name = "Nearest Services";
      result.description = "You might wanna try";
      result.items = item;
      result.count = item.length;
      results.push(result);
      totalItems = totalItems + item.length;
    });
    const rental = await Rental.find(filterType, [
      "-loc",
      "-bookings",
      "-_created_at",
      "-_updated_at",
    ]).then((item) => {
      var result = {};
      result.name = "For Rental";
      result.items = item;
      result.count = item.length;
      results.push(result);
      totalItems = totalItems + item.length;
    });

    const nearest = await Rental.find(filterCoordinates, [
      "-loc",
      "-bookings",
      "-_created_at",
      "-_updated_at",
    ]).then((item) => {
      var result = {};
      result.name = "Nearest Rental";
      result.description = "You might wanna try";
      result.items = item;
      result.count = item.length;
      results.push(result);
      totalItems = totalItems + item.length;
    });

    // const nearestSupplier = await Supplier.find(filterCoordinates,['-loc','-bookings','-_created_at','-_updated_at']).then( (item)=> {
    //   var result =  {}
    //   result.name = 'Nearest Supplier'
    //   result.description = 'You might wanna try'
    //   result.items = item
    //   result.count = item.length
    //   results.push(result)
    //   totalItems = totalItems + item.length
    // })

    // nearService = [...new Set(list)];

    res.json({ results: results, count: totalItems });
  } catch (error) {
    next(error);
  }
});

router.post("/search/any", async (req, res, next) => {
  var param = req.body;
  const Merchant = db.get("Merchant");
  const Services = db.get("Services");
  const Talent = db.get("Talent");
  const Rental = db.get("Rental");
  var query = {
    [param.by]: {
      $regex: param.to,
      $options: "i", //i: ignore case, m: multiline, etc
    },
  };

  try {
    // Services.createIndex( { serviceName: "text", description: "text" } )
    // await Services.index('serviceName serviceDescription');
    var results = [];
    var totalItems = 0;
    const list = await Merchant.find(query, [
      "_id",
      "name",
      "description",
      "serviceName",
      "serviceDescription",
      "talentOwner",
      "productImageList",
      "discountedPrice",
      "priceStart",
    ]).then((item) => {
      var classNme = {};
      classNme.name = "Merchant";
      classNme.items = item;
      totalItems = totalItems + item.length;
      results.push(classNme);
      console.log(item);
      // res.json({results:item,count:item.length});
    });

    const lists = await Services.find(
      {
        ["serviceName"]: {
          $regex: param.to,
          $options: "i", //i: ignore case, m: multiline, etc
        },
      },
      [
        "_id",
        "description",
        "serviceName",
        "serviceDescription",
        "talentOwner",
        "productImageList",
        "discountedPrice",
        "priceStart",
      ],
    ).then((item) => {
      // sorted by name field

      var classNme = {};
      classNme.name = "Services";
      classNme.items = item;
      results.push(classNme);
      console.log(item);
      totalItems = totalItems + item.length;
      // res.json({results:item,count:item.length});
    });

    const talentLists = await Talent.find(
      {
        ["description"]: {
          $regex: param.to,
          $options: "i", //i: ignore case, m: multiline, etc
        },
      },
      [
        "_id",
        "description",
        "name",
        "serviceDescription",
        "socialMedia",
        "businessName",
        "businessDescription",
        "productImageList",
      ],
    ).then((item) => {
      // sorted by name field

      var classNme = {};
      classNme.name = "Freelancers";
      classNme.items = item;
      results.push(classNme);
      console.log(item);
      totalItems = totalItems + item.length;
      // res.json({results:item,count:item.length});
    });

    const RentalList = await Rental.find(
      {
        ["serviceName"]: {
          $regex: param.to,
          $options: "i", //i: ignore case, m: multiline, etc
        },
      },
      [
        "_id",
        "description",
        "serviceName",
        "serviceDescription",
        "socialMedia",
        "businessName",
        "businessDescription",
        "productImageList",
      ],
    ).then((item) => {
      // sorted by name field

      var classNme = {};
      classNme.name = "Rental";
      classNme.items = item;

      item.length;
      results.push(classNme);
      console.log(item);
      totalItems = totalItems + item.length;
      // res.json({results:item,count:item.length});
    });
    res.json({ results: results, count: totalItems });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/auth", async (req, res, next) => {
  var data = {
    link: "www.dsadsa",
    referenceOrder: "xASA211",
    password: "dsadsa",
  };
  try {
    var token = await jwt.sign(data, "0314-michael-myrell");
    res.json({ results: token });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/validate", async (req, res, next) => {
  try {
    var decoded = jwt.verify(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjUzOTA1OTA0LCJzdWIiOiI5NWUwOWE0ZS0zZjNlLTQ2YTEtYTk3YS1lZjhiMmM5ZDlhODciLCJlbWFpbCI6Im1pY2hhZWxyYWZmaW5wYWN1bGJhQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2o1OGVyNFZHZG15cXpSUndKUFF5YVFBU3lUakZfUlhYaGVzejlDV1c4PXM5Ni1jIiwiZW1haWwiOiJtaWNoYWVscmFmZmlucGFjdWxiYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiTWljaGFlbCBEZXZlbG9wZXIiLCJpc3MiOiJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS91c2VyaW5mby92Mi9tZSIsIm5hbWUiOiJNaWNoYWVsIERldmVsb3BlciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQU9oMTRHajU4ZXI0VkdkbXlxelJSd0pQUXlhUUFTeVRqRl9SWFhoZXN6OUNXVzg9czk2LWMiLCJwcm92aWRlcl9pZCI6IjEwOTY2MDg3NTAwMjc3MDIyNzY5MyIsInN1YiI6IjEwOTY2MDg3NTAwMjc3MDIyNzY5MyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCJ9.RLjy4HCUfWmhB9NiLLxgXYR3LyLL0U51LC9aJyy_2YY",
      "michaelraffinpaculba@gmail.com",
    );
    console.log(decoded); // bar
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/authToken", async (req, res, next) => {
  var token = jwt.sign({ foo: "bar" }, "michaelgwapo", { expiresIn: "1h" });
  res.json({ results: token });
});
router.post("/createAuthToken", async (req, res, next) => {
  var param = req.body;
  console.log("createAuthToken");
  try {
    var token = await jwt.sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 60, data: param.user.id },
      param.email,
    );
    console.log("createAuthToken", token);
    res.json({ authToken: token });
  } catch (err) {
    console.log("createAuthToken err", err);
    next(err);
  }
});

async function generateAuthToken(req, res, next) {
  console.log("createAuthToken");
  var token = jwt.sign({ foo: `bar${Date()}` }, "michaelgwapo");
  res.json({ results: token });
  next();
  return;
}

async function validateTokens(req, res, next) {
  try {
    var param = req.headers["authorization"];
    var jwt = require("jsonwebtoken");

    var items = param.split(" ");
    var token = items[1];
    const params = req.body;
    var id = req.headers["userid"];
    console.log("validateTokens", id);
    next();

    //Invistigate
    // try {
    //   var decoded = await jwt.verify(token, id);
    //     next()
    // } catch(err) {
    //   console.log('err',err)
    //   next(err)
    // }
  } catch {
    next();
  }
}

//DELETE ME
router.post("/validateToken", validateTokens, async (req, res, next) => {
  var request = req.body;
  res.json({ results: request });
});
//
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
router.post("/Qrcode", async (req, res, next) => {
  try {
    var request = req.body;
    var opts = {
      version: 2,
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      width: 250,
      height: 250,
      scale: 2,
      color: {
        dark: "#010599FF",
        light: "#FFBF60FF",
      },
    };
    res.writeHead(200, { "Content-Type": "image/png" });
    console.log(request);
    let imageReturn = await QRCode.toDataURL(
      request.referenceOrder,
      { opts },
      function (err, dataurl) {
        let regex = /^data:.+\/(.+);base64,(.*)$/;
        let matches = dataurl.match(regex);
        let ext = matches[1];
        let data = matches[2];
        // let buf = fs.readFileSync("./public/images/brand.png");

        let buf = new Buffer.from(data, "base64"); // Buffer(data, 'base64');
        res.end(buf); // Send the file data to the browser.
        // return buf
      },
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// router.post('/getMenuItem', async (req, res,next) => {
//   res.json({results:itemCustom,count:'totalItems'});
// })

router.post("/search/find", async (req, res, next) => {
  var param = req.body;
  const classType = db.get(param.with);
  try {
    var query = {
      [param.by]: {
        $regex: param.to,
        $options: "i", //i: ignore case, m: multiline, etc
      },
    };

    const list = await classType
      .find(query, [
        "_id",
        "name",
        "description",
        "serviceName",
        "serviceDescription",
        "talentOwner",
        "productImageList",
        "discountedPrice",
        "priceStart",
      ])
      .then((item) => {
        // sorted by name field
        res.json({ results: item, count: item.length });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/search/filter", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("Services");
  try {
    //Distinc
    // const list = await  classType.distinct('productImageList').then((docs) => {
    //   res.json({results:docs,count:docs.length});
    // })

    const list = await classType
      .find({}, { sort: { priceStart: 1 } })
      .then((item) => {
        // sorted by name field

        res.json({ results: item, others: [] });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// router.post('/upload', async (req, res,next) => {
//   console.log('upload',req); // the uploaded file object
// })

router.post("/Loogy/Matrix", async (req, res, next) => {
  try {
    requestMatrixAPI(req, res, next);
  } catch (error) {
    console.log("Error Matrix API", error);
    next(err);
  }
});

router.post("/Loogy/SMSAuth", async (req, res, next) => {
  var param = req.body;
  try {
    sendSMSAuth(param, res, next);
  } catch (error) {
    console.log("Error Matrix API", error);
    next(err);
  }
});

const sendSMSAuth = async (param, res, next) => {
  try {
    //Find user
    //Checl Authincation log for pending == mobile
    //Pops Auth ID in mobile
    //Else SEND SMS to avoid(Piso)
    const authcode = makeidNumber(6);
    const smsLogger = db.get("AuthicationLog");
    var date = new Date();
    var validTo = new Date().setHours(23, 59, 59, 999);
    var moments = require("moment-timezone");
    var ph = moments().tz("Asia/Singapore");
    var userDate = ph.format("YYYY-MM-DD");
    var details = {
      mobile: param.requestedBy,
      code: authcode,
      dateFrom: date,
      dateTo: validTo,
      date: userDate,
    };

    const list = await smsLogger.findOneAndUpdate(
      { mobile: param.requestedBy },
      { $inc: { attempt: 1 }, $set: { date: userDate } },
    );
    console.log(list);
    if (list === null) {
      const list = await smsLogger.insert(details).then((docs) => {
        const request = require("request-promise");
        var message = ", you've got an order worth of P";
        var payload = {
          from: "PHDelivery",
          to: param.requestedBy,
          message: `[LoogyPH] ${authcode} is your verification code, valid for 24 hours.`,
        };
        sms.sendsms(payload, function (error, result) {
          if (!error) {
            console.log(result);
            res.json({ results: docs, status: true });
          } else {
            res.json({ results: error, status: false });
            console.log(error);
          }
        });
      });
    } else {
      res.json({ results: null, status: true });
      //   sms.sendsms(payload, function(error, result) {
      //     if (!error) {
      //       console.log(result);
      //       res.json({results:null,status:true})
      //     } else {
      //       res.json({results:error,status:false})
      //       console.log(error);
      //     }
      // })
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

router.post("/upload", upload.array("imageFile", 4), async (req, res, next) => {
  console.log("wew");
  var dataObject = {
    host: params.Bucket,
    filename: req.files[0].key,
    link: req.files[0].location,
  };
  res.json({
    results: "success",
    status: true,
    storage: dataObject,
    list: req.files,
  });
  console.log("uploading iste", req.files);
});
async function GetBucket() {
  try {
    await b2.authorize(); // must authorize first
    let response = await b2.getBucket({ bucketName: "looky-products" });
    console.log("items", response);
  } catch (err) {
    console.log("Error getting bucket:", err);
  }
}
router.get("/getImageList", async (req, res, next) => {
  try {
    let auth = await b2.authorize(); // must authorize first
    let upload = await b2.uploadFile({
      uploadUrl: "uploadUrl",
      uploadAuthToken: auth.data.authorizationToken,
      fileName: "fileName",
      contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
      mime: "", // optional mime type, will default to 'b2/x-auto' if not provided
      data: "data", // this is expecting a Buffer, not an encoded string
      hash: "sha1-hash", // optional data hash, will use sha1(data) if not provided
      info: {
        key1: "value",
        key2: "value",
      },
      onUploadProgress: (event) => {},
      // ...common arguments (optional)
    }); // returns promise

    //   let response = await  b2.getBucket({
    //     bucketName: 'looky-products'
    // });

    //   console.log(response)
    // b2.getBucket({ bucketName: 'looky-products' });
    // res.json({results:response,status:  true})
  } catch (err) {
    console.log("Error getting bucket:", err);
    next(err);
  }
});

router.post("/updateReceipt", async (req, res, next) => {
  var param = req.body;
  const oders = db.get("StoreOrders");
  console.log("updateReceipt", param.mobileReference);
  try {
    const list = await oders
      .findOneAndUpdate(
        { orderReference: param.mobileReference },
        {
          $set: {
            receiptImageLink: param.receipt,
            paymentStatus: "FOR VALIDATION",
          },
        },
      )
      .then((docs) => {
        console.log("data", docs);
        res.json({ results: docs, status: true });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/orderTracker", async (req, res, next) => {
  console.log("orderTracker");
  var param = req.body;
  const oders = db.get("LoogyPooling");
  param.mobileReference;
  console.log("reqreqreq", req);
  var query = {};
  query.referenceOrder = param.referenceOrder;
  try {
    const list = await oders
      .find({ referenceOrder: param.referenceOrder })
      .then((docs) => {
        console.log("reqreqreq", docs);
        res.json({ results: docs, status: true, count: docs.length });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
function makeidNumber(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZa0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post("/sendMessage", async (req, res, next) => {
  const idCart = makeid(6);
  var param = req.body;
  console.log(param);
  try {
    var payload = {
      from: "PHDelivery",
      to: param.mobile,
      message: param.message,
    };

    let message = sms.sendsms(payload, function (error, result) {
      if (!error) {
        console.log(result);
        res.json({ results: message });
      } else res.json({ results: error });
      console.log(error);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/notifier", async (req, res, next) => {
  const idCart = makeid(6);
  var param = req.body;
  console.log(param);
  const classType = db.get("StoreOrders");
  try {
    const list = await classType
      .findOneAndUpdate(
        { orderReference: param.referenceID },
        { $set: { orderStatus: param.status } },
      )
      .then((updatedDoc) => {
        var payload = {
          from: "PHDelivery",
          to: updatedDoc.deliveryDetails.Mobile,
          message: `Your order for booking:[${updatedDoc.orderReference}] has been dispatched, please expect delivery with in an hour.`,
        };

        let message = sms.sendsms(payload, function (error, result) {
          if (!error) {
            console.log(result);
            res.json({ results: message, order: updatedDoc });
          } else console.log(error);
        });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

async function promocodeValidator(req, res, next) {
  var param = req.body;
  var storeOwner = param.storeOwner;
  var promoCode = param.promoCode;
  console.log("details", param.storeOwner);
  //SUCCESS
  //  {
  //   message: 'Grate value',
  //   isValid: true,
  //   code: 'success',
  //   current: 19,
  //   promoDetails: { requiredAmount: 4000, discountedPrice: 500 }
  // }
  //

  //INVALID CODE
  //{ message: 'Opps, please try again', rtype: 'invalid', code: false }

  // MAXIMUM
  // { message: 'See you next time', isValid: false, code: 'maximum' }

  console.log("console.log(param.code)", param.code);

  try {
    if (param.code === "") {
      req.promocodeStatus = null;
      console.log("wowww");
      next();
      return;
    }

    const PromoCode = db.get("PromoCode");
    const proms = await PromoCode.find({ storeOwner: param.storeOwner });
    console.log(proms);
    const validator = validation(proms, param.code);
    if (validator.isValid) {
      const list = await PromoCode.findOneAndUpdate(
        { storeOwner: storeOwner, "promos.valid": param.code },
        { $set: { "promos.$.acquiredCustomer": validator.current + 1 } },
      );
      validator.current = validator.current + 1;
      req.promocodeStatus = validator;
      next();
      return;
    } else {
      req.promocodeStatus = validator;

      next();
      return;
    }
  } catch (error) {
    console.log(error);
    req.promocodeStatus = null;
    next();
    return;
  }
}

//MOBILE

router.post("/statistics", async (req, res, next) => {
  try {
    var param = req.body;
    const oders = db.get("LoogyPooling");
    const date = "^\\w+ \\d{1,2}, " + new Date().getFullYear(); //new RegExp('^' + new Date().getFullYear() + '-' + (new Date().getMonth()+1).toString().padStart(2, '0'))
    console.log("date", new Date().getFullYear());
    let usersID = param.userID;
    var userDate = "April 20, 2023";
    // ,"status": param.status
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    console.log("currentMonth", currentMonth);
    let results = await oders.find({
      trips: {
        $elemMatch: {
          selectedDate: {
            $regex:
              "^(January|February|March|April|May|June|July|August|September|October|November|December) [1-9]|[1-2][0-9]|3[0-1], 2023",
            // "$regex": "^\\w+ \\d{1,2}, " + new Date().getFullYear()
          },
        },
      },
      userReference: usersID,
    });

    const selectedTrips = results.map((trip) => {
      return trip.trips.length;
    });
    const tripLoad = results.map((trip) => {
      console.log(moment(trip.trips[0].selectedDate).format("YYYY-MM"));
      return trip.trips[0].selectedDate;
    });

    const tripLoadV2 = results.map((trip) => {
      console.log(moment(trip.trips[0].selectedDate).format("YYYY-MM"));
      return {
        date: moment(trip.trips[0].selectedDate).format("MMMM YYYY"),
        trips: trip.trips.length,
      };
    });
    const monthlyTotals = tripLoadV2.reduce((accumulator, currentValue) => {
      const month = currentValue.date;
      const amount = currentValue.trips;
      if (!accumulator[month]) {
        accumulator[month] = amount;
      } else {
        accumulator[month] += amount;
      }
      return accumulator;
    }, {});

    // let result = await oders.createIndex({ "trips.selectedDate": 1 }, { unique: true })

    // ,
    // {
    //   "trips.selectedDate": 1,
    //   "_id": 0
    // }
    res.json({
      results: {
        trips: selectedTrips,
        tripLoad: tripLoad,
        ew: tripLoadV2,
        loadSumarry: monthlyTotals,
        loadMonthlySummary: Object.keys(monthlyTotals),
        loadNumberSummary: Object.values(monthlyTotals),
      },
      count: results.length,
    });
  } catch (error) {
    console.log("error", error);

    next();
    return;
  }
});

router.post("/placeOrder", promocodeValidator, async (req, res, next) => {
  try {
    const idCart = makeid(6);
    var param = req.body;
    var successDetails = {};
    console.log("placeOrder", param);
    successDetails.orderReference = idCart;
    successDetails.ownerID = param.ownerID;
    successDetails.deliveryDetails = param.deliveryDetails.consigneeDetails;
    successDetails.paymentDetails = param.paymentDetails;
    successDetails.deliverySchedule = param.deliverySchedule;
    successDetails.OrderType = param.OrderType;
    successDetails.totalPrice = param.totalPrice;
    successDetails.cartItems = JSON.stringify(param.cartItems);
    successDetails.videoGreetings = param.videoGreetings;
    successDetails.orderStatus = "ON-HOLD";
    successDetails.paymentStatus = "ON-HOLD";
    successDetails.proofDeliveryLink = [];
    successDetails.source = "MOBILE";
    successDetails.userPushToken = param.userPushToken;
    successDetails.storeOwner = param.storeDetails;
    successDetails.cartTotal = param.cartTotal;
    successDetails.adminFees = param.adminFees;
    successDetails.dateOrdered = Date();
    successDetails.promoCodeDetails = {
      status: req.promocodeStatus,
      code: param.code,
    };
    const oders = db.get("StoreOrders");
    var notifyMichael =
      "Hello Michael! " +
      param.storeDetails.codeName +
      " has an order from MOBILE worth of " +
      param.cartTotal;
    notifyUser(notifyMichael);
    const list = await oders.insert(successDetails);
    var message = ", you've got an order worth of P";
    var payload = {
      from: "PHDelivery",
      to: param.storeDetails.storeContact, //09655481821  storeContact 09178434776 09164990934 param.storeDetails.storeContact, //
      message:
        "Hello " +
        param.storeDetails.codeName +
        message +
        param.cartTotal +
        " with booking reference:  " +
        idCart +
        `. To view please tap this link  ${param.storeDetails.Website}/${idCart}`,
    };
    sms.sendsms(payload, function (error, result) {
      if (!error) {
        console.log(result);
      } else console.log(error);
    });
    res.json({ results: successDetails, items: list });
  } catch (error) {
    console.log(error);
    next(error);
  }

  console.log("processing");
});

router.post("/notification/waitinglist", async (req, res, next) => {
  var param = req.body;
  const waiting = db.get("WaitingList");
  var waitingItem = {};
  waitingItem.item = param.item;
  waitingItem.number = param.mobile;
  waitingItem.timeStamp = Date();
  try {
    const list = await waiting.insert(waitingItem).then((docs) => {
      console.log(docs);
      res.json({ results: docs, result: docs });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/support", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  try {
    var payload = {
      from: "PHDelivery",
      to: param.storeNumber,
      message: param.payload.message,
    };
    sms.sendsms(payload, function (error, result) {
      if (!error) {
        res.json({ results: true });
        console.log(result);
      } else console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
});
router.put("/Order", promocodeValidator, async (req, res, next) => {
  //WEB order place
  const idCart = makeid(6);
  var param = req.body;
  console.log(param);
  var successDetails = {};
  successDetails.orderReference = idCart;
  successDetails.deliveryDetails = param.details; // "ONLINE-ONLY-UNDEFINE" //param.deliveryDetails.consigneeDetails
  successDetails.paymentDetails = param.payment;
  // successDetails.deliverySchedule = param.deliverySchedule
  successDetails.source = "WEBSITE";
  successDetails.OrderType = "ONLINE-ONLY-UNDEFINE";
  successDetails.totalPrice = param.total;
  successDetails.cartItems = JSON.stringify(param.cart);
  successDetails.videoGreetings = "none"; //param.videoGreetings
  successDetails.orderStatus = "ON-HOLD";
  successDetails.paymentStatus = "ON-HOLD";
  successDetails.proofDeliveryLink = [];
  successDetails.resellersID = param.resellersID;
  successDetails.storeDetails = param.storeDetails;
  successDetails.dateOrdered = Date();
  successDetails.promoCodeDetails = {
    status: req.promocodeStatus,
    code: param.code,
  };
  var notifyMichael =
    "Hello Michael! " +
    param.storeCodeName +
    " has an order from WEBSITE worth of " +
    param.total +
    ` code: ${idCart} `;
  // notifyUser(notifyMichael)
  const oders = db.get("StoreOrders");
  try {
    const list = await oders.insert(successDetails);
    // notifyMerchant(param,idCart)
    var message = ", you've got an order worth of P";
    var payload = {
      from: "PHDelivery",
      to: "09164990934", //'param.storeDetails',
      message:
        "Hello " +
        param.storeCodeName +
        message +
        param.total +
        " with booking reference:  " +
        idCart +
        `. To view please tap this link  ${param.storeWebsite}/${idCart}`,
    };
    // sms.sendsms(payload, function(error, result) {
    //   if (!error) {
    //     console.log(result);
    //   } else
    //     console.log(error);
    // });
    res.json({ results: successDetails, items: list });
  } catch (error) {
    console.log(error);
    next(error);
  }

  console.log("processing");
});
router.post("/user/create", async (req, res, next) => {
  let params = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.passwrd,
    });
    let { user } = await supabase.auth.signIn({
      email: params.email,
      password: params.passwrd,
    });

    const profile = await supabase
      .from("profile")
      .update({
        userLevel: {
          userType: params.userType,
          access: [],
        },
      })
      .eq("id", user.id)
      .select();

    console.log(profile);

    res.json({ results: profile, sucess: true, error });
  } catch (error) {
    next(error);
  }
});

router.post("/Loogy/add", async (req, res, next) => {
  var param = req.body;
  console.log("addProduct", param);
  const Store = db.get(param.className);
  try {
    const list = await Store.insert(param.details).then((docs) => {
      console.log("success");
      res.json({ results: docs, sucess: true });
    });
  } catch (error) {
    console.log("error");
    next(error);
  }
});
router.post("/product/add", async (req, res, next) => {
  var param = req.body;
  console.log(param);
  const Store = db.get("Product");
  try {
    const list = await Store.insert(param).then((docs) => {
      res.json({ results: docs, sucess: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//FILTER DATES
router.post("/testDate", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("LoogyPooling");
  try {
    const list = await classType
      .find({ trips: { $elemMatch: { selectedDate: param.date } } })
      .then((item) => {
        res.json({ results: item, counts: item.length });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//NEAREST BOOKING
router.post("/getNearestBooking", async (req, res, next) => {
  //  (
  //   { location: { $geoWithin: { $center: [ [ 6.45306, 3.39583], 10 ] } } }
  // );
  // {"trips": {"$elemMatch": { "returnedDate" :"September 6, 2022"}}
  // ,{"$elemMatch": { "trips.returnedDate" :"September 6, 2022"}}
  // {"trips": {"$elemMatch": { "selectedDate" :"September 30, 2022"}}}
  const oders = db.get("LoogyPooling");
  var param = req.body;
  try {
    console.log("params date", param.queryDate);
    var query = {};
    var geoLocationQuery = {
      [`${param.queryData.fields}`]: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: param.arrivalCoordinates,
            radius: param.queryData.radius,
          },
          $minDistance: 0,
          $maxDistance: param.maxDistance,
        },
      },
    };
    var dateFilterQuery = {};

    query = {
      status: param.queryData.status,
      [`${param.queryData.fields}`]: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: param.arrivalCoordinates,
            radius: param.queryData.radius,
          },
          $minDistance: 0,
          $maxDistance: param.maxDistance,
        },
      },
    };

    let dynamicQUery = param.queryDate;

    //MARK: - Working on Departed date or selectedDate
    //MARK:- This query is not fully dynamic - Trips is static with param queryDate
    //Todo Fully Dynamic query and  Arrival or Departure date query
    let newQueryV2 = {
      trips: param.queryDate,
      [`${param.queryData.fields}`]: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: param.arrivalCoordinates,
            radius: param.queryData.radius,
          },
          $minDistance: 0,
          $maxDistance: param.maxDistance,
        },
      },
      status: param.queryData.status,
    };
    // console.log('newQueryV2',newQueryV2)
    // console.log('dynamicQUery',dynamicQUery)
    let newQuery = { $and: [param.queryDate, geoLocationQuery] };

    let fallbackQuery = geoLocationQuery; // {"$or":[geoLocationQuery,geoLocationQuery]}

    geoLocationQuery.status = "Pending";
    var finalQUery = param.queryDate === undefined ? fallbackQuery : newQueryV2; //newQuery

    //MARK: Query is running  but handler for empty filter is error
    //RUNNING : geoLocationQuery

    //Under testing
    const nearestItemV2 = await oders.find(finalQUery);
    const data = {
      results: nearestItemV2,
      status: true,
      count: nearestItemV2.length,
    };
    res.json({ results: data, count: data.length });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/store/:Item", validateTokens, async (req, res, next) => {
  var param = req.body;
  console.log("EEEE", param);

  var className = req.params.Item;
  const oders = db.get(className);
  var query = {};
  // if (className === 'LoogySettings') {

  //   res.json({results:[
  //     {
  //       "_id": "629868882977690963ff3175",
  //       "serviceList": [
  //           {
  //               "id": 0,
  //               "name": "Wheeler",
  //               "description": "Also called 18-wheelers, big rigs, or tractor-trailers, they are popular fleet trucks that come in many different shapes and sizes.",
  //               "imageUrl": "https://localflowershop.sgp1.digitaloceanspaces.com/product/1654089811592-wheeler.png",
  //               "priceRange": 12000
  //           },
  //           {
  //               "id": 1,
  //               "name": "Wing Van",
  //               "description": "Also called 18-wheelers, big rigs, or tractor-trailers, they are popular fleet trucks that come in many different shapes and sizes.",
  //               "imageUrl": "https://www.foton.com.ph/wp-content/uploads/2021/08/ETX-N-6x4-Wing-Van.png",
  //               "priceRange": 12000
  //           },
  //           {
  //               "id": 21,
  //               "name": "Box trucks",
  //               "description": "Also knows as straight trucks or cube trucks, box trucks are the most popular truck used by fleets. It is a chassis cab truck with an enclosed cuboid-shaped cargo area.",
  //               "imageUrl": "https://img.freepik.com/free-vector/isometric-vehicle_24877-50910.jpg?w=1800&t=st=1654089193~exp=1654089793~hmac=648c8488ccfe43b7ce89566d8f439dbbdcfb95b43ac08fc41db4776a0fece741",
  //               "priceRange": 13000
  //           },
  //           {
  //               "id": 22,
  //               "name": "Refrigerator Trucks",
  //               "description": "These trucks carry perishable goods at specific temperatures. They are equipped with refrigeration systems powered by small displacement diesel engines.",
  //               "imageUrl": "https://localflowershop.sgp1.digitaloceanspaces.com/product/1654089622605-%5Bremoval.ai%5D_tmp-6297677ecaa96.png",
  //               "priceRange": 14000
  //           },
  //           {
  //               "id": 3,
  //               "name": "Dump Trucks",
  //               "description": "Also known as dumper truck or tipper truck, they are used for transporting loose materials such as sand, gravel or demolition waste.",
  //               "imageUrl": "https://sc01.alicdn.com/kf/HTB1jIjbaZfrK1RjSszcq6xGGFXaK/1051512/HTB1jIjbaZfrK1RjSszcq6xGGFXaK.jpg",
  //               "priceRange": 5000
  //           },
  //           {
  //               "id": 5,
  //               "name": "Semi-Trailer Trucks",
  //               "description": "Also called 18-wheelers, big rigs, or tractor-trailers, they are popular fleet trucks that come in many different shapes and sizes.",
  //               "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrwgn9l_tSsrnRbXEmaKRtteX9Y1-nCExuUut14ihWzGBrKQznE-I9creJlsX9zei06-w&usqp=CAU",
  //               "priceRange": 16000
  //           },
  //           {
  //               "id": 6,
  //               "name": "Curb side Trucks",
  //               "description": "Also called 18-wheelers, big rigs, or tractor-trailers, they are popular fleet trucks that come in many different shapes and sizes.",
  //               "imageUrl": "https://img.freepik.com/free-vector/isometric-vehicle_24877-50909.jpg?w=1800&t=st=1654089196~exp=1654089796~hmac=9935bcdc7cb8293992d4ae6fc1be11386928f4d322abbc6c33df1de7b9cf52d8",
  //               "priceRange": 16000
  //           },
  //           {
  //               "id": 7,
  //               "name": "Motor",
  //               "description": "Utilizing motorcycles is one way of keeping your customers happy and satisfied because they’re capable of conducting deliveries in a short time period.",
  //               "imageUrl": "https://localflowershop.sgp1.digitaloceanspaces.com/product/1654089728135-motor.png",
  //               "priceRange": 16000
  //           }
  //       ],
  //       "availableLogin": [
  //           {
  //               "id": 1,
  //               "name": "google",
  //               "status": true
  //           },
  //           {
  //               "id": 2,
  //               "name": "facebook",
  //               "status": true
  //           },
  //           {
  //               "id": 3,
  //               "name": "password",
  //               "status": true
  //           }
  //       ],
  //       "appVersioning": {
  //           "android": 31,
  //           "ios": "0.0.14"
  //       },
  //       "storeSetup": {
  //           "android": "https://play.google.com/store/apps/details?id=com.raffin0000.loogy",
  //           "ios": "https://apps.apple.com/us/app/expo-go/id982107779",
  //           "appForceContent": {
  //               "imageUrl": "https://i.gifer.com/Q4w3.gif",
  //               "title": "It's time to update",
  //               "subtitle": "Update Loogy app and get new exciting features."
  //           }
  //       }
  //   }
  //   ]})
  //   return
  // }
  var identifier = `className:${className}-query:${param.id}-showLimit:${param.showLimit}-number:${param.number}`;
  sort: {
    name: 1;
  }
  const options = { sort: { price: 1 } };
  console.log(param);
  var cache = await redis.get(identifier);
  if (param.queryType === "all") {
  } else if (param.queryType === "specific") {
    query._id = param.id;
  } else if (param.queryType === "filter") {
    query.type = param.id;
  } else if (param.queryType === "load-id") {
    query.referenceOrder = param.id;
  } else if (param.queryType === "user-id") {
    if (param.status != undefined) {
      query.userReference = param.id;
    } else {
      query.status = param.status;
      query.userReference = param.id;
      query = { status: "Pending", userReference: param.id };
    }
  } else if (param.queryType === "custom") {
    query = {};
    console.log("PARAM", param.queryData);
    // query = param.queryData
    query = {
      $or: [
        {
          takerID: param.queryData.userReference,
          status: param.queryData.status,
        },
        param.queryData,
      ],
    };
  } else if (param.queryType === "customV2") {
    query = {};
    query = { $or: param.queryData };
  } else if (param.queryType === "customV3") {
    query = {};
    query = { $and: param.queryData };
    console.log("V3", query);
  }

  console.log("HEYYYE ", param, "NEWQUERY", query);
  // query.user = {"$gte": null}
  try {
    if (cache && param.isAPI === false) {
      let newCache = JSON.parse(cache);
      newCache.source = "CACHE";
      res.json(newCache);
    } else {
      var todayEnd = new Date().setHours(23, 59, 59, 999);
      if (param.showLimit) {
        try {
          // console.log('OHHH')
          // const list = await   oders.find(query, {limit: param.number}).then((docs) => {
          // res.json({results:docs,status:  true,count:docs.length})
          // })
          var Day1 = todayEnd;
          const list = await oders.find(query, {
            limit: param.number,
            sort: { _id: 1 },
          });
          const data = {
            results: list,
            status: true,
            count: list.length,
            source: param.isAPI,
          };
          const setcacher = await redis
            .set(identifier, JSON.stringify(data), "EX", Day1)
            .then((status) => {
              console.log("found", list);
              res.json(data);
            });
          // console.log('API',data)
        } catch (error) {
          console.log(error);
          next(error);
        }
      } else {
        try {
          // const list = await   oders.find(query).then((docs) => {
          // res.json({results:docs,status:  true,count:docs.length,source:'API'})
          // })
          var Day1 = todayEnd;
          const list = await oders.find(query, {
            limit: param.number,
            sort: { _id: 1 },
          });
          const data = {
            results: list,
            status: true,
            count: list.length,
            source: "API",
          };
          const setcacher = await redis.set(
            identifier,
            JSON.stringify(data),
            "EX",
            Day1,
          );
          res.json(data);
          console.log("API");
        } catch (error) {
          console.log(error);
          next(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/details/:type", async (req, res, next) => {
  var param = req.body;
  var className = req.params.type;
  const oders = db.get(className);
  console.log(param);
  try {
    const list = await oders.find({ _id: param.id }).then((docs) => {
      res.json({ results: docs, status: true, count: docs.length });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/store/details", async (req, res, next) => {
  var param = req.body;
  const Store = db.get("Store");

  var options = {};
  options.deliveryFlatrate = {
    flatrate: 90,
    discount: false,
    discountPrice: 0,
  };
  options.paymentOptions = [
    {
      itemName: "Bank Deposit",
      itemDetails: "1923-2392-2932",
      status: true,
      items: [
        {
          itemName: "BPI",
          itemDetails: "1923-2392-2932",
          status: true,
        },
        {
          itemName: "PNB",
          itemDetails: "1923-2392-2932",
          status: true,
        },
      ],
    },
    {
      itemName: "GCASH",
      itemDetails: "09363673900",
      status: true,
    },
    {
      itemName: "Paymaya",
      itemDetails: "09363673900",
      status: true,
    },
    {
      itemName: "Cash on Delivery",
      itemDetails: "",
      status: false,
    },
  ];

  var storeDetails = {
    storeName: "Nidalyn paculba",
    imgUrl: "",
    Address: "Pala-o",
    storeOptions: options,
  };
  try {
    const list = await Store.insert(storeDetails).then((docs) => {
      res.json({ results: storeDetails, items: docs });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// LOOGY
// app.post('/Loogy/load', api);//
router.post("/Loogy/verify/auth/sms", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("AuthicationLog");
  try {
    const pooling = await classType
      .findOneAndUpdate(
        { code: param.code },
        { $set: { attempt: 0, date: null } },
      )
      .then((updatedDoc) => {
        console.log(updatedDoc);
        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/Loogy/modifyLoad", validateTokens, async (req, res, next) => {
  var param = req.body;
  const classType = db.get("LoogyPooling");
  // $set: { orderStatus: param.orderStatus}
  // On-Scheduled
  // In-Transit
  // Cancelled
  console.log("BACK LOAD", param);
  var title = `Load is currently ${param.status}`;
  var logMessage = `Load has been ${param.status}`;
  var subtitle = `You received this email for ${param.status} this load`;
  if (param.status === "Completed") {
    title = `You have completed this load!`;
    subtitle = `You received this email for completing this load`;
  }
  try {
    var logDetails = {
      date: new Date(),
      title: `Load ${param.id}`,
      description: logMessage,
      status: param.status,
      taker: param.taker,
      takerLocation: param.takerLocation,
    };
    const pooling = await classType
      .findOneAndUpdate(
        { referenceOrder: param.id },
        {
          $set: { status: param.status },
          $push: { transactionLogs: logDetails },
        },
      )
      .then((updatedDoc) => {
        // dynamic email here {param.taker.email}
        // console.log('success',updatedDoc)

        console.log("USER NUMBER", updatedDoc.user.user_details.contactNumber);
        var smsMessage = `Hi! ${logMessage} for ${param.id}`;
        // var payload = {
        //   from: 'PHDelivery',
        //   to: updatedDoc.user.user_details.contactNumber,
        //   message: logMessage
        // };
        // sms.sendsms(payload, function(error, result) {
        //   if (!error) {
        //     console.log(result);
        //   } else
        //     console.log(error);
        // });
        updateLoadItinerary(updatedDoc, title, subtitle); //OLD generateItineraryOrder(updatedDoc,title,subtitle)

        //NOTIFICATION
        // var notifyMichael = 'Hello Michael! ' +  param.storeDetails.codeName +' has an order from MOBILE worth of ' + param.cartTotal
        // notifyUser(notifyMichael)

        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/Loogy/load", validateTokens, async (req, res, next) => {
  var param = req.body;
  const classType = db.get("LoogyPooling");
  // $set: { orderStatus: param.orderStatus}
  // On-Scheduled
  // In-Transit
  // Cancelled
  console.log("BACK LOAD", param);
  try {
    var logDetails = {
      date: new Date(),
      title: `Load ${param._id}`,
      status: "Acquired",
      description: "Load has been Acquired",
      taker: param.taker.user,
      takerLocation: param.taker.takerLocation,
    };
    const pooling = await classType
      .findOneAndUpdate(
        { referenceOrder: param._id },
        {
          $set: {
            status: param.status,
            driverProfile: param.taker,
            otherDetails: param.notes,
            takerID: param.taker.userID,
          },
          $push: { transactionLogs: logDetails },
        },
      )
      .then((updatedDoc) => {
        // dynamic email here {param.taker.email}
        updateLoadItinerary(
          updatedDoc,
          "Load has been acquired",
          "You received this email for acquiring this load",
        );
        //OLD generateItineraryOrder(updatedDoc,'Load has been acquired','You received this email for acquiring this load')

        res.json({ results: updatedDoc });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/item/details", async (req, res, next) => {
  var param = req.body;
  const classType = db.get("Services");
  var lists = Math.floor(Math.random() * 2) + 1;
  try {
    const list = await classType
      .find({ talentOwner: "Uccx2IOSi5" }, "-bigdata", [
        "_id",
        "name",
        "description",
        "serviceName",
        "serviceDescription",
        "talentOwner",
        "productImageList",
        "discountedPrice",
        "priceStart",
      ])
      .then((docs) => {
        console.log("list", list);
        res.json({ results: docs[lists], count: docs.length });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/record/delete/:type", async (req, res, next) => {
  console.log("WELCOME");
  try {
    var param = req.body;
    const classType = db.get(param.type);
    const list = await classType.remove({ groupID: param.groupID });
    res.json({ results: list, status: true });
  } catch (error) {
    next(error);
  }
});

router.post("/search/item", async (req, res, next) => {
  var param = req.body;
  const classType = db.get(param.type);
  try {
    // ', '-privilege', '-username','-role','-categoryDetails'
    // ,['serviceName','description']

    const list = await classType
      .find(
        {
          $text: { $search: param.query },
        },
        [
          "_id",
          "name",
          "description",
          "serviceName",
          "serviceDescription",
          "talentOwner",
          "productImageList",
          "discountedPrice",
          "priceStart",
        ],
      )
      .then((docs) => {
        res.json({ results: docs, others: [] });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/search/item/category", async (req, res, next) => {
  var param = req.body;
  const classType = db.get(param.type);
  const lower = param.query.toLowerCase();
  const query = { search: capitalizeFirstLetter(lower) };
  console.log();
  try {
    // ', '-privilege', '-username','-role','-categoryDetails'
    // ,['serviceName','description']
    // talentOwner": "QEOZibFiAQ",
    const list = await classType
      .find({ itemCategory: "Cake" }, [
        "-rateTypeDetails",
        "-_created_at",
        "-_updated_at",
        "-talentOwner",
        "-bookings",
        "-discountedDetailed",
      ])
      .then((docs) => {
        res.json({ results: docs, others: [] });
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

function validation(item, code) {
  var response = {};
  console.log("to investigate", item);
  var promoDetails = item[0].promos.filter((promo) => promo.valid === code);
  if (promoDetails.length === 0) {
    response = {
      message: `${code} is invalid please try again.`,
      rtype: "invalid",
      code: false,
      isValid: false,
    };
    return response;
  } else {
    var from = promoDetails[0].dateFrom;
    var to = promoDetails[0].dateTo;
    var store = promoDetails[0];
    console.log(promoDetails[0]);
    var userDate = moment().format("YYYY-MM-DD");
    var isOpen = moment(userDate).isSameOrAfter(from);
    var isClosed = moment(userDate).isSameOrBefore(to);
    console.log(`Open in ${from}`, isOpen);
    console.log(`Expired ${to} `, isClosed);
    var candidate = store.acquiredCustomer + 1;

    if (isOpen && isClosed) {
      if (store.maxLimit >= candidate) {
        if (store.valid === code) {
          response = {
            message: "Grate value",
            isValid: true,
            code: "success",
            current: store.acquiredCustomer,
            promoDetails: store.discountedItems,
          };
          return response;
        } else {
          response = {
            message: "Opps, try again.",
            isValid: false,
            code: "notFound",
          };
          return response;
        }
      } else {
        // REACH MAXIMUM
        response = {
          message: "See you next time",
          isValid: false,
          code: "maximum",
        };
        return response;
      }
    } else {
      // STORE MIGHT NOT FOUND OR TO LATE, TO EARLY
      response = {
        message: "Promo code is not applicable.",
        rtype: "not-available",
        isValid: false,
        code: "not-available",
      };
      return response;
    }
  }
}

router.post("/validate/:type", async (req, res, next) => {
  var param = req.body;
  var className = req.params.type;
  const classType = db.get(className);
  try {
    const list = await classType
      .find({ storeOwner: param.storeOwner })
      .then((item) => {
        if (item.length !== 0) {
          const validator = validation(item, param.code);
          res.json({
            promoCode: param.code,
            result: validator,
          });
        } else {
          res.json({
            promoCode: param.code,
            result: {
              message: `${param.code} is invalid`,
              rtype: "invalid",
              code: false,
            },
          });
        }
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.post("/user/fetchProfileByEmail", async (req, res, next) => {
  try {
    var param = req.body;
    let { data: users, error } = await supabase.from("users").select("*");
    res.json({ users, status: true, error });
    // console.log('param',param)
    // let { data: profile, error } = await supabase
    // .from('profile')
    // .select("*")
    // .eq('id',param.id)
    // console.log('found',profile)
    // if (profile != null){
    // res.json({result:profile[0],status:true});
    // }else {

    // res.json({result:profile,status:false,message:'Users not found'});
    // }
  } catch (error) {
    next(error);
  }
});
router.post("/user/fetchProfile", async (req, res, next) => {
  console.log("user/fetchProfile", param);
  try {
    var param = req.body;
    console.log("param", param);
    let { data: profile, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", param.id);
    console.log("found", profile);
    if (profile != null) {
      res.json({ result: profile[0], status: true });
    } else {
      res.json({ result: profile, status: false, message: "Users not found" });
    }
  } catch (error) {
    next(error);
  }
});
router.post("/user/DeleteAccount", async (req, res, next) => {
  try {
    var params = req.body;
    console.log(params.id);
    //PROFILE
    //RECORD
    const { data, error } = await supabase
      .from("profile")
      .delete()
      .match({ id: params.id });

    return res.json({
      data: data,
      id: params.id,
      message: error,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/user/Loogy/signout", async (req, res, next) => {
  try {
    var params = req.body;
    console.log(params.email);
    let { user, error } = await supabase.auth.signOut({ email: params.email });
    return res.json({
      data: user,
      email: params.email,
      message: error,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/user/Loogy/updateUser", async (req, res, next) => {
  try {
    var params = req.body;
    // let { user, error }  =  await supabase.auth.update(
    //   {email:params.email},{
    //   data: { hello: 'world' ,warehouse:'dsadsa',mobileNumber:'',profileImage:''}
    // })
    const { data, error } = await supabase
      .from("users")
      .update({
        data: {
          hello: "world",
          warehouse: "dsadsa",
          mobileNumber: "",
          profileImage: "",
        },
      })
      .eq("id", "e5a5b247-5728-4f98-b415-2d5e57353183");

    //     const { data, error } = await supabase
    // .from('Member')
    // .select()
    return res.json({
      data: data,
      email: params.email,
      message: error,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/user/Loogy/update_profile", async (req, res, next) => {
  try {
    var params = req.body;
    console.log("PROFILE", params);
    var data = {
      warehouse: params.warehouse,
      user_details: params.user_details,
    };
    if (params.otherDetails != undefined) {
      data = {
        warehouse: params.warehouse,
        user_details: params.user_details,
        userType: params.user_details.otherDetails.applicantDetails,
      };
    }
    console.log("data", data);

    let { error } = await supabase
      .from("profile")
      .update(data)
      .eq("id", params.id);
    console.log("PRofile has been updated", error);
    return res.json({ tatus: true });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
});
router.post("/user/Loogy/profile", async (req, res, next) => {
  try {
    var params = req.body;
    console.log("PROFILE", params);
    let { data: profile, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", params.id);
    console.log("profile", profile);
    return res.json({ data: profile, status: true });
  } catch (error) {
    console.log("error", error);
    next(error);
  }
});

router.post("/user/Loogy/newPassword", async (req, res, next) => {
  try {
    var params = req.body;

    let { user, error } = await supabase.auth.update({
      email: params.email,
      password: "password$#11",
      data: { hello: "world" },
    });
    console.log("xxxxx", user);
    return res.json({
      data: user,
      email: params.email,
      message: error,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/user/Loogy/resetp", async (req, res, next) => {
  try {
    var params = req.body;
    console.log(params.email);
    let { user, error } = await supabase.auth.api.resetPasswordForEmail(
      params.email,
    );
    return res.json({
      data: user,
      email: params.email,
      message: error,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/validate/userAuth/token", async (req, res, next) => {
  try {
    var params = req.body;
    let { user, error } = await supabase.auth.signIn({
      email: params.email,
      password: params.password,
    });
    res.json({
      data: user,
      message: error,
    });
  } catch (error) {
    next(error);
  }
});

//LOGIN
router.post("/signin/Loogy", async (req, res, next) => {
  try {
    var params = req.body;
    console.log(params);
    // sbp_347174377737cd615a21c045df09e6bb08322035

    var params = req.body;
    let { user, error } = await supabase.auth.signIn({
      email: params.email,
      password: params.password,
    });
    let tokens = jwt.sign(user, user.email, { expiresIn: "1h" });
    user.authToken = tokens;
    res.json({
      data: user,
      message: error,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
var client = new RPCClient({
  accessKeyId: "LTAI5t81rwcLQuttQkrBCBiw",
  secretAccessKey: "0ZNGEpKHbDrkKkPXsQmnLNReKI4K52",
  endpoint: "https://dysmsapi.ap-southeast-1.aliyuncs.com",
  apiVersion: "2018-05-01",
});

//  const resolveInX = (x) => () => new Promise((resolve) => {
//   setTimeout(() => {
//       resolve(x)
//   }, x)
// })

//Registration

async function userSigninUp(req, res, next) {
  try {
    var params = req.body;
    const { user, session, error } = await supabase.auth.signUp(
      {
        email: params.email,
        password: params.password,
      },
      {
        data: params.data,
      },
    );
    console.log(params.data);
    if (error != null) {
      console.log(error);
      req.state = "ERROR";
      res.status(402).json({ status: false, message: error, status: false });
      // next(error)
    } else {
      req.state = "SUCCESS";
      req.promocodeStatus = user;
      next();
    }
  } catch (error) {
    console.log(error);
    req.promocodeStatus = null;
    next(error);
    return;
  }
}
router.post(
  "/signup/Loogy",
  userSigninUp,
  generateSignupWelcome,
  async (req, res, next) => {
    try {
      const idCart = makeid(5);
      var mobileParam = {
        RegionId: "ap-southeast-1",
        To: "639363673900",
        Message: `Your Loogy verification code is ${idCart}`,
        From: "LOOGYPH",
      };
      var params = req.body;
      var requestOption = {
        method: "POST",
      };
      // const mobile = await client.request('SendMessageToGlobe', mobileParam, requestOption)
      res.json({
        status: true,
        user: true,
        showOTP: false,
        message: req.promocodeStatus,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
);

router.post("/user/account/delete", async (req, res, next) => {
  //   const { data, error } = await supabase.auth.admin.deleteUser(
  //     '715ed5db-f090-4b8c-a067-640ecsee36aa0'
  //   )
  //   console.log(data)
  //  if (error == null) {
  //   res.json({result:data,count:0,status:false});
  //  }
});
router.post("/signup/authService", async (req, res, next) => {
  var params = req.body;
  console.log("signup/authService", params);
  try {
    const { data, error } = await supabase
      .from("profile")
      .select(params.objectKeys)
      .eq("id", params.id);
    console.log("response", data);
    if (data != null) {
      console.log("signup/authService response", data);
      res.json({ result: data[0], count: data.length, status: true });
    } else {
      res.json({ result: data, count: 0, status: false });
    }
  } catch (error) {
    console.log;
    next(error);
  }
});
router.use("/emojis", emojis);
module.exports = router;

// var querys = {};
// querys[param.by] = param.to;

//Practice
//    const xxx  =  await  Rental.aggregate([
// {$match:{}},
// {$group:{_id:"$talentOwner"}}
//     ]).then( (item)=> {
//       res.json({results:item,count:item.length});
//     })

// await Rental.createIndex({loc:"2dsphere"});
//   const insets = await Rental.find( {
//     [param.by]: {
//       $regex: param.to,
//       $options: 'i' //i: ignore case, m: multiline, etc
//     },
//     "loc": {
//       $near: {
//         $geometry: {
//            type: "Point" ,
//            coordinates:param.coordinates    // <longitude> , <latitude> ]
//         },   $maxDistance : 100000,$minDistance:1
//       }
//     }
//  },['-loc','-bookings','-_created_at','-_updated_at']).then( (item)=> {
//     res.json({results:item,count:item.length});
//   })

//   const insets = await Rental.index('location 2dsphere').then( (item)=> {
//     res.json({results:item,count:item.length});
//   })

// const insets = await Rental.insert(data).then( (item)=> {
//   res.json({results:item,count:item.length});
// })

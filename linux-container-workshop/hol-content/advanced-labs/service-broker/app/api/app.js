require("dotenv").config();
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var async = require("async");
const mongoose = require("mongoose");

var MONGODB_HOST = process.env.MONGODB_HOST;
var MONGODB_PORT = process.env.MONGODB_PORT;
var MONGODB_USERNAME = process.env.MONGODB_USERNAME;
var MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
var MONGODB_DBNAME = process.env.MONGODB_DBNAME;

var URI = "mongodb://"+ MONGODB_USERNAME + ":" + MONGODB_PASSWORD + "@" + MONGODB_HOST + ":" + MONGODB_PORT + "/" + MONGODB_DBNAME + "?ssl=true&replicaSet=globalDb";

var Schema = mongoose.Schema,
  ObjectId = mongoose.Types.ObjectId;

var app = express();

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require("./models/mongo/hero");
require("./models/mongo/rate");
require("./models/mongo/site");

var Rate = mongoose.model("Rate");
var Hero = mongoose.model("Hero");
var Site = mongoose.model("Site");

var connectOptions = {
  useMongoClient: true,
  autoIndex: false
};

mongoose.Promise = require("bluebird");

const reconnectTimeout = 10000; // ms.

function connect() {
  mongoose.connect(process.env.MONGODB_URI, connectOptions).catch(() => {});
}

const db = mongoose.connection;

db.on("connecting", () => {
  console.info(`connecting to DB..`);
});

db.on("error", error => {
  console.error(`connection error: ${error}`);
  mongoose.disconnect();
});

db.on("connected", () => {
  console.info(`connected to DB!`);
  var heroes;
  var newHeroes;

  async.waterfall(
    [
      function(cb) {
        Hero.count({})
          .then(function(total) {
            console.log("Heroes present: ", total);
            if (total === 0) {
              heroes = fs.readFileSync("./data/heroes.json", "utf8");
              newHeroes = JSON.parse(
                heroes,
                (key, value) =>
                  key === "_id"
                    ? mongoose.Types.ObjectId.createFromHexString(value)
                    : value
              );
              Hero.create(newHeroes)
                .then(function(docs) {
                  console.log("Inserted Heroes Count: ", docs.length);
                  return null;
                })
                .catch(function(err) {
                  console.log("Error creating heroes: ", err);
                })
                .finally(function() {
                  return null;
                });
            }
            return null;
          })
          .catch(function(err) {
            console.log(err);
          })
          .finally(function() {
            cb(null);
          });
      },
      function(cb) {
        Site.count({})
          .then(function(total) {
            console.log("Sites present: ", total);
            if (total === 0) {
              var sites = fs.readFileSync("./data/sites.json", "utf8");
              var newSites = JSON.parse(sites);
              Site.create(newSites)
                .then(function(docs) {
                  console.log("Inserted Sites Count: ", docs.length);
                  return null;
                })
                .catch(function(err) {
                  console.log("Error creating sites: ", err);
                })
                .finally(function() {
                  return null;
                });
            }
            return null;
          })
          .catch(function(err) {
            console.log(err);
          })
          .finally(function() {
            cb(null);
          });
      },
      function(cb) {
        Rate.count({})
          .then(function(total) {
            console.log("Ratings present: ", total);
            if (total === 0) {
              var ratingDocs = [];
              async.each(newHeroes, function(hero, writecb) {
                for (var i = 0; i < 21; i++) {
                  var newRating = new Rate({
                    rating: Math.floor(Math.random() * 5) + 1,
                    raterIp: "8.8.4.4",
                    heroRated: hero._id
                  });
                  ratingDocs.push(newRating);
                  if (i === 20) {
                    Rate.create(ratingDocs)
                      .then(function(docs) {
                        console.log("Inserted Ratings Count: ", docs.length);
                        return null;
                      })
                      .catch(function(err) {
                        console.log("Error creating ratings: ", err);
                      })
                      .finally(function() {
                        writecb();
                      });
                  }
                }
              });
            }
            return null;
          })
          .catch(function(err) {
            console.log(err);
          })
          .finally(function() {
            return null;
            cb(null);
          });
      }
    ],
    function(err, result) {
      console.log("data import and checks complete");
    }
  );
});

db.once("open", () => {
  console.info(`connection opened!`);
});

db.on("reconnected", () => {
  console.info(`db reconnected!`);
});

db.on("disconnected", () => {
  console.error(
    `db disconnected! reconnecting in ${reconnectTimeout / 1000}s...`
  );
  setTimeout(() => connect(), reconnectTimeout);
});

connect();

// mongoose.connect(process.env.MONGODB_URI, connectOptions, function(error){
//   if(!error){
//     console.dir('CONNECTED TO ' + process.env.MONGODB_URI);
//   }
// });

var mongo = require("./routes/mongo");
var index = require("./routes/index");

app.use("/", index);
app.use("/api", mongo);

app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

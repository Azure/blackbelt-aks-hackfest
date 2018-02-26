var express = require("express");
var async = require("async");
var router = express.Router();
var jsonResponse = require("../models/jsonResponse");
var mongoose = require("mongoose");
var Rate = mongoose.model("Rate");
var Hero = mongoose.model("Hero");
var Site = mongoose.model("Site");

/* Default GET JSON for Mongo API */
router.get("/", function(req, res, next) {
  var response = new jsonResponse("Default /api endpoint for mongo", 200, []);
  res.json(response).status(response.status);
});

/* Get all heroes */
router.get("/heroes", function(req, res, next) {
  Hero.find({})
    .then(function(heroes) {
      var response = new jsonResponse("ok", 200, heroes);
      res.json(response).status(response.status);
    })
    .catch(next);
});

/* GET rated heroes */
// router.get("/heroes/rated", function(req, res, next) {
//   Rate.aggregate([
//     { $group: { _id: "$heroRated", AvgRating: { $avg: "$rating" } } },
//     {
//       $lookup: {
//         from: "heroes",
//         localField: "_id",
//         foreignField: "_id",
//         as: "Hero"
//       }
//     },
//     {
//       $replaceRoot: {
//         newRoot: { $mergeObjects: [{ $arrayElemAt: ["$Hero", 0] }, "$$ROOT"] }
//       }
//     },
//     { $project: { Hero: 0 } },
//     { $sort: { AvgRating: -1 } }
//   ])
//     .then(function(heroes) {
//       var response = new jsonResponse("ok", 200, heroes);
//       res.json(response).status(response.status);
//     })
//     .catch(next);
// });

/* GET rated heroes */
router.get("/heroes/rated", function(req, res, next) {
  var heroes = {};
  async.waterfall(
    [
      function(cb) {
        Hero.find({}).then(results => {
          for (i = 0; i < results.length; i++) {
            heroes[results[i]._id] = { 'name': results[i].name, 'img': results[i].img };
            if (i === results.length - 1) {
              cb(null, heroes);
            }
          }
        });
      },
      function(heroes, cb) {
        Rate.aggregate([
          {
            $group: {
              _id: "$heroRated",
              stars: { $sum: "$rating" },
              votes: { $sum: 1 }
            }
          },
          { $sort: { stars: -1 } }
        ])
          .then(ratings => {
            cb(null, ratings, heroes);
          })
          .catch(next);
      }
    ],
    function(err, ratings, heroes) {
      var output = [];
      for (i = 0; i < ratings.length; i++) {
        var result = {};
        result.name = heroes[ratings[i]._id].name;
        result.img = heroes[ratings[i]._id].img;
        result.stars = ratings[i].stars;
        result.votes = ratings[i].votes;
        result.average = ratings[i].stars / ratings[i].votes;
        result.halfstar = Math.round((ratings[i].stars / ratings[i].votes)*2)/2;
        output.push(result);
        if (i === ratings.length - 1) {
          var response = new jsonResponse("ok", 200, output);
          res.json(response).status(response.status);
        }
      }
    }
  );
});

/* GET site info by short code */
router.get("/sites/:code", function(req, res, next) {
  Site.findOne({ shortCode: req.params.code })
    .then(function(site) {
      var response = new jsonResponse("ok", 200, site);
      res.json(response).status(response.status);
    })
    .catch(next);
});

/* POST create single hero doc */
router.post("/hero", function(req, res, next) {
  var hero = new Hero(req.body);
  hero
    .save()
    .then(function(hero) {
      var response = new jsonResponse("ok", 200, hero);
      res.json(response).status(response.status);
    })
    .catch(next);
});

/* POST rating array */
router.post("/rate", function(req, res, next) {
  var input = req.body;
  var ratings = [];
  var ip = input.userIp;
  for (var i = 0, len = input.ratings.length; i < len; i++) {
    var rate = new Rate({
      rating: input.ratings[i].rating,
      raterIp: ip,
      heroRated: input.ratings[i].id
    });
    rate.save().then(function(rate) {
      ratings.push(rate);
    });
  }
  var response = new jsonResponse("ok", 200, ratings);
  res.json(response).status(response.status);
});

module.exports = router;

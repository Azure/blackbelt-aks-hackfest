var express = require('express');
var router = express.Router();
var jsonResponse = require('../models/jsonResponse');
var mongoose = require('mongoose');
var Rate = mongoose.model('Rate');
var Hero = mongoose.model('Hero');

/* Default GET JSON for Mongo API */
router.get('/', function(req, res, next) {
  var response = new jsonResponse("Default /api endpoint for mongo", 200, []);
  res.json(response).status(response.status);
});

/* GET All Heroes*/
router.get('/heroes/rated', function(req, res, next) {
  Rate.aggregate(
  [
  {
    $group: {
      _id: '$heroRated', 
      AvgRating: { $avg: '$rating' }
    }
  },
  {
    $lookup: {
        "from": 'heroes', 
        "localField": '_id', 
        "foreignField": '_id', 
        "as": 'Hero' 
    }
  }], 
  function(err, results){
    if(err) {
      console.log(err);
      next(err);
    }
    else {
      res.json(results);
    }
  });
});


/* Get Heroes */
// db.ratings.aggregate([{$group: {_id: "$heroRated", count: { $avg: "$rating" } }}])

router.get('/heroes', function(req, res, next) {
  Hero.find({}).then(function(heroes){
    var response = new jsonResponse('ok', 200, heroes);
    res.json(response).status(response.status);
  }).catch(next);
});




/* POST create single hero doc */
router.post('/hero', function(req, res, next){
  var hero = new Hero(req.body);
  console.log(req.body);
  hero.save().then(function(hero){
    var response = new jsonResponse('ok', 200, hero);
    res.json(response).status(response.status);
  }).catch(next);
});

/* POST rating array */
router.post('/rate', function(req, res, next){
  var input = req.body;
  console.log(input);
  var ratings = [];
  var ip = input.userIp;
  for (var i = 0, len = input.ratings.length; i < len; i++) {
    var rate = new Rate({
      rating:input.ratings[i].rating,
      raterIp:ip,
      heroRated:input.ratings[i].id
    });
    rate.save().then(function(rate){
      ratings.push(rate);
    });
  }
  var response = new jsonResponse('ok', 200, ratings);
  res.json(response).status(response.status);
});

module.exports = router;

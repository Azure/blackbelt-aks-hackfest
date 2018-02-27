var mongoose = require('mongoose');
var Hero = mongoose.model('Hero');

var rateSchema = new mongoose.Schema({
    rating: { type: Number, min: 0, max: 5, default: 0 },
    timestamp: { type: Date, default: Date.now },
    raterIp: String,
    heroRated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hero' }]
});

mongoose.model('Rate', rateSchema, 'ratings');
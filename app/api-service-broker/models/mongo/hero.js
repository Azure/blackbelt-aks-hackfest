
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var heroSchema = new Schema({
    uid: Number,
    name: String,
    img: String,
    description: String,
    aliases: String
});

mongoose.model('Hero', heroSchema, 'heroes');
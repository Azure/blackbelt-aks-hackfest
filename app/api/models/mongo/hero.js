var mongoose = require('mongoose');

var heroSchema = new mongoose.Schema({
    uid: Number,
    name: String,
    img: String,
    description: String,
    aliases: String
});

mongoose.model('Hero', heroSchema, 'heroes');
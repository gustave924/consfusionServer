const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = Schema({
    firstName:{
        type: String,
        default: ''
    },
    lastName:{
        type: String,
        default: ''
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", User);
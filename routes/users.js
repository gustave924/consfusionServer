var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const url = "mongodb://127.0.0.1:27017/conFusion"
const connection = mongoose.connect(url)
router.use(bodyParser.json())


connection
    .then((db) => {
        console.log("connected successfully");
    })
    .catch((err) =>{
        console.log(err)
    });


router.post("/signup", (req, res, next) => {
    User.findOne({username: req.body.username})
        .then((user) => {
            
            if(user != null){
                err = new Error('Username already exist');
                err.status = 403;
                next(err)
            }else{
                return User.create({
                    username: req.body.username,
                    password: req.body.password
                });
            }
        })
        .then((user) => {
            console.log(user)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({status: 'Registration Successful!', user: user});
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {

    if(!req.session.user){
        var authHeader = req.headers.authorization;
    
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
    
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var username = auth[0];
        var password = auth[1];
        console.log(username)
        User.findOne({username: username})
        .then((user) => {
            console.log(user)
            if(user == null){
                err = new Error("Invalid Username");
                res.setHeader('WWW-Authenticate' ,'Basic');
                err.status = 401;
                return next(err);
            }else if(user.password !== password){
                err = new Error("Invalid password");
                err.status = 401;
                return next(err);
            }else if (user.username === username && user.password === password) {
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }

        })
        .catch(err => next(err))

    }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
});


router.get("/logout", (req, res, next) => {
    if(req.session){
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect("/");
    }else{
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

module.exports = router;

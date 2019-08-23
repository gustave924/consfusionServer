var express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

var router = express.Router();
const User = require('../models/user');
const authenticate = require("../authenticate");

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
    
    
    User.register(new User({username: req.body.username}),
        req.body.password, (err, user) =>{
            if(err){
                res.statusCode = 500;
                res.setHeader('Content-Type', "application/json");
                res.json({err: err});
            }else{
                if(req.body.firstname){
                    user.firstName = req.body.firstname;
                }
                    
                if(req.body.lastname){
                    user.lastName = req.body.lastname;
                }
                

                user.save((err, user) => {
                    if(err){
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err});
                        return ;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Registration Successful!'});
                    });
                })
                
            }
        }
    )


});

router.post("/login", passport.authenticate('local'),(req, res) => {
    
    const token = authenticate.getToken({_id: req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});

});

router.get("", authenticate.verifyUser, authenticate.verifyAdmin, (rew, res) =>{
    User.find({})
        .then((users) =>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(users);
        })
})

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

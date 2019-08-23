const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const leaders = require('../models/leaders');
const authenticate = require("../authenticate");

const url = "mongodb://127.0.0.1:27017/conFusion"
const connection = mongoose.connect(url)

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

connection
    .then((db) => {
        console.log("connected successfully");
    })
    .catch((err) =>{
        console.log(err)
    });

leadersRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
})
.get((req, res, next) => {
    leaders.find({})
        .then((leaders) => {
            res.json(leaders);
        },(err) =>  next(err))
        .catch((err) => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.create(req.body)
        .then((leader) => {
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err))
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end(`Operation not supported on /leaders`);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.remove({})
        .then((resp) => {
            res.json(resp)
        }, err => next(err))
        .catch(err => next(err))
})

leadersRouter.route("/:leaderId")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    next();
})
.get((req, res, next) => {
    leaders.findById(req.params.leaderId)
        .then((leader) =>{
            res.json(leader)
        }, err => next(err))
        .catch(err => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res,  next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("Operation not supported")
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
        .then(leader => {
            res.json(leader);
        }, err => next(err))
        .catch(err => next(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
   leaders.findByIdAndRemove(req.params.leaderId)
    .then(resp => {
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err))
})


module.exports = leadersRouter
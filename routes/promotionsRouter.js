const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const promotions = require("../models/promotions");
const authenticate = require("../authenticate");
const cors = require("./cors")

const url = "mongodb://127.0.0.1:27017/conFusion"
const connection = mongoose.connect(url);

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

connection
.then((db)=>{
    console.log("connected successfully.");
})
.catch((err)=>{
    console.log(err)
})

promotionsRouter.route("/")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next();
})
.get(cors.cors, (req, res, next) => {
    //res.end("We will get you all the promotions");
    promotions.find({})
        .then((dishes) => {
            res.json(dishes)
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //res.end(`we will add the promotions with name = ${req.body.name} and description = ${req.body.description}`);
    promotions.create(req.body)
        .then((promotion) =>{
            res.json(promotion)
        }, (err) => next(err))
        .catch((err) => next(err))

})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type","text/plain");
    res.end("Operation not supported ");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //res.end("We will delete all promotions");
    promotions.remove({})
        .then((promotions)=>{
            res.json(promotions)
        }, (err) => next(err))
        .catch((err) => next(err))
});

promotionsRouter.route("/:promotionId")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next();
})
.get(cors.cors, (req, res, next) => {
    promotions.findById(req.params.promotionId)
        .then((promotion) => {
            res.json(promotion)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type","text/plain");
    res.end(`Operation not supported on /promotions/${req.params.promotionId}`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   /* res.end(`We will update the promotion with id = ${req.params.promotionId} to have a name = ${req.body.name} 
    and description = ${req.body.description}`);*/

    promotions.findByIdAndUpdate(req.params.promotionId,{$set:req.body},{new: true})
        .then((promotion) => {
            res.json(promotion)
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    //res.end(`We will delete the promotion with id = ${req.params.promotionId}`);
    promotions.findByIdAndRemove(req.params.promotionId)
        .then((resp)=>{
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})


module.exports = promotionsRouter


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const promotions = require("../models/promotions");

const url = "mongodb://127.0.0.1:27017/consFusion"
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
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next();
})
.get((req, res, next) => {
    //res.end("We will get you all the promotions");
    promotions.find({})
        .then((dishes) => {
            res.json(dishes)
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post((req, res, next) => {
    //res.end(`we will add the promotions with name = ${req.body.name} and description = ${req.body.description}`);
    promotions.create(req.body)
        .then((promotion) =>{
            res.json(promotion)
        }, (err) => next(err))
        .catch((err) => next(err))

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type","text/plain");
    res.end("Operation not supported ");
})
.delete((req, res, next) => {
    //res.end("We will delete all promotions");
    promotions.remove({})
        .then((promotions)=>{
            res.json(promotions)
        }, (err) => next(err))
        .catch((err) => next(err))
});

promotionsRouter.route("/:promotionId")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next();
})
.get((req, res, next) => {
    promotions.findById(req.params.promotionId)
        .then((promotion) => {
            res.json(promotion)
        }, (err) => next(err))
        .catch((err) => next(err))
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type","text/plain");
    res.end(`Operation not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res, next) => {
   /* res.end(`We will update the promotion with id = ${req.params.promotionId} to have a name = ${req.body.name} 
    and description = ${req.body.description}`);*/

    promotions.findByIdAndUpdate(req.params.promotionId,{$set:req.body},{new: true})
        .then((promotion) => {
            res.json(promotion)
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete((req, res, next) => {
    //res.end(`We will delete the promotion with id = ${req.params.promotionId}`);
    promotions.findByIdAndRemove(req.params.promotionId)
        .then((resp)=>{
            res.json(resp)
        }, (err) => next(err))
        .catch((err) => next(err))
})


module.exports = promotionsRouter


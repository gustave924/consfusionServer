const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require("../models/dishes");

const url = "mongodb://127.0.0.1:27017/consFusion"
const connection = mongoose.connect(url);

connection
.then((db) => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err)
});
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route("/")
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next()
})
.get((req, res, next)=>{
    Dishes.find({})
    .then((dish) => {
        res.json(dish)
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        res.json(dish)
    },(err) => next(err))
    .catch((err) => next(err));
    //res.end(`We will add the dish: ${req.body.name} with description: ${req.body.description}`)
})
.put((req, res,next) => {
    res.statusCode = 403
    res.setHeader("Content-Type","text/plain");
    res.end("operation not supported");
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.json(resp)
    },(err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route("/:dishId")
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next()
})
.get((req, res, next)=>{
    //res.end(`We will get you the dish with id = ${req.params.dishId}`);
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.json(dish)
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {$set:req.body}, {new: true})
    .then((dish) => {
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((dish) => {
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
    //res.end('Deleting dish: ' + req.params.dishId);
});

dishRouter.route("/:dishId/comments")
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next()
})
.get((req, res, next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            res.json(dish.comments);
        }else{
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.json(dish);
            }, (err) => next(err));
        }else{
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})
.put((req, res,next) => {
    res.statusCode = 403
    res.setHeader("Content-Type","text/plain");
    res.end("operation not supported");
})
.delete((req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {$set: {comments: []}})
    .then((dish) => {
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
});


dishRouter.route("/:dishId/comments/:commentId")
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    next()
})
.get((req, res, next)=>{
    //res.end(`We will get you the dish with id = ${req.params.dishId}`);
    Dishes.findById(req.params.dishId)
    .then((dish) => {
       if(dish != null && dish.comments.id(req.params.commentId) != null){
            res.json(dish.comments.id(req.params.commentId));
       }else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {$set:req.body}, {new: true})
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    //res.end('Deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;
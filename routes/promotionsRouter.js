const express = require('express');
const bodyParser = require('body-parser');

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

promotionsRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req, res, next) => {
    res.end("We will get you all the promotions");
})
.post((req, res, next) => {
    res.end(`we will add the promotions with name = ${req.body.name} and description = ${req.body.description}`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end("Operation not supported ");
})
.delete((req, res, next) => {
    res.end("We will delete all promotions");
});

promotionsRouter.route("/:promotionId")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next();
})
.get((req, res, next) => {
    res.end(`We will get you the promotion with id = ${req.params.promotionId}`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`Operation not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res, next) => {
    res.end(`We will update the promotion with id = ${req.params.promotionId} to have a name = ${req.body.name} 
    and description = ${req.body.description}`);
})
.delete((req, res, next) => {
    res.end(`We will delete the promotion with id = ${req.params.promotionId}`);
})


module.exports = promotionsRouter


const express = require('express');
const bodyParser = require('body-parser');


const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());


leadersRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next) => {
    res.end("We will get you all the leaders");
})
.post((req, res, next) => {
    res.end(`We will add the leader with name = ${req.body.name} and description = ${req.body.description}`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`Operation not supported on /leaders`);
})
.delete((req, res, next) => {
    res.end("We will delete all users");
})

leadersRouter.route("/:leaderId")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
})
.get((req, res, next) => {
    res.end(`We will get you the leader with id = ${req.params.leaderId}`);
})
.post((req, res,  next) => {
    res.statusCode = 403;
    res.end("Operation not supported")
})
.put((req, res, next) => {
    res.end(`We update add the leader with id = ${req.params.leaderId} name = ${req.body.name} and description = ${req.body.description}`);
})
.delete((req, res, next) => {
    res.end(`We will delete the leader with id = ${req.params.leaderId}`)
})


module.exports = leadersRouter
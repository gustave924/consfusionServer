const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route("/")
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next()
})
.get((req, res, next)=>{
    res.end("Will send you all the dishes");
})
.post((req, res, next) => {
    res.end(`We will add the dish: ${req.body.name} with description: ${req.body.description}`)
})
.put((req, res,next) => {
    res.statusCode = 403
    res.end("operation not supported");
})
.delete((req, res, next) => {
    res.end("We will delete all the dishes");
});

dishRouter.route("/:dishId")
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type","text/plain");
    next()
})
.get((req, res, next)=>{
    res.end(`We will get you the dish with id = ${req.params.dishId}`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res,next) => {
    res.end(`We will update the dish with id = ${req.params.dishId} to have a name = ${req.body.name}
                and description = ${req.body.description}`);
})
.delete((req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});


module.exports = dishRouter;
const express = require('express');
const cors = require('cors');
const app = express();

const whiteList = ['http://localhost:3000', 'https://localhost:3443'];

var corsOptionsDelegate = (req, callbacks) => {
    var corsOptions;

    if( whiteList.indexOf(req.header('origin')) !== -1){
        corsOptions = {origin: true};
    }else{
        corsOptions = {origin: false};
    }

    callbacks(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
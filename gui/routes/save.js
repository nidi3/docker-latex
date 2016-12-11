var express = require('express');
var fs = require('fs');
var request = require('request');
var config = require('../config');
var router = express.Router();

router.post('/save', (req, res, next) => {
    fs.writeFile(config.dir + '/main.tex', req.body, err => {
        if (err) {
            res.status(500).send(err);
        } else {
            request.post(config.server + ':3001/pdflatex', {json: {}}, (err, response, body) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    fs.readFile(config.dir + '/main.log', (err, data) => {
                        res.status(200).send(data);
                    });
                }
            });

        }
    });
});

module.exports = router;

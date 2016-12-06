var express = require('express');
var fs = require('fs');
var request = require('request');
var router = express.Router();

router.post('/save', (req, res, next) => {
    fs.writeFile('/data/main.tex', req.body, err=> {
        if (err) {
            res.status(500).send(err);
        } else {
            request.post('http://server:3001/pdflatex', {json: {}}, (err, response, body)=> {
                if (err) {
                    res.status(500).send(err);
                } else {
                    fs.readFile('/data/main.log', (err, data)=> {
                        res.status(200).send(data);
                    });
                }
            });

        }
    });
});

module.exports = router;

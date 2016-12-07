var express = require('express');
var exec = require('child_process').exec;
var router = express.Router();

router.post('/pdflatex', (req, res, next)=> {
    exec('cd /data && pdflatex -interaction batchmode -file-line-error main.tex', (err, stdout, stderr)=> {
        if (err) {
            res.status(500).send(err);
        } else {
            res.sendStatus(200);
        }
    });
});

module.exports = router;

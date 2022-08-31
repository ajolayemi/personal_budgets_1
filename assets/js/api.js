const express = require('express');
const { addEnvelopes } = require('./db');
const app = require('./server')

const apiRouter = express.Router();


apiRouter.post('/envelopes', (req, res, next) => {
    try {
        const added = addEnvelopes(req.body);
        res.send(added)
    } catch (e) {
        next(e)
    }
})

module.exports = {
    apiRouter
}
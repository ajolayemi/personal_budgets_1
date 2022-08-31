const express = require('express');
const { addEnvelopes, getAllEnv } = require('./db');
const app = require('./server')

const apiRouter = express.Router();



apiRouter.get('/envelopes', (req, res) => {
    res.send(getAllEnv());
})

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
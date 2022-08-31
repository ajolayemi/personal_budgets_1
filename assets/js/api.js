const express = require('express');
const { addEnvelopes, getAllEnv } = require('./db');
const app = require('./server')

const apiRouter = express.Router();
const envelopeRouter = express.Router({mergeParams: true});
apiRouter.use('/envelopes', envelopeRouter);


envelopeRouter.get('/', (req, res) => {
    res.send(getAllEnv());
})

envelopeRouter.post('/', (req, res, next) => {
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
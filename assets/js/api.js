const express = require('express');
const { addEnvelopes, getAllEnv, getEnvById } = require('./db');
const app = require('./server')

const apiRouter = express.Router();
const envelopeRouter = express.Router({mergeParams: true});
apiRouter.use('/envelopes', envelopeRouter);

envelopeRouter.param('envelopeId', (req, res, next, id) => {
    const providedId = Number(id);
    if (!isNaN(providedId)) {
        req.envId = providedId;
        next();
    } else {
        const invalidArgError = new Error('Provided envelope id must be a number');
        invalidArgError.status = 400;
        next(invalidArgError);
    }
})


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

envelopeRouter.get('/:envelopeId', (req, res, next) => {
    const result = getEnvById(req.envId);
    if (result) {
        res.send(result)
    } else {
        const idError = new Error(`ID: ${req.envId} not found in database`);
        idError.status = 404;
        next(idError)
    }
})

module.exports = {
    apiRouter
}
const express = require('express');
const { addEnvelopes, getAllEnv, getEnvById, updateEnv } = require('./db');
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
        const invalidArgError = new Error(JSON.stringify({result: 'Provided envelope id must be a number'}));
        invalidArgError.status = 400;
        next(invalidArgError);
    }
})


const envIdValidator = (req, res, next) => {
    const result = getEnvById(req.envId);
    if (result) {
        req.filterRes = result;
        next();
    } else {
        const idError = new Error(`ID: ${req.envId} not found in database`);
        idError.status = 404;
        next(idError)
    }
}

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

envelopeRouter.get('/:envelopeId', envIdValidator, (req, res) => {
    res.send(getEnvById(req.envId));
})

envelopeRouter.put('/:envelopeId', envIdValidator, (req, res, next) => {
    const matchedEnvelope = getEnvById(req.envId);
    const queries = req.query;
    if (Object.keys(queries).length > 0) {
        const updatedData = updateEnv(Object.assign({id: matchedEnvelope.id}, queries))
        res.send(updatedData);
    } else {
        const noQueriesError = new Error(JSON.stringify({
            result: 'Provide at least a query key value between title, description and budget' }));
        noQueriesError.status = 400;
        next(noQueriesError)
    }
})

module.exports = {
    apiRouter
}
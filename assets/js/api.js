const express = require('express');
const { addEnvelopes, getAllEnv, getEnvById, updateEnv, addToBudget, subFromBudget } = require('./db');
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
        const invalidArgError = new Error(JSON.stringify({'error': 'Provided envelope id must be a number'}));
        invalidArgError.status = 400;
        next(invalidArgError);
    }
})

envelopeRouter.param('amountToSub', (req, res, next, toSub) => {
    const currentVal = getEnvById(req.envId);
    if (currentVal.budget >= Number(toSub)) {
        req.toRemove = toSub;
        next();
    } else {
        let balanceError = new Error(
            JSON.stringify(`Your current balance of €${currentVal.budget} for ${currentVal.title} 
            envelope is not sufficient.`)
        );
        balanceError.status = 400;
        next(balanceError);
    }
})


const envIdValidator = (req, res, next) => {
    const result = getEnvById(req.envId);
    if (result) {
        req.filterRes = result;
        next();
    } else {
        const idError = new Error(JSON.stringify({'error': `ID: ${req.envId} not found in database`}));
        idError.status = 404;
        next(idError)
    }
}

envelopeRouter.get('/', (req, res) => {
    res.send({result: getAllEnv()});
})

envelopeRouter.post('/', (req, res, next) => {
    try {
        const added = addEnvelopes(req.body);
        res.status(201).send({result: added})
    } catch (e) {
        next(e)
    }
})

envelopeRouter.get('/:envelopeId', envIdValidator, (req, res) => {
    res.send({result: getEnvById(req.envId)});
})

envelopeRouter.put('/:envelopeId', envIdValidator, (req, res, next) => {
    const matchedEnvelope = getEnvById(req.envId);
    const queries = req.query;
    if (Object.keys(queries).length > 0) {
        const updatedData = updateEnv(Object.assign({id: matchedEnvelope.id}, queries))
        res.send({result: updatedData});
    } else {
        const noQueriesError = new Error(JSON.stringify({
            'error': 'Provide at least a query key value between title, description and budget' }));
        noQueriesError.status = 400;
        next(noQueriesError)
    }
})

envelopeRouter.post('/:envelopeId/add/:amountToAdd', envIdValidator, (req, res) => {
    res.send({result: addToBudget(req.envId, Number(req.params.amountToAdd))});
})

envelopeRouter.post('/:envelopeId/sub/:amountToSub', envIdValidator, (req, res) => {
    res.send({result: subFromBudget(req.envId, req.toRemove)});
})

module.exports = {
    apiRouter
}
const express = require('express');
const { addEnvelopes, getAllEnv, getEnvById, updateEnv, addToBudget, subFromBudget, deleteEnv, doesIdExist } = require('./db');
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

envelopeRouter.param('from', (req, res, next) => {
    const reqParameters = req.params;
    const sender = Number(reqParameters.from);
    const receiver = Number(reqParameters.to);
    const amount = Number(reqParameters.amount);

    let err = new Error();
    if (isNaN(sender) || isNaN(receiver) || isNaN(amount)) {
        err = new Error(
            JSON.stringify({'error': 'Please make sure that the ids of sender and receiver are numbers \
            and that the amount to transfer is also a number.'}));
        err.status = 400;
        next(err);
    } else if (doesIdExist(sender) < 0) {
        err = new Error(
            JSON.stringify({'error' : `Sender envelope id (${sender}) does not exist.`})
        )
        err.status = 400;
        next(err);
    } else if (doesIdExist(receiver) < 0) {
        err = new Error(
            JSON.stringify({'error' : `Receiver envelope id (${receiver}) does not exist.`})
        )
        err.status = 400;
        next(err);
    } else if (amount <= 0) {
        err = new Error(
            JSON.stringify({'error' : 'Amount to transfer has to be greater than zero.'})
        )
        err.status = 400;
        next(err);
    } else if (sender === receiver) {
        err = new Error(
            JSON.stringify({'error': 'Receiver envelope and sender enveloper can\'t be the same thing.'})
        )
        err.status = 400;
        next(err);

    } else {
        const receiverData = getEnvById(receiver);
        if (receiverData.budget < amount) {
            let balanceErr = new Error(
                JSON.stringify({'error': `Sender's envelope current budget balance €(${receiverData.budget}) \
                is insufficient to complete the operation.`})
            )
            balanceErr.status = 400;
            next(balanceErr);
        } else {
            req.senderId = sender;
            req.receiverId = receiver;
            req.transferAmount = amount;
            next();
        }

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

envelopeRouter.post('/:envelopeId/sub/:amountToSub', (req, res, next) => {
    const currentVal = getEnvById(req.envId);
    if (!currentVal) {
        const idError = new Error(JSON.stringify({'error': `ID: ${req.envId} not found in database`}));
        idError.status = 404;
        return next(idError);
    }

    if (isNaN(Number(req.params.amountToSub))) {
        const valError = new Error(
            JSON.stringify({error : 'Please provide amount to subtract as a number'})
        )
        valError.status = 400;
        return next(valError)
    }

    if (currentVal.budget >= Number(req.params.amountToSub)) {
        res.send({result: subFromBudget(req.envId, req.params.amountToSub)});
        next();
    } else {
        let balanceError = new Error(
            JSON.stringify({error: `Your current balance of €${currentVal.budget} for ${currentVal.title} \
            envelope is not sufficient.`})
            );
        balanceError.status = 400;
        next(balanceError);
        }
    })


envelopeRouter.delete('/:envelopeId', envIdValidator, (req, res) => {
    res.status(201).send({result: deleteEnv(req.envId)})
})

envelopeRouter.post('/transfer/:from/:to/:amount', (req, res) => {
    const addToReceiver = addToBudget(req.receiverId, req.transferAmount);
    const subFromSender = subFromBudget(req.senderId, req.transferAmount);
    res.send(
        {result: {
            senderNew: subFromSender,
            receiverNew: addToReceiver
        }}
    )
})

module.exports = {
    apiRouter
}
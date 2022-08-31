const envelopes =  {
    data: [],
    nextId: 0,
}


// Verify envope body
const verifyEnv = toVerify => {
    if (!toVerify.hasOwnProperty('title') || toVerify.title === "") {
        throw new Error('Title must be provided for envelope');
    };

    if (!toVerify.hasOwnProperty('budget') || toVerify.budget === "") {
        throw new Error('Budget must be provided for envelope');
    }

    if (!toVerify.hasOwnProperty('description') || toVerify.description === "") {
        throw new Error('A description must be provided');
    }
    if (isNaN(Number(toVerify.budget))) {
        throw new Error('Budget must be a number');
    };

    return true; 
}

// Creates new envelopes
const addEnvelopes = dataToAdd => {
    if (verifyEnv(dataToAdd)) {
        dataToAdd['id'] = envelopes.nextId += 1;
        envelopes.data.push(dataToAdd);
        return envelopes.data[envelopes.data.length - 1]
    } else {
        return null;
    }
} 

module.exports = {
    addEnvelopes,
}
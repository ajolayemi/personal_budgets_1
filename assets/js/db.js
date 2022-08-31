const envelopes =  {
    data: [],
    nextId: 0,
}

const titles = ['Food', 'University', 'Clothing', 'Party', 'Travel'];
const budgets = Array(20).fill(1).map((_, i) => i + Math.floor(Math.random() * 1000));
const descriptions = [
    'This will be the last time', 
    'Need to spend it wisely', 
    'While waiting for my next salary',
    'Will I be able to maintain it',
    'Don\'t tocuch it!']

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

// Checks to see if there are envelopes in database
const checkEnvelopes = () => {
    if (envelopes.data.length === 0) {
        throw new Error('No envelopes in database!');
    } 
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

const getAllEnv = () => {
    if (checkEnvelopes) {
        return envelopes.data;
    } else {
        return null;
    }
}

const getEnvById = idToUse => {
    if (checkEnvelopes) {
        const dataToReturn = envelopes.data.find(env => env.id === idToUse);
        if (dataToReturn) {
            return dataToReturn;
        } else {
            return null;
        }
    }
}

module.exports = {
    addEnvelopes,
    getAllEnv,
    getEnvById,
}
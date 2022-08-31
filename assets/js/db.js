const envelopes =  {
    data: [],
    nextId: 1,
}

const titles = ['Food', 'University', 'Clothing', 'Party', 'Travel'];
const budgets = Array(20).fill(1).map((_, i) => i + Math.floor(Math.random() * 10000));
const descriptions = [
    'This will be the last time', 
    'Need to spend it wisely', 
    'While waiting for my next salary',
    'Will I be able to maintain it',
    'Don\'t tocuch it!']

// Randomly create envlopes
titles.forEach(title => {
    const randomBudget = budgets[Math.floor(Math.random() * budgets.length)];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    envelopes.data.push({
        id: envelopes.nextId ++,
        title: title,
        budget: randomBudget,
        description: randomDescription
    })
})

// Verify envope body
const verifyEnv = toVerify => {
    if (!toVerify.hasOwnProperty('title') || toVerify.title === "") {
        throw new Error(
            JSON.stringify({'error': 'Title must be provided for envelope'}));
    };

    if (!toVerify.hasOwnProperty('budget') || toVerify.budget === "") {
        throw new Error(
            JSON.stringify({'error': 'Budget must be provided for envelope'}));
    }

    if (!toVerify.hasOwnProperty('description') || toVerify.description === "") {
        throw new Error(
            JSON.stringify({'error': 'A description must be provided'}));
    }
    if (isNaN(Number(toVerify.budget))) {
        throw new Error(
            JSON.stringify({'error': 'Budget must be a number'}));
    };

    return true; 
}

// Checks to see if there are envelopes in database
const checkEnvelopes = () => {
    if (envelopes.data.length === 0) {
        throw new Error(
            JSON.stringify({'error': 'No envelopes in database!'}));
    } 
    return true;
}

// Creates new envelopes
const addEnvelopes = dataToAdd => {
    if (verifyEnv(dataToAdd)) {
        const idObj = {id: envelopes.nextId ++}
        envelopes.data.push(Object.assign(idObj, dataToAdd));
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


const updateEnv = newData => {
    const index = envelopes.data.findIndex(element => element.id === newData.id);
    if (index >= 0) {
        envelopes.data.splice(index, 1, newData);
        return envelopes.data[index]
    } else {
        return null;
    }
}
module.exports = {
    addEnvelopes,
    getAllEnv,
    getEnvById,
    updateEnv,
}
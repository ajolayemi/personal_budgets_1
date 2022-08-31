const envelopes = [{nextId: 0}];


// Verify envope body
const verifyEnv = toVerify => {
    const checkProps = toVerify.hasOwnProperty('title') && toVerify.hasOwnProperty('budget');
    console.log(checkProps);
    return checkProps;
}

// Creates new envelopes
const addEnvelopes = dataToAdd => {
    const check = verifyEnv(dataToAdd);
} 

module.exports = {
    addEnvelopes,
}
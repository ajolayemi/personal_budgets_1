# PERSONAL BUDGET PROJECT

This is a project for Codecademy Back-End's engineer course.
The purpose of the project is to build an API that allows clients to create and manage a personal busget using tthe the [Envelope Budgeting](https://www.thebalance.com/what-is-envelope-budgeting-1293682) principles. 

## Technologies used
1. JavaScript
2. Node.js
3. Express


## Provided endpoints
- GET `/pb/envelopes`
    - returns all envelopes in database.
- POST `/pb/envelopes`
    - creates a new envelope and returns it.
- GET `/pb/envelopes/:envelopeId`
    - gets and returns the specified envelope.
- PUT `/pb/envelopes/:envelopeId?title=string&description=string&budget=number`
    - updates the provided data in the request query pertaining to the specified envelope. returns the new envelope details.
- PUT `/pb/envelopes/:envelopeId/add/:amountToAdd`
    - adds the specified amount to the specified envelope's budget. returns the new envelope details.
- PUT `/pb/envelopes/:envelopeId/sub/:amountToSub`
    - deducts the specified amount from the specified envelope's budget. returns the new envelope details
- DELETE `/pb/envelopes/:envelopeId`
    - deletes the specified envelope. returns **true** or **false** base on whether the deletion was successful or not.
- PUT `/pb/envelopes/transfer/:from/:to/:amount`
    - transfers the specified amount from the specified sender envelope to the specified receiver's envelope. returns the new details about both envelopes.

**NOTE** - all endpoints contain various validations done before each operations and each failures (the handled one) returns a JSON with information about them. every success requests also returns a JSON. 
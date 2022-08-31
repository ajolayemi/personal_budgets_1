const express = require('express');
const { apiRouter } = require('./api');

const app = express();
module.exports = app;

const PORT = process.env.PORT || 3000;


// Require some third party modules
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const morgan = require('morgan');
app.use(morgan('dev'));


// Monting apiRouter at /pb path which will serve as my base path
app.use('/pb', apiRouter)

app.listen(PORT, () => console.log(`Started listening at PORT: ${PORT}`));
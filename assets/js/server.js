const express = require('express');
const { apiRouter } = require('./api');

const app = express();
module.exports = app;

const PORT = process.env.PORT || 3000;

// Monting apiRouter at /pb path which will serve as my base path
app.use('/pb', apiRouter)

// Require some third party modules
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json())

const morgan = require('morgan');
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello, World');
})

app.listen(PORT, () => console.log(`Started listening at PORT: ${PORT}`));
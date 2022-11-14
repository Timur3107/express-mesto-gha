const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errorHandler } = require('./utils/errorHandler');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Такая страница не найдена!' });
});

app.use(errorHandler);

app.listen(PORT);

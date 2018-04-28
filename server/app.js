const express = require('express');
const qraphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const { port, dataBaseConnection } = require('./config');


const app = express();

// connect to db
mongoose.connect(dataBaseConnection);
mongoose.connection.once('open', () => console.log('connected to db'));

app.use('/graphql', qraphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(port, () => console.log(`listening on port ${port}`));
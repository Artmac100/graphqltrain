const express = require('express');
const qraphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')


const app = express();

app.use('/graphql', qraphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => console.log('listening on port 4000'));
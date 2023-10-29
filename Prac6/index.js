const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const port = 1234;
const schema = require('./schema/schema');

const app = express();

app.use(cors());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(port);
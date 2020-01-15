const express = require('express');
const blogInfoRouter = require('../data/bloginfo-router');
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`<h1>Welcome to my homework assignment</h1>`);
});

server.use('/api/posts', blogInfoRouter);

module.exports = server;


const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const PORT = 300010;
app.use(express.static(path.join(__dirname, '../', 'public')));
require('./listen.js')(server);
// server.listen(PORT,()=>console.log(`server is listening on ${PORT}`));

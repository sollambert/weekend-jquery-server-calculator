const express = require('express');
const app = express();

app.use(express.static('server/public'));
app.use(express.urlencoded({extended: true}));

const PORT = 8000;
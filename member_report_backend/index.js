const express = require('express');

const app = express();
const cors = require('cors');
const memberRouter = require('./routes/memberRoutes');
const reportRouter = require('./routes/reportRoutes');

app.use(cors({origin:'*'}))
app.use('/api/v1/members', memberRouter)
app.use('/api/v1/report', reportRouter)
module.exports = app;
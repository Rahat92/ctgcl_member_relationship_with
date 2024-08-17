const express = require('express');
const { generateReport } = require('../controllers/reportController');
const router = express.Router();

router
    .route('/:id')
    .get(generateReport)

const reportRouter = router;
module.exports=reportRouter;
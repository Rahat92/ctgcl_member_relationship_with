const express = require('express');
const { getAMemberDetails, getAllMembers } = require('../controllers/memberController');
const router = express.Router();

router
    .route('/')
    .get(getAllMembers)
router
    .route('/:id')
    .get(getAMemberDetails)

const memberRouter = router;
module.exports=memberRouter;
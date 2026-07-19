const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { getOrgTree } = require('../controllers/organizationController');

const router = express.Router();

router.get('/tree', requireAuth, getOrgTree);

module.exports = router;
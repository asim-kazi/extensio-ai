const express = require('express');
const { generateFromPrompt } = require('../controllers/generateController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, generateFromPrompt);

module.exports = router;
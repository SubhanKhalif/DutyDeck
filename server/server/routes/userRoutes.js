const express = require('express');
const { getAllEmployees } = require('../controllers/userController');

const router = express.Router();

router.get('/employees', getAllEmployees); // GET /api/users/employees

module.exports = router;

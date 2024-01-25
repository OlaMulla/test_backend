const express = require('express');
const EmployeeController = require('../Controllers/EmployeeController');

const unauthenticated = express.Router();

unauthenticated 

.post('/login', EmployeeController.login)
.post('/validate-token', EmployeeController.validate_token)


module.exports = unauthenticated;
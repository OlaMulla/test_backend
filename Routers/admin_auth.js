const express = require('express');
const EmployeeController = require('../Controllers/EmployeeController');
const { post } = require('./unauthenticated');

let admin_auth = express.Router();

admin_auth 

//User Routes
.post('/employee' , EmployeeController.create_employee)
.get('/employee/:id' , EmployeeController.get_employee)
.get('/employees', EmployeeController.get_all_employees)
.put('/employee/:id' , EmployeeController.update_employee)
.delete('/employee/:id' , EmployeeController.delete_employee)

module.exports = admin_auth;
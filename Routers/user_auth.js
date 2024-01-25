const express = require('express');
const AttendanceController = require('../Controllers/AttendanceController');
const EmployeeController = require('../Controllers/EmployeeController');

let user_auth = express.Router();

user_auth 

//Employee Routes
.get('/:id' , EmployeeController.get_employee)

//Attendance Routes
.get('/check-attendant/:id' , AttendanceController.check_attendance)
.post('/check-in/:id', AttendanceController.check_in)
.post('/check-out/:id', AttendanceController.check_out)
.get('/get-all-user-attendances/:id', AttendanceController.get_all_user_attendances)


module.exports = user_auth;
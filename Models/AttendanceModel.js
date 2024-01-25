const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({

    attendance_date: {type: Date},
    check_in_time: {type: Date, default: null},
    check_out_time: {type: Date, default: null},
    checked_in: {type: Boolean, default: false},
    checked_out: {type: Boolean, default: false},
    late_attend_flag: {type: Boolean, default: false},
    late_flag_reason: {type: String, default: null},
    early_leave_flag: {type: Boolean, default: false},
    early_flag_reason: {type: String, default: null},
    working_hours: {type: Number, default: 0},
    employee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
   
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
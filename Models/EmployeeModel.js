const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({

    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required:true},
    role: {type: String, default: 'employee'},
    deletedAt: {type: Date, default: null}
   
})

module.exports = mongoose.model('Employee', EmployeeSchema);
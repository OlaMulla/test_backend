const EmployeeModel = require('../Models/EmployeeModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Riyadh');

class EmployeeController {  

//____________________________________________________________________________________________________

    // Create a New Employee Endpoint
    static async create_employee(req, res) {

        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let email = req.body.email;
        let password = req.body.password;

        
        try {
            
            let target_employee = await EmployeeModel.findOne({email: email});

            if (target_employee) {
                return res.status(400).json({message: "Employee Already Exists"});
            }

            let hashed_password = await bcrypt.hash(password, saltRounds);

            let created_employee = await EmployeeModel.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashed_password
            });

            return res.status(200).json({ employee: created_employee });

        } 
        
        catch (error) {

            return res.status(500).json({message: error.message});
            
        }
    }

//_________________________________________________________________________________________________________

    //Update an Employee Endpoint
    static async update_employee(req, res) {

        const employee_id = req.params.id;
        const { first_name, last_name, email, password } = req.body;
    
        try {
            const updated_employee = await EmployeeModel.findById({ _id: employee_id });
    
            if (!updated_employee) {
                return res.status(400).json({ message: "Employee Not Found" });
            }
    
            if (updated_employee.deletedAt !== null) {
                return res.status(400).json({ message: "Employee is Deleted" });
            }
    
            
            if (first_name !== undefined) {
                updated_employee.first_name = first_name;
            }
    
            if (last_name !== undefined) {
                updated_employee.last_name = last_name;
            }
    
            if (email !== undefined) {
                updated_employee.email = email;
            }

            if (password !== undefined) {
                const hashed_password = await bcrypt.hash(password, saltRounds);
                updated_employee.password = hashed_password;
            }
    
            await updated_employee.save();
            return res.status(200).json({ employee: updated_employee });
        } 

        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    

//_____________________________________________________________________________________________

    // Get a Single Employee Endpoint
    static async get_employee (req , res){

        const employee_id = req.params.id;

        try {
            
            const target_employee = await EmployeeModel.findById({ _id: employee_id });

            if (!target_employee) {
                return res.status(400).json({message: "Employee Not Found"});
            }

            if (target_employee.deletedAt !== null) {
                return res.status(400).json({message: "Employee is Deleted"});
            }

            return res.status(200).json({employee: target_employee});

        } 
        
        catch (error) {
           return res.status(500).json({message: error.message});
        }
    }

//_____________________________________________________________________________________________

    // Get All Employees
    static async get_all_employees (req , res){

        try {
            
            const all_employees = await EmployeeModel.find({deletedAt: null, role: 'employee'});
            return res.status(200).send(all_employees);

        } 
    
        catch (error) {
        return res.status(500).json({message: error.message});
        }
    }

//_____________________________________________________________________________________________

    // Delete an Employee Endpoint
    static async delete_employee (req , res){

        const employee_id = req.params.id;
        const db_date_format = moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

        try {
            
            const deleted_employee = await EmployeeModel.findById({ _id: employee_id });

            if (!deleted_employee) {
                return res.status(400).json({message: "Employee Not Found"});
            }

            if (deleted_employee.deletedAt !== null) {
                return res.status(400).json({message: "Employee is Deleted"});
            }

            deleted_employee.deletedAt = db_date_format;
            deleted_employee.email = deleted_employee.email + '_deleted';
            deleted_employee.save();

            return res.status(200).json({message: "Employee is Deleted Successfully"});

        } 
    
        catch (error) {
        return res.status(500).json({message: error.message});
        }
    }

//____________________________________________________________________________________________________

    // Login Endpoint for Employees
    static async login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        try {
            
            let target_employee = await EmployeeModel.findOne({email: email});

            if (!target_employee) {
                return res.status(400).json({message: "Employee Not Found"});
            }

            if (target_employee.deletedAt !== null) {
                return res.status(400).json({message: "Employee is Deleted"});
            }

            let isMatch = await bcrypt.compare(password, target_employee.password);

            if (!isMatch) {
                return res.status(400).json({message: "Password is Incorrect"});
            }

            // Create a session
            req.session.employeeId = target_employee._id;

            // Create a JWT token
            const token = jwt.sign({
                employee_id: target_employee._id,
                role: target_employee.role },
                'attendance_system_@545', 
                { expiresIn: '24h' }
            );

            return res.status(200).json({ employee: target_employee, role: target_employee.role, token: token });

        }
        
        catch (error) {

            return res.status(500).json({message: error.message});
            
        }
    
    }

//____________________________________________________________________________________________________


    static async validate_token(req, res) {

        const token = req.body.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token is missing in the request body',
            });
        }

        try {
            // Validate the token
            const decoded = jwt.verify(token, 'attendance_system_@545');

            return res.json({ role: decoded.role, _id: decoded.employee_id });
        } 

        catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid',
            });
        }
    }
}

module.exports = EmployeeController;
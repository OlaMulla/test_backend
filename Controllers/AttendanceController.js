const AttendanceModel = require('../Models/AttendanceModel');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Riyadh');



class AttendanceController  {  

//____________________________________________________________________________________________________

    
    static async check_attendance(req, res) {

        const  employee_id  = req.params.id;
        const today = moment().format('YYYY-MM-DD');
        
        try {
            const attendance_record = await AttendanceModel.findOne({
                employee_id: employee_id,
                attendance_date: today,
            });

            if (attendance_record) {
                return res.json({ attended: true, attendance: attendance_record });
            } 
            else {
                const new_attendance_record = await AttendanceModel.create({
                    attendance_date: today,
                    employee_id: employee_id,
                });

                return res.json({attended: false,  attendance: new_attendance_record });
            }
        } 
        catch (error) {
            return res.status(500).send(error.toString());
        }
    };

//____________________________________________________________________________________________________

    static async get_all_user_attendances(req, res) {

        const employee_id = req.params.id;

        try {
            const attendance_records = await AttendanceModel.find({
                employee_id: employee_id,
            });

            if (attendance_records && attendance_records.length > 0) {
                return res.json({ attendance: attendance_records });
            } 
            else {
                return res.json({ Error: "No Records Found" }); 
            }
        } 
        catch (error) {
            return res.status(500).send(error.toString());
        }
    };
    
//____________________________________________________________________________________________________

    static async check_in(req, res) {

        const  employee_id  = req.params.id;
        const reason = req.body.reason;
        
        const now = moment()
        const late_check_in = now.isBetween(moment('08:30:00', 'HH:mm:ss'), moment('15:59:00', 'HH:mm:ss'));
        const normal_check_in = now.isSameOrAfter(moment('07:00:00', 'HH:mm:ss')) && now.isSameOrBefore(moment('08:29:59', 'HH:mm:ss'));
        const db_date_format = now.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        
         
        try {
            const attendance_record = await AttendanceModel.findOne({
                employee_id: employee_id,
                attendance_date: now.format('YYYY-MM-DD'),
            });


            if (!attendance_record) {
                return res.json({ Error: "No Attendance Record Found" });
            }
 
            if (attendance_record.checked_in) {
                    return res.json({ Error: "Already Checked In" });
            }

            else {

                if (late_check_in) {

                    attendance_record.check_in_time = db_date_format;
                    attendance_record.checked_in = true;
                    attendance_record.late_attend_flag = true;
                    attendance_record.late_flag_reason = reason;

                    await attendance_record.save();

                    return res.json({ attendance: attendance_record });
                }

                if (normal_check_in) {

                    attendance_record.check_in_time = db_date_format;
                    attendance_record.checked_in = true;

                    await attendance_record.save();

                    return res.json({ attendance: attendance_record });
                }

                else {
                    return res.json({ Error: "Attendance Time is Over" });
                }
            }
        } 
        catch (error) {
            return res.status(500).send(error.toString());
        }
    };

//____________________________________________________________________________________________________

    static async check_out(req, res) {

        const  employee_id  = req.params.id;
        const reason = req.body.reason;
        
        const now = moment()
        const early_check_out = now.isBetween(moment('07:00:01', 'HH:mm:ss'), moment('14:59:00', 'HH:mm:ss'));
        const normal_check_out = now.isBetween(moment('15:00:01', 'HH:mm:ss'), moment('16:00:01', 'HH:mm:ss'));
        const db_date_format = now.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');

        let start_date;
        let end_date;
        let working_hours;
        
         
        try {
            const attendance_record = await AttendanceModel.findOne({
                employee_id: employee_id,
                attendance_date: now.format('YYYY-MM-DD'),
            });


            if (!attendance_record) {
                
                return res.json({ Error: "No Attendance Record Found" });
            }
 
            if (attendance_record.checked_out) {
                
                return res.json({ Error: "Already Checked Out" });
            }

            else {

                if (early_check_out) {

                    start_date = moment(attendance_record.check_in_time);
                    end_date = moment(db_date_format);
                    working_hours = end_date.diff(start_date, 'hours');
        

                    attendance_record.check_out_time = db_date_format;
                    attendance_record.checked_out = true;
                    attendance_record.early_leave_flag = true;
                    attendance_record.early_flag_reason = reason;
                    attendance_record.working_hours = working_hours;

                    await attendance_record.save();

                    return res.json({ attendance: attendance_record });
                }

                if (normal_check_out) {

                    start_date = moment(attendance_record.check_in_time);
                    end_date = moment(db_date_format);
                    working_hours = end_date.diff(start_date, 'hours');

                    attendance_record.check_out_time = db_date_format;
                    attendance_record.checked_out = true;
                    attendance_record.working_hours = working_hours;

                    await attendance_record.save();

                    return res.json({ attendance: attendance_record });
                }

                else {
                    return res.json({ Error: "Attendance Time is Over" });
                }
            }
        } 
        catch (error) {
            return res.status(500).send(error.toString());
        }
    };
}

module.exports = AttendanceController;
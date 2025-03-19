const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empname: String,
    email: String,
    password:String,
    address: String,
    salary: Number,
    department: String
}, { collection: 'Employee' });

const leaveSchema = new mongoose.Schema({
    names: String,
    email: String,
    subject: String,
    message: String,
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
}, { collection: 'Leave' });

const hrSchema = new mongoose.Schema({
    email: String,
    password: String
}, { collection: 'HR' });

const Employee = mongoose.model('Employee', employeeSchema);
const Leave = mongoose.model('Leave', leaveSchema);
const HR = mongoose.model('HR', hrSchema);


module.exports = {
    Employee,
    Leave,
    HR
};

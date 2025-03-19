const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Employee, Leave, HR } = require('../models/schemas');
const router = express.Router();
const sendEmail = require('./emailService');



function generateRandomPassword() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.get("/", (req, res) => {
    res.render("index");
})

router.get("/login", (req, res) => {
    res.render('loginEmployee');
});
router.get("/login-HR", (req, res) => {
    res.render('loginHR');
});




router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    const user = role === 'HR' ? await HR.findOne({ email }) : await Employee.findOne({ email });

    if (!user) {
        return res.send('<script>alert("You are not present in the system."); window.location="/";</script>');
    }

    let isMatch = await bcrypt.compare(password, user.password);
    console.log(password);
    console.log(user.password);


    if (!isMatch) {
        return res.send('<script>alert("Incorrect password. Please try again."); window.location="/login";</script>');
    }

    if (role === 'HR') {
        res.redirect('/hrDashboard');
    } else {
        res.cookie('email', email);
        res.cookie('role', role);
        res.redirect('/employeeDashboard');
    }
});


router.get('/hrDashboard', async (req, res) => {
    const employees = await Employee.find();
    res.render('dashboardHR', { employees });

});


router.get('/employeeDashboard', async (req, res) => {
    const email = req.cookies.email;

    try {
        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).send("Employee details not found.");
        }

        const myLeaves = await Leave.find({ email });
console.log(employee);
        res.render('dashboardEmployee', {
            employee,
            myLeaves
        });
    } catch (error) {
        res.status(500).send("Error fetching employee details: " + error.message);
    }
});






router.post('/applyLeave', async (req, res) => {
    const { names, email, subject, message } = req.body;

    if (!subject || !message) {
        return res.send('<script>alert("Please fill all fields."); window.location="/employeeDashboard";</script>');
    }

    try {
        const newLeave = new Leave({
            names,
            email,
            subject,
            message,
            date: new Date(),
            status: 'Pending'
        });

        await newLeave.save();

        res.redirect('/employeeDashboard');
    } catch (error) {
        res.status(500).send("Error submitting leave application: " + error.message);
    }
});


router.get("/logout", (req, res) => {
    res.clearCookie('email');
    res.clearCookie('role');
    res.redirect('/');
});

router.post("/add", async (req, res) => {
    try {
        const { empname, email, address, salary, department } = req.body;


        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.send('<script>alert("Employee already exists!"); window.location="/hrDashboard";</script>');
        }


        const randomPassword = generateRandomPassword();

        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        console.log(randomPassword);

        await Employee.create({ empname, email, password: hashedPassword, address, salary, department });

        await sendEmail(email, 'Your Employee Account Created', `Your account has been created. Your password is: ${randomPassword}`);


        res.redirect('/hrDashboard');
    } catch (error) {
        res.status(500).send("Error adding employee: " + error.message);
    }
});


router.post("/addhr", async (req, res) => {
    try {
        const { email } = req.body;


        const existingHR = await HR.findOne({ email });
        if (existingHR) {
            return res.send('<script>alert("HR already exists!"); window.location="/hrDashboard";</script>');
        }


        const randomPassword = generateRandomPassword();

        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        console.log(randomPassword);

        await HR.create({ email, password: hashedPassword });

        await sendEmail(email, 'Congratulation...!Your HR Account Created', `Your account has been created. Your password is: ${randomPassword}`);


        res.redirect('/hrDashboard');
    } catch (error) {
        res.status(500).send("Error adding HR: " + error.message);
    }
});






router.get("/getAll", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.render('dashboardHR', { employees });
    } catch (error) {
        res.status(500).send("Error fetching employees: " + error.message);
    }
});

router.get('/update/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }
        res.render('editEmployee', { employee });
    } catch (error) {
        res.status(500).send("Error fetching employee details: " + error.message);
    }
});

router.post("/update/:id", async (req, res) => {
    try {
        const { empname, email, address, salary, department } = req.body;
        await Employee.findByIdAndUpdate(req.params.id, { empname, email, address, salary, department });
        res.redirect('/getAll');
    } catch (error) {
        res.status(500).send("Error updating employee: " + error.message);
    }
});


router.get("/delete/:id", async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.redirect('/getAll');
    } catch (error) {
        res.status(500).send("Error deleting employee: " + error.message);
    }
});


router.get('/leave', async (req, res) => {
    try {
        const pendingLeaves = await Leave.find({ status: 'Pending' });
        res.render('leaveRecords', { leaves: pendingLeaves });
    } catch (error) {
        res.status(500).send('Error fetching pending leave requests');
    }
});


// router.get('/leave', async (req, res) => {
//     try {
//         const pendingLeaves = await Leave.find({ status: 'Pending' });

//         // Fetch employee details for each leave
//         const leaves = await Promise.all(pendingLeaves.map(async (leave) => {
//             const employee = await Employee.findOne({ email: leave.email });
//             return {
//                 ...leave._doc, // Spread the leave details
//                 employeeName: employee ? employee.names : 'Unknown',
//             };
//         }));

//         res.render('leaveRecords', { leaves});
//     } catch (error) {
//         res.status(500).send('Error fetching pending leave requests: ' + error.message);
//     }
// });


router.get('/viewLeave/:id', async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);
        if (!leave) {
            return res.status(404).send('Leave request not found');
        }

        const email=leave.email;
        console.log("Email:",email);
        const employee=await Employee.findOne({email:email});
        console.log("Name",employee.empname);
        res.render('leaveDetails', { leave ,employee});
        
    } catch (error) {
        res.status(500).send('Error fetching leave details');
    }
});


router.get('/handleLeave/:id/:action', async (req, res) => {
    const { id, action } = req.params;

    try {
        const leave = await Leave.findById(id);  // Fetch the leave document
        if (!leave) {
            return res.status(404).send('Leave request not found');
        }

        const updatedStatus = action === 'accept' ? 'Accepted' : 'Rejected';

        await Leave.findByIdAndUpdate(id, { status: updatedStatus });

        // Send email using the email found in the leave document
        await sendEmail(
            leave.email, 
            `Leave ${updatedStatus}`, 
            `Your leave has been ${updatedStatus} by HR.`
        );

        res.redirect('/leave');
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).send('Error updating leave status');
    }
});



module.exports = router;

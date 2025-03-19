const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'Enter Your Email Here',  
            pass: 'Enter your App password here...you can generate it from your Google account (Security-App Password)'
        }
    });

    const mailOptions = {
        from: 'Enter Your Email Here',
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;

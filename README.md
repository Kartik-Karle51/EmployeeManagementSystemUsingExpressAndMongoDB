# Employee Management System

## Overview
The Employee Management System is a web-based application developed using **Express.js** and **MongoDB**. It provides distinct sections for HR and Employees, allowing efficient management of employee records and leave requests.

## Features

### HR Features
- Add new employees and HRs, with automated email notifications containing login credentials.
- Update and delete employee records.
- Manage leave records by viewing, approving, or rejecting leave requests.

### Employee Features
- View personal profile information.
- Apply for leave and track leave history.

## Security & Performance Enhancements
- Secure password storage using **bcrypt**.
- Streamlined navigation and session management using **cookies**.

## Technologies Used
- **Backend:** Express.js, Node.js
- **Database:** MongoDB
- **Authentication:** bcrypt for password hashing
- **Frontend:** EJS (Embedded JavaScript Templates)
- **Session Management:** Cookies
- **Email Notifications:** Nodemailer

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)



## Folder Structure
```
/employee-management-system
│── /models          # Mongoose models for database
│── /routes          # API route handlers
│── /controllers     # Business logic for application
│── /views           # EJS templates for frontend
│── /public          # Static files (CSS, JS, Images)
│── server.js        # Entry point for the application
│── .env             # Environment variables
│── package.json     # Project dependencies
```

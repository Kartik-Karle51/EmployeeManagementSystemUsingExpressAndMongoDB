const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// const { Employee, Leave, HR } = require('./models/schemas');
require('dotenv').config();

connectDB();
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));


app.use('/', require('./routes/authRoutes'));


app.listen(3000, () => console.log('Server running on port 3000'));
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require("mongoose");
let session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
let cors = require('cors');
let db_url = require('./Config/db')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const EmployeeModel = require('./Models/EmployeeModel');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Riyadh');

let app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log('Request received:', req.headers.origin);

  const allowedOrigins = [
    'https://employee-attendance-psi.vercel.app',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
});


const store = new MongoDBStore({
  uri: db_url,
  collection: 'sessions',
});

app.use(session({
  secret: 'AttendanceIsGreat@12',
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  return res.render('index');
});

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));


require('./Routers/index')(app);

mongoose.connect(db_url).then( async () => { 

  const target_admin = await EmployeeModel.findOne({ email: 'admin@attendance.com' });

    if (!target_admin) {
      
      const password = 'admin@545';
      const hashed_password = await bcrypt.hash(password, saltRounds);

      await EmployeeModel.create({
        first_name: 'system',
        last_name: 'admin',
        email: 'admin@attendance.com',
        password: hashed_password,
        role: 'admin'
      });

      console.log('Admin user created successfully');
    }

  console.log('Database is Connected Successfully') },
  error => { console.log(error) });


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
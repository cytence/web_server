var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var img_pool_router = require('./routes/img_pool');
var login_router = require('./routes/login_proc');
var admin_router = require('./routes/admin_page');
var receive_broadcast_router = require('./routes/receive_broadcast');
var user_router = require('./routes/user_page');
var reg_user_router = require('./routes/reg_proc');


var session = require('express-session');

// view engine setup
global.path = require('path');
global.mysql = require('mysql');
global.conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    port:3306
});

conn.connect(function(err) {
  if (err) throw err;
  conn.query("USE nkust_db;", function (err, result) {
    if (err)
    {
    	throw err;
    }
  })
  var cmd = "CREATE TABLE IF NOT EXISTS users (user_type VARCHAR(256), user_name VARCHAR(256) PRIMARY KEY, password VARCHAR(256));";
  conn.query(cmd, function (err, result) {
    if (err)
    {
    	throw err;
    }
    
  console.log("Table created");
  });
});

//app.set('port', 80);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('NKUST_SS_COOKIE'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ cookieName: 'session', secret: 'NKUST_SECRET', cookie: {}}));
 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/img',img_pool_router);
app.use('/login_proc',login_router);
app.use('/admin_page',admin_router);
app.use('/receive_broadcast',receive_broadcast_router);
app.use('/user_page',user_router);
app.use('/reg_proc',reg_user_router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(80);
module.exports = app;

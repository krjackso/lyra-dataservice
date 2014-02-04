var express = require('express');
var mysql = require('mysql');
var app = express();

var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1';
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;
var mysqlUser = process.env.OPENSHFIT_MYSQL_DB_USERNAME || 'admincRUjhJL';
var mysqlPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'rAl5sijkwgqk';

// Config
var connection = mysql.createConnection({
	host		: mysqlHost,
	port		: mysqlPort, 
	user		: mysqlUser,
	password	: mysqlPass,
	database	: 'data',
});

app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/hello', function(req, res) {
	res.send('Hello World');
});

console.log(process.env);

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);

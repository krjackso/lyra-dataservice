var express = require('express');
var mysql = require('mysql');
var app = express();

var mysqlHost = process.env.OPENSHIFT_MYSQL_DB_HOST;
var mysqlPort = process.env.OPENSHIFT_MYSQL_DB_PORT;
var mysqlUser = process.env.OPENSHFIT_MYSQL_DB_USERNAME;
var mysqlPass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;

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

app.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);

var express = require('express');
var mysql = require('mysql');
var util = require('util');
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

// Creates a user and returns the id, unless the nickname is taken
app.post('/users/:name', function(req, res) {
	var name = req.params.name;

	connection.query(
		'SELECT id, nickname FROM users WHERE nickname LIKE ?',
		[name],
		function(err, users) {
			util.log('Name: ' + name + ' matches: ' + users.length);

			if(users.length > 0) {
				util.log(util.format('User already exists'));
				res.send(409);
				return;
			} else {
				connection.query(
					'INSERT INTO users (nickname) values (?)',
					[name],
					function(err, result) {
						util.log(util.format(result));
						if(!err) {
							util.log(util.format('Result: %j', result));
							res.send(201, ''+result.insertId);
						} else {
							util.log(util.format('Error: %j', err));
							res.send(500, ''+err);
						}
					}
				);
			}
		}
	);
});

// Create a new leaderboard entry
app.post('/leaderboard', function(req, res) {
	var leaderboard_entry = req.body;
	leaderboard_entry = {
		user_id: leaderboard_entry.user_id,
		score: leaderboard_entry.score,
		date: leaderboard_entry.date,
		difficulty: leaderboard_entry.difficulty,
		instrument: leaderboard_entry.instrument,
		game: leaderboard_entry.game
	}

	util.log(util.format('Received %j', leaderboard_entry));

	connection.query(
		'INSERT INTO leaderboard (user_id, score, date, difficulty, instrument, game) values (?,?,?,?,?,?)',
		[leaderboard_entry.user_id, 
		leaderboard_entry.score, 
		leaderboard_entry.date, 
		leaderboard_entry.difficulty, 
		leaderboard_entry.instrument, 
		leaderboard_entry.game],
		function(err, result) {
			if(!err) {
				util.log(util.format('Result: %j', result));
				res.send(201, ''+result.insertId);
			} else {
				util.log(util.format('Error: %j', err));
				res.send(500, ''+err);
			}
		}
	);
});

// Gets all of the leaderboard entries with their nicknames
app.get('/leaderboard', function(req, res) {
	connection.query(
		'SELECT `leaderboard`.score, date, difficulty, instrument, game, `users`.nickname ' +
		'FROM leaderboard ' + 
		'JOIN users ON `leaderboard`.user_id = `users`.id',
		function(err, leaderboard) {
			if(!err) {
				util.log(util.format('Result: %j', leaderboard));
				res.send(200, leaderboard);
			} else {
				util.log(util.format('Error: %j', err));
				res.send(500, err);
			}
		}
	);
});


var nodeport = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var nodeip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(nodeport, nodeip);
util.log("Listening...");
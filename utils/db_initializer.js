var mysql = require('mysql'),
	async = require('async'),
	configUtils = require('./config_utils'),
	dbUtils = require('./db_utils');

var User = require('../model/User');
var Order = require('../model/Order');
var Master = require('../model/Master');

var log = require('./logger').getLogger();

const DROP_DB_QUERY = "DROP DATABASE easy_wow_db";
const CREATE_DB_QUERY = "CREATE DATABASE IF NOT EXISTS easy_wow_db CHARACTER SET utf8 COLLATE utf8_general_ci";
const USE_DB_QUERY = "use easy_wow_db";

exports.init = function(){
	var connectionParameters = configUtils.getConfig().mySQLServer.connectionParameters;
	var connection = mysql.createConnection({
		host     : connectionParameters.host,
		user     : connectionParameters.user,
		password : connectionParameters.password
	});

	async.waterfall(
		[
			function(callback){ execteQuery(connection, DROP_DB_QUERY, callback); },
			function(callback){ execteQuery(connection, CREATE_DB_QUERY, callback); },
			//function(callback){ execteQuery(connection, USE_DB_QUERY, callback);  },
			function(callback){ createObjects(connectionParameters, callback); }
		],
		function (err, result) {
			log.debug('init done');
		}
	);
}

function execteQuery(connection, query, callback) {
	log.debug("Execute query: ", query);
	connection.query(query, function(err, result) {

		if(err != null) {
			log.error(err);
		}

		if(callback != null) {
			callback();
		}
	});
}

function createObjects(connectionParameters, callback) {

	var sequelize = dbUtils.getSequelize();

	User.initModel(sequelize);
	Order.initModel(sequelize);
	Master.initModel(sequelize);

	sequelize.sync()
		.then(() => User.bulkCreate([{
			login: 'a',
			name: 'Admin',
			type: User.ADMIN_USER_TYPE_ID,
			birthday: new Date(1980, 6, 20),
			phoneNumber: '+79009009090'
		},{
			login: 'guest',
			name: 'guest',
			type: User.SIMPLE_USER_TYPE_ID,
			birthday: new Date(1980, 6, 20),
			phoneNumber: '+79000000000'
		}]))
		.then(() => {
			sequelize.sync()
				.then(() => Master.bulkCreate([{
					name: 'Gordon Freeman',
					description: 'Парикмахер-стажер, но получается качественно, сам удивляется как так.',
					pathToImage: '/images/masters/master1.png'
				},{
					name: 'Ulfric Stormcloak',
					description: 'Косметолог. Особый подход, если вы за братьев бури!',
					pathToImage: '/images/masters/master2.png'
				},{
					name: 'Lara Croft',
					description: 'Визажист, секретные техники и натуральные материалы.',
					pathToImage: '/images/masters/master3.png'
				},{
					name: 'Alyx Vance',
					description: 'Лучший маникюр из City 17!',
					pathToImage: '/images/masters/master4.png'
				}]))
				.then(() => {
					callback();
				});
		});
}
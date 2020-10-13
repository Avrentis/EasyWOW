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
//const USE_DB_QUERY = "use easy_wow_db";

exports.init = function(){
	var connectionParameters = configUtils.getConfig().mySQLServer.connectionParameters;
	var connection = mysql.createConnection({
		host     : connectionParameters.host,
		user     : connectionParameters.user,
		password : connectionParameters.password
	});

	if(configUtils.getConfig().recreateDBOnStartup) {
		async.waterfall(
			[
				function (callback) {
					execteQuery(connection, DROP_DB_QUERY, callback);
				},
				function (callback) {
					execteQuery(connection, CREATE_DB_QUERY, callback);
				},
				//function(callback){ execteQuery(connection, USE_DB_QUERY, callback);  },
				function (callback) {
					createObjects(callback);
				}
			],
			function (err, result) {

			}
		);
	} else {
		initSequalize();
		log.debug('init done');
	}
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

function initSequalize() {
	var sequelize = dbUtils.getSequelize();

	User.initModel(sequelize);
	Master.initModel(sequelize);
	Order.initModel(sequelize);

	return sequelize;
}

function createObjects(callback) {

	sequelize = initSequalize();

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
		},{
			login: 'mk',
			name: 'Михаил Коршунов',
			type: User.SIMPLE_USER_TYPE_ID,
			birthday: new Date(1999, 6, 21),
			phoneNumber: '+79515583820'
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
					sequelize.sync()
						.then(() => Order.bulkCreate([{
							name: 'Михаил Коршунов',
							phoneNumber: '+79515583820',
							description: 'Здравствуйте!\nДавно хотел покрасить волосы на в радугу! Сколько будет стоить?\nА ещё причёску как на фотке в вк.',
							status: Order.OPEN_STATUS_ID,
							startAt: new Date(2020, 8, 23, 11, 0)
						},
						{
							name: 'Михаил Коршунов',
							phoneNumber: '+79515583820',
							description: 'Здравствуйте! После покраски, думаю можно и в солярий!',
							status: Order.OPEN_STATUS_ID,
							startAt: new Date(2020, 8, 23, 13, 30)
						}]))
						.then(() => {
							callback();
						});
				});
		});
}
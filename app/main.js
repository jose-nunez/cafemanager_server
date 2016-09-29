/**************************************
CAFE MANAGER
Local server
*****************************************/
'use strict';
var config;
var SERVER_PATH_FULL = process.cwd()+'/';
var SERVER_PATH_LOCAL = '';

var db;

// INICIA SERVIDOR ___________________________________--
var Promise = require('promise');

config = require('jsonfile').readFileSync(SERVER_PATH_LOCAL+'config.json', 'utf8');
global.server_log = function(){if(config.debug){console.log('['+formatDate(new Date())+'] '); for(var i in arguments){ console.log(arguments[i]); }}}
server_log('Leido archivo de configuracion');

server_log('Iniciando base de datos');
// db = startDataBase();

server_log('Iniciando servidor');
startServer(db);


function startDataBase(){
	var db = require(SERVER_PATH_FULL + 'db_manager.js');
	db.start(SERVER_PATH_LOCAL + config.commerce_name+'.cmdb');
	return db;
}


function startServer(db){
	var puerto = 3165; //CAFE=3165
	var	app = require('express')();
	var http = require("http").createServer(app);

	// CROSS ORIGIN REQUESTS, SOLO TESTING
	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	// var cors = require('cors');
	// app.use(cors());


	http.listen(puerto,function() {
		server_log("Iniciado en http://localhost:"+puerto);
	});
	
	var io = openSockets(http,db);
	publishServices(app,db,io);
}

function publishServices(app,db,io){
	
	app
	.get('/',function(req,res){
		res.send('Cafe Manager Server is running and listening<br/>['+ new Date() +']');
	})
	.get('/config',function(req,res){
		res.send(JSON.parse(require('fs').readFileSync(SERVER_PATH_LOCAL+'app_config.json', 'utf8')))
	})
	.get('/i18n',function(req,res){
		translate(res,req.query.lang);
	})
	.get('/get',function(req,res){
		server_log('recibida solicitud. Last updated:'+req.query.date);
		get(req.query.type,req.query.date).then(function(result){
			res.send(result);
		},handleError);
	})
	.get('/update',function(req,res){
		var obj = JSON.parse(req.query.obj);
		var id = obj.id;
		var data = obj.data;

		update(req.query.type,req.query.obj).then(function(result){
			server_log('enviando datos actualizados');
			io.emit('datasent',result);
		},handleError);

	})
	;
}

function openSockets(http,db){
	var io = require('socket.io')(http);

	io.on('connection', function(socket){
		server_log('conexion establecida.');

		socket.on('disconnect', function(){
			server_log('conexión cerrada');
		});

		socket.on('get', function(params){
			server_log('recibida solicitud. Last updated:'+params.date);
			get(params.type,params.date).then(function(result){
				server_log('enviando datos');
				socket.emit('datasent',result);
			},handleError);
		});


		socket.on('update', function(params){
			update(params.type,params.obj).then(function(result){
				server_log('enviando datos actualizados');
				io.emit('datasent',result);
			},handleError);
		});
	});

	return io;
}

function get(type,date){
	// UNA CHUCHUFLETA DEL PORTE DE UN BUQUE
	var now = formatDate(new Date((new Date()).toISOString().replace('T',' ').replace('Z','')));
	
	server_log('iniciando lectura');
	/**************************************************************************************/
	/*var promesa = new Promise(function(resolve, reject){
		db.get(type,{date:date}).then(function(result){
			if(result.count>0){
				server_log('datos obtenidos');
			}
			else{
				server_log('no hay datos');
			}
			result.date = now;
			
			resolve(result);
		},function(err){reject(err);});
	});*/

	/**************************************************************************************/
	var promesa = new Promise(function(resolve, reject){
		resolve(require('jsonfile').readFileSync('el_barista.json','utf8'));
	});
	/**************************************************************************************/

	

	return promesa;
}

function update(type,obj){
	var promesa = new Promise(function(resolve, reject){
		db.update(type,obj).then(function(result){
			resolve(result);
		},function(err){reject(err);});

	});
	return promesa;
}

function handleError(err){
	server_log('un errorcillo',err,err.stack);
	throw err;
}

/* --------------------------------------------------------------------------------------------------------------- */

function formatDate(date){
	var month = date.getMonth()+1; if(month<10) day = '0'+month;
	var day = date.getDate(); if(day<10) day = '0'+day;
	var hours = date.getHours(); if(hours<10) hours = '0'+hours;
	var minutes = date.getMinutes(); if(minutes<10) minutes = '0'+minutes;
	var seconds = date.getSeconds(); if(seconds<10) seconds = '0'+seconds;

	return date.getFullYear()+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
}

function translate(res,lang){
	if(!lang) {
        res.status(500).send();
        return;
    }
    try {
		server_log('imprimemelo '+SERVER_PATH_FULL+'lang/'+lang+'.json');
        var file = require(SERVER_PATH_FULL+'lang/'+lang+'.json');
        res.send(file); // `lang ` contains parsed JSON
    } catch(err) {
        res.status(404).send();
    }
}

/* --------------------------------------------------------------------------------------------------------------- */
function randomNumber(min,max){
	if(!min) min = 0;
	if(!max) max = 100;
	return Math.floor(Math.random()*(max-min+1)+min);
}

function genUID(){
	var UID;
	while((UID=Math.random().toString(36).substr(2,16)).length<16){
		//itera
		;
	}
	return UID;
}
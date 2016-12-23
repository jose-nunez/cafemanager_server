/**************************************
CAFE MANAGER
Model definitions
*****************************************/
// var what = Object.prototype.toString;

var async = require('async');
var Promise = require('promise');
var db = {};

db.start = function(db_filepath){
	var Sequelize = require('sequelize');
	var sequelize = new Sequelize(null,null,null,{
		dialect:'sqlite',
		storage:db_filepath,
		underscored: true,
		logging: false,
		define: {
			freezeTableName: true,
			timestamps:true,
			createdAt:'created',
			updatedAt:'updated'
		}
	});

	var model_names = require('fs').readdirSync('./data_models');
	async.map(model_names,
		function(model_name,callback) {
			callback(undefined,[model_name.split('.')[0], sequelize.import('./data_models/'+model_name)]);
		},
		function(err,models) {
			for (var attrname in models) { db[models[attrname][0]] = models[attrname][1]; }


			/* ACTUALIZAR A MANO EN TODOS LOS MODELOS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			unique:'codigo_UNIQUE'
			primaryKey: true,autoIncrement: true
			primaryKey: true, // en tablas de asociación


			modifier_extra_single:
			    id: {
			    type: new DataTypes.VIRTUAL(DataTypes.STRING, ['single_id','extra_id','modifier_id']),
			    get: function() {
			      return this.get('single_id')+'|'+this.get('single_id')+'|'+this.get('modifier_id');
			    }
			  },
			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/


			// HOOKS ________________________________________
			/*db.single.afterFind(function(result,options){
				//CUCHUFLETA!!!!
				var packs;
				if(what.call(result)==='[object Array]'){
					for(var i in result){
						result[i].dataValues.packs = [];
						var prod = result[i];
						prod.getPacks().then(function(packs){
							for(var j in packs){
								prod.dataValues.packs.push({id:packs[j].id});
							}	
						});
						
						
					}
				}
				else{ 
					result.dataValues.packs = [];
					packs = result.getPacks();
					for(var j in packs){
						result.dataValues.packs.push({id:packs[j].id});
					}
				}
			});*/

			// ASSOCIATIONS __________________________________
			// parent category
			db.category.hasMany(db.category,{as:'children',foreignKey:'parent'});
			
			// category/single
			db.single.belongsToMany(db.category,{through:db.category_single,foreignKey:'single_id'});
			db.category.belongsToMany(db.single,{through:db.category_single,foreignKey:'category_id'});
			// category/pack
			db.pack.belongsToMany(db.category,{through:db.category_pack,foreignKey:'pack_id'});
			db.category.belongsToMany(db.pack,{through:db.category_pack,foreignKey:'category_id'});
			// price/single
			db.single.hasMany(db.price,{foreignKey:'single_id'});
			db.price.belongsTo(db.single,{foreignKey:'single_id'});
			// price/pack
			db.pack.hasMany(db.price,{foreignKey:'pack_id'});
			db.price.belongsTo(db.pack,{foreignKey:{name:'pack_id'}});
			// single/pack
			db.single.belongsToMany(db.pack,{through:db.price,foreignKey:'single_id'});
			db.pack.belongsToMany(db.single,{through:db.price,foreignKey:{name:'pack_id'}});


			// price/modifier_extra_single
			db.single.hasMany(db.modifier_extra_single,{foreignKey:'single_id'});
			db.modifier_extra_single.belongsTo(db.single,{foreignKey:'single_id'});
			// extra/modifier_extra_single
			db.extra.hasMany(db.modifier_extra_single,{foreignKey:'extra_id'});
			db.modifier_extra_single.belongsTo(db.extra,{foreignKey:'extra_id'});
			// modifier/modifier_extra_single
			db.modifier.hasMany(db.modifier_extra_single,{foreignKey:'modifier_id'});
			db.modifier_extra_single.belongsTo(db.modifier,{foreignKey:'modifier_id'});

			// single/extra
			db.single.belongsToMany(db.extra,{through:db.modifier_extra_single,foreignKey:{name:'single_id'}});
			db.extra.belongsToMany(db.single,{through:db.modifier_extra_single,foreignKey:{name:'extra_id'}});
			// single/modifier
			db.single.belongsToMany(db.modifier,{through:db.modifier_extra_single,foreignKey:{name:'single_id'}});
			db.modifier.belongsToMany(db.single,{through:db.modifier_extra_single,foreignKey:{name:'modifier_id'}});


			sequelize.sync().then(function() {
			});
		}
	);
	db.sequelize = sequelize;
}

db.plural = {
	single: 'singles',
	pack: 'packs',
	price: 'prices',
	category: 'categories',
	extra: 'extras',
};

db.singular = {
	singles: 'single',
	packs: 'pack',
	prices: 'price',
	categories: 'category',
	extras: 'extra',
};

db.setQueryOptions = function(opt){
	var where;
	if(opt){
		if(opt.lastUpdated){ if(!where) where = {};
			where.updated = {$gt:opt.lastUpdated};
		}
		if(opt.id){ if(!where) where = {};
			where.id = opt.id;
		}
	}
	return where;
}

db._get_singles = function(opt){
	var db = this;
	server_log('leyendo singles');
	var options = {
		include:[
			// {model:db.pack,attributes:['id'],through:{attributes: []}},
			{model:db.price,attributes:['id']},
			{model:db.category,attributes:['id'],through:{attributes: []}},
			{model:db.modifier_extra_single,attributes:['id']},
			/*{model:db.extra,attributes:['id'],through:{attributes: []}},
			{model:db.modifier,attributes:['id'],through:{attributes: []}},*/
		]
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.single.findAll(options).then(function(result){
			server_log('obtenidos singles');
			resolve({singles:result});
		},function(err){ reject(err);});
	});
	return promesa;
}

db._get_packs = function(opt){
	var db = this;
	server_log('leyendo packs');
	var options = {
		include:[
			{model:db.single,attributes:['id'],through:{attributes: []}},
			{model:db.price,attributes:['id']},
			{model:db.category,attributes:['id'],through:{attributes: []}},
		]
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.pack.findAll(options).then(function(result){
			server_log('obtenidos packs');
			resolve({packs:result});
		},function(err){ reject(err);});
	});
	return promesa;
}

db._get_categories = function(opt){
	var db = this;
	server_log('leyendo categorias');
	var options = {
		include:[
			{model:db.single,attributes:['id'],through:{attributes: []}},
			{model:db.pack,attributes:['id'],through:{attributes: []}},
			{model:db.category,as:'children',attributes:['id']},
		]
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.category.findAll(options).then(function(result){
			server_log('obtenidas categorias');
			resolve({categories:result});
		},function(err){ reject(err);});
	});	
	return promesa;
}

db._get_prices = function(opt){
	var db = this;
	server_log('leyendo precios');
	var options = {
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.price.findAll(options).then(function(result){
			server_log('obtenidos precios');
			resolve({prices:result});
		},function(err){ reject(err);});
	});
	return promesa;
}

db._get_modifier_extra_singles = function(opt){
	var db = this;
	server_log('leyendo modificadores_extra_single');
	var options = {
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.modifier_extra_single.findAll(options).then(function(result){
			server_log('obtenidos modificadores_extra_single');
			resolve({modifier_extra_singles:result});
		},function(err){ reject(err);});
	});
	return promesa;
}

db._get_extras = function(opt){
	var db = this;
	server_log('leyendo extras');
	var options = {
		include:[
			{model:db.modifier_extra_single,attributes:['id']},
		],
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.extra.findAll(options).then(function(result){
			server_log('obtenidos extras');
			resolve({extras:result});
		},function(err){ reject(err);});
	});
	return promesa;
}

db._get_modifiers = function(opt){
	var db = this;
	server_log('leyendo modifiers');
	var options = {
		include:[
			{model:db.modifier_extra_single,attributes:['id']},
		]
	};
	options.where = db.setQueryOptions(opt)

	var promesa = new Promise(function(resolve, reject) {
		db.modifier.findAll(options).then(function(result){
			server_log('obtenidos modifiers');
			resolve({modifiers:result});
		},function(err){ reject(err);});
	});
	return promesa;
}

db._get_all = function(opt,elements){
	var db = this;
	server_log('iterando unidades');
	var promesa = new Promise(function(resolve, reject) {
		
		if(!elements) elements = ([]).concat(db._get_all_product_list); //AGREGAR LOS OTROS ALL_*
		
		async.map(elements,function(element,callback){
			db[element](opt).then(function(result){callback(undefined,result);},function(err){callback(err);});
		},function(err,elems){
			server_log('fin iteracion unidades');
			if(err) reject(err);
			else{
				var result = {};
				for(var i in elems){
					for(var j in elems[i]){
						result[j] = elems[i][j];
					}	
				}
				resolve(result);
			} 
		});
	});
	return promesa;
}

// GetTypes
db._get_all_product_list = ['_get_singles','_get_packs','_get_categories','_get_prices','_get_extras','_get_modifiers','_get_modifier_extra_singles'];

db._get_all_product = function(opt){
	var db = this;
	return db._get_all(opt,db._get_all_product_list);
}

db.get = function(type,opt){
	var db = this;
	var promesa = new Promise(function(resolve, reject){
		db['_get_'+type](opt).then(function(result){			
			var count = 0;
			for(var i in result){
				count += result[i].length;
			}

			result.count = count;

			resolve(result);
		},function(err){reject(err);});
		
	});
	return promesa;
}


db._update_unit = function(type,obj){
	var db = this;
	var id = obj.id;
	var promesa = new Promise(function(resolve, reject){
		db[type].update(obj,{where:{id:id}}).then(function(count){
			server_log('actualice '+count+' '+db.plural[type]);
			resolve();

		},function(err){reject(err);});
	});
	return promesa;
}


db.update = function(type,obj){
	var db = this;
	var id = obj.id;
	var promesa = new Promise(function(resolve, reject){
		db['_update_unit'](type,obj).then(function(){
			db.get(db.plural[type],{id:id}).then(function(result){
				resolve(result);
			},function(err){reject(err);});
			
		},function(err){reject(err);});
		
	});
	return promesa;
}

module.exports = db;



function pueblamelo(db){
	
	/*db.category.create({name:'Entiende bien veno lo que digo'}).then(function(result){window.c1 = result; });
	db.category.create({name:'si no cortay pa otro lao'}).then(function(result){window.c2 = result; });
	db.category.create({name:'me pelie hasta con los pacos'}).then(function(result){window.c3 = result; });
	db.category.create({name:'bailando cueca aperrao'}).then(function(result){window.c4 = result; });

	db.single.create({code:98786,name:'Pepin con leche'}).then(function(result){window.p1 = result; });*/
	/*
	p1.addCategory(c1);
	p1.addCategory(c2);
	p1.getCategories().then(function(r){window.r = r;server_log(r);});


	db.price.find({where: {id: 1},include:[db.single,db.pack]}).then(function(r){window.presi = r; server_log(r) });
	


	db.category.findById(1).then(function(r){window.cati = r; server_log(r) });
	cati.getChildren().then(function(r){window.hijitos = r; server_log(r) });

	db.single.findById(74).then(function(r){window.produ = r; server_log(r) });

	db.single.findById(74).then(function(r){ r.getPacks().then(function(r){window.r = r;server_log(r);}) });


	produ.getPrices().then(function(r){window.r = r;server_log(r);})
	produ.getPacks().then(function(r){window.r = r;server_log(r);})
	
	db.pack.findById(1).then(function(r){window.packo = r; server_log(r) });
	packo.getSingles().then(function(r){window.r = r;server_log(JSON.stringify(r));})
	
	db.price.findById(1,{attributes:{include:[['single_id','_single_id']]}}).then(function(r){window.presi = r; server_log(r) });
	
	db.category.find({where: {id: 11},include:[{model:db.category,as:'children',attributes:['id']}]}).then(function(r){ window.r = r;server_log(r);});
	

	db.pack.find({where: {id: 1},include:[{model:db.single,attributes:['id'],through: {attributes: []}}]}).then(function(r){ window.r = r;server_log(r);});
	db.single.find({where: {id: 74},include:[{model:db.pack,attributes:['id'],through: {attributes: []}}]}).then(function(r){ window.r = r;server_log(r);});
	


	
	db.single.find({where: {id:387},include:[{model:db.pack,attributes:['id'],through:{attributes: []}}]}).then(function(result){window.singletito = result});
	singletito.packs;
	singletito.getPacks().then(function(result){window.packs = result});
	singletito.getPacks().then(function(result){window.packs = result});
	packs[0].getSingles().then(function(result){window.singles = result});


	
	db.pack.find({where: {id:1}}).then(function(result){window.myresult = result;},function(err){server_log(err)});


	db._get_singles({id:1}).then(function(result){window.myresult = result;},function(err){server_log(err)});

	db._get_prices({id:1}).then(function(result){window.myresult = result;});
	db._get_categories({id:1}).then(function(result){window.myresult = result;});
	db._get_packs({id:1}).then(function(result){window.myresult = result;});



	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	


	db.single.find({where: {id:387},include:[{model:db.pack}]}).then(function(my_single){
		window.my_single = my_single;
		server_log(my_single.packs); // Empty array
		my_single.getPacks().then(function(result){server_log(result);}); // It does work. Array with packs
	});

	db.pack.find({where: {id:1},include:[{model:db.single}]}).then(function(my_pack){
		my_pack.getSingles().then(function(result){server_log(result);});
		server_log(my_pack.singles);
	});

	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	

	db.single.find({
		where:{updated:{$gte:new Date()}}
	}).then(function(my_singles){
		server_log(my_singles);
	},function(err){
		server_log(err);
	});

	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	

	db.single.update({ name: 'Theatre of tragedy' },{ where: { id: 1 }}).then(function(affectedRows){server_log('listoco');});

	*/
}
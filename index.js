
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter');

/**
 * `MongodbAdapter` constructor.
 */

var MongodbAdapter = adapter('mongodb')
  .type('string')
  .type('text')
  .type('date')
  .type('float')
  .type('integer')
  .type('number')
  .type('boolean')
  .type('bitmask')
  .type('array');

MongodbAdapter.prototype.find = function(criteria, callback){

}

MongodbAdapter.prototype.all = function(criteria, callback){

}

MongodbAdapter.prototype.insert = function(criteria, callback){

}

MongodbAdapter.prototype.update = function(criteria, callback){

}

MongodbAdapter.prototype.remove = function(criteria, callback){

}

MongodbAdapter.prototype.exists = function(criteria, callback){

}

MongodbAdapter.prototype.count = function(criteria, callback){

}

MongodbAdapter.prototype.connect = function(callback){

}

MongodbAdapter.prototype.disconnect = function(callback){

}

MongodbAdapter.prototype.execute = function(callback){

}
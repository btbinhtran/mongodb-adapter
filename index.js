
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , mongodb = require('mongodb')
  , stream = require('tower-stream');

/**
 * Expose `mongodb` adapter.
 */

exports = module.exports = adapter('mongodb');

/**
 * Define MongoDB adapter.
 */

exports
  .type('string')
  .type('text')
  .type('date')
  .type('float')
  .type('integer')
  .type('number')
  .type('boolean')
  .type('bitmask')
  .type('array');

/**
 * XXX: Switch database.
 */

exports.use = function(name){
  exports.database = name;
  return exports;
}

/**
 * Find.
 */

stream('mongodb.find', find);

/**
 * Mongodb `create` operation (insert).
 */

stream('mongodb.create', create);
stream('mongodb.update', update);
stream('mongodb.remove', remove);

// there should probably be mini optimizations here,
// such as `mongodb-find` and `mongodb-find-for-join`, etc.
stream('mongodb.stream')
  .on('open', function(context, data, next){
    context.query = context.client.collection(context.collectionName).find().stream();
    context.query.pause();
    context.query
      .on('data', function(record){
        context.query.pause();
        context.emit('data', record);
        context.exec();
      })
      .on('close', function(){
        context.close();
        context.next();
      });

    next();
  })
  .on('exec', function(context, data, next){
    context.next = next;
    context.query.resume();
  });

/**
 * Execute a database query.
 */

exports.exec = function(query, fn){
  var client = exports.connections[exports.database];
  if (!client) throw new Error('Not connected to a database');

  var action = stream('mongodb.' + query.type).create({
    query: query,
    client: client,
    collection: client.collection(query.selects[0].model)
  });

  process.nextTick(function(){
    action.exec(fn);
  });

  return action;
}

/**
 * Connect to a database.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.connect = function(name, fn){
  if (this.connections[name]) return fn(null, this.connections[name]);

  var self = this
    , db = new mongodb.Db(name, new mongodb.Server('127.0.0.1', 27017, {}), { safe:false });

  db.open(function(err, client){
    if (err) return fn(err);
    self.connections[name] = client;
    // XXX: not sure the best way to do this.
    if (!exports.database) exports.database = name;
    fn(null, client);
  });

  return this;
}

/**
 * Disconnect from a database.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.disconnect = function(name, fn){
  if (this.connections[name]) {
    this.connections[name].close();
    delete this.connections[name];
    if (name === exports.database)
      delete exports.database;
    process.nextTick(fn);
  } else {
    fn();
  }
}

function find(context, data, fn) {
  var conditions = {};
  context.query.constraints;

  context.collection.find(conditions).toArray(function(err, docs){
    // deserialize.
    context.emit('data', docs);
    fn();
  });
}

function create(context, data, fn) {
  context.collection.insert(context.query.data, function(err, docs){
    context.emit('data', docs);
    fn();
  });
}

function update(context, data, fn) {
  var updates = context.query.data;
  var constraints = {};

  context.collection.update(constraints, updates, function(err, docs){
    context.emit('data', docs);
    fn();
  });
}

function remove(context, data, fn) {
  var constraints = {};
  
  context.collection.remove(constraints, function(err, docs){
    context.emit('data', docs);
    fn();
  });
}
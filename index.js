
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , topology = require('tower-topology')
  , Topology = topology('mongodb')
  , mongodb = require('mongodb')
  , action = require('tower-stream')
  , queryToTopology = require('tower-query-to-topology');

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
 * Mongodb `create` operation (insert).
 */

action('mongodb.create')
  .on('exec', function(node, data, fn){
    collections[data.name].insert(data.records, fn);
  });

action('mongodb.update');
action('mongodb.remove');

// there should probably be mini optimizations here,
// such as `mongodb-find` and `mongodb-find-for-join`, etc.
action('mongodb.query')
  .on('open', function(context, data, next){
    exports.connect('test', function(error, client){
      context.query = client.collection(context.collectionName).find().stream();
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
    });
  })
  .on('exec', function(context, data, next){
    context.next = next;
    context.query.resume();
  })
  .on('close', function(){
    exports.disconnect('test', function(){});
    //console.log('closed query!');
  });

/**
 * Execute a database query.
 */

exports.execute = function(constraints, fn){
  var topology = queryToTopology('mongodb', constraints);

  // XXX: need to come up w/ API for adding events before it's executed.
  process.nextTick(function(){
    topology.exec();
  });

  return topology;
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
    process.nextTick(fn);
  } else {
    fn();
  }
}

/**
 * Create a database/collection/index.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.create = function(name, fn){

}

/**
 * Update a database/collection/index.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.update = function(name, fn){

}

/**
 * Remove a database/collection/index.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.remove = function(name, fn){

}

/**
 * Find a database/collection/index.
 *
 * @param {String} name
 * @param {Function} fn
 * @api public
 */

exports.find = function(name, fn){

}
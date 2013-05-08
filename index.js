
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

exports.use = function(name, fn){

}

/**
 * Mongodb `create` operation (insert).
 */

stream('mongodb.create', create);
stream('mongodb.update');
stream('mongodb.remove');

// there should probably be mini optimizations here,
// such as `mongodb-find` and `mongodb-find-for-join`, etc.
stream('mongodb.find')
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

exports.exec = function(query, fn){
  var action = stream('mongodb.' + query.type).create({
    query: query,
    collectionName: query.selects[0].model
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

function create(context, data, fn){
  exports.connect('test', function(error, client){
    var collection = client.collection(context.collectionName);
    collection.insert(context.query.data, function(err, records){
      context.emit('data', records);
      fn();
    });
  });
}
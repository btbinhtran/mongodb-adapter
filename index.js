
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , topology = require('tower-topology')
  , Topology = topology('mongodb')
  , mongodb = require('mongodb')
  , stream = require('tower-stream') // http://nodejs.org/api/stream.html
  , ReadableStream = stream.Readable;

/**
 * Expose `mongodb` adapter.
 */

var exports = module.exports = adapter('mongodb');

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
 * Mongodb `insert` operation.
 */

stream('mongodb-insert')
  .on('execute', function(node, data, fn){
    collections[data.name].insert(data.records, fn);
  });

stream('mongodb-update');
stream('mongodb-remove');

// there should probably be mini optimizations here,
// such as `mongodb-find` and `mongodb-find-for-join`, etc.
stream('mongodb-find')
  .on('open', function(context, data, next){
    var db = new mongodb.Db('test', new mongodb.Server("127.0.0.1", 27017, {}), {});
    db.open(function(err, client){
      context.query = client.collection(context.collectionName).find().stream();
      context.query.pause();
      context.query
        .on('data', function(record){
          context.emit('data', record);
          //context.query.pause();
          context.next();
        })
        .on('close', function(){
          context.close();
          context.next();
        });

      next();
    });
  })
  .on('execute', function(context, data, next){
    context.next = next;
    context.query.resume();
  })
  .on('close', function(){
    //console.log('closed query!');
  });

/**
 * Execute a database query.
 */

exports.execute = function(query, fn){
  var topology = new Topology;

  // XXX: group the query into a network of inputs/outputs.
  for (var i = 0, n = query.length; i < n; i++) {
    topology.stream('mongodb-find', { collectionName: query[i][1] })
    topology.execute();
    // topology.edge('posts', 'comments');
    // topology.node('posts', function() {})
  }

  if (fn) fn();

  return topology;
}

/**
 * Create a database/collection/index.
 */

exports.create = function(name, fn){

}

/**
 * Update a database/collection/index.
 */

exports.update = function(name, fn){

}

/**
 * Remove a database/collection/index.
 */

exports.remove = function(name, fn){

}

/**
 * Find a database/collection/index.
 */

exports.find = function(name, fn){

}
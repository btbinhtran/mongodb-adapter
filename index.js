
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

stream('mongodb-find')
  .on('init', function(context, data){

  })
  .on('execute', function(context, data, fn){
    var db = new mongodb.Db('test', new mongodb.Server("127.0.0.1", 27017, {}), {});
    db.open(function(err, client){
      // data.name
      context.query = client.collection('posts').find().stream();
      //context.query.pause();
      context.query
        .on('data', function(record){
          console.log('data');
          // context.query.pause();
          context.emit('data', record);
        })
        .on('close', function(){
          context.close();
          fn();
        });
        
      //context.query.resume();
    });
  });

/**
 * Execute a database query.
 */

exports.execute = function(query, fn){
  var topology = new Topology;

  // XXX: group the query into a network of inputs/outputs.
  for (var i = 0, n = query.length; i < n; i++) {
    if (i == 0) {
      topology.streams = [{ name: 'mongodb-find', inputs: [], outputs: [] }];
      topology.execute({ name: query[i][1] });
    }
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
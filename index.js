
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , topology = require('tower-topology')
  , Topology = topology('mongodb')
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
    context.query = collections[data.name].find(data.conditions).stream();
    context.query.pause();
  })
  .on('execute', function(context, data, fn){
    context.query
      .on('data', function(record){
        // query.pause();
        context.emit('data', record);
      });
  });

/**
 * Execute a database query.
 */

exports.execute = function(query, fn){
  var topology = new Topology;

  // XXX: group the query into a network of inputs/outputs.
  for (var i = 0, n = query.length; i < n; i++) {
    // topology.edge('posts', 'comments');
    // topology.node('posts', function() {})
  }

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
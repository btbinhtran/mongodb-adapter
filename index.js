
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , topology = require('tower-topology')
  , stream = require('stream') // http://nodejs.org/api/stream.html
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
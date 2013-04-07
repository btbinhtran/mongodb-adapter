
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , stream = require('stream')
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

exports.execute = function(criteria, fn){

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
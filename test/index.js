var mongodb = require('..')
  , assert = require('assert');

describe('mongodb adapter', function(){
  before(function(done){
    mongodb.connect('test', done);
  });

  it('should create', function(done){
    mongodb.query()
      .select('post')
      .create(function(err, records){
        done();
      }).on('data', function(){
        console.log(arguments);
        done();
      });
  });

  it('should find', function(done){
    mongodb.query()
      .select('post')
      .find(function(err, records){
        done();
      }).on('data', function(){
        console.log(arguments);
        done();
      });
  });

  it('should update', function(done){
    mongodb.query()
      .select('post')
      .update(function(err, records){
        done();
      }).on('data', function(){
        console.log(arguments);
        done();
      });
  });

  it('should remove', function(done){
    mongodb.query()
      .select('post')
      .remove(function(err, records){
        done();
      }).on('data', function(){
        console.log(arguments);
        done();
      });
  });
});
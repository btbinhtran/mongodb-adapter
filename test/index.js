var mongodb = require('..')
  , assert = require('assert');

describe('mongodb adapter', function(){
  it('should create', function(done){
    mongodb.query()
      .select('post')
      .create(function(err, records){
        console.log(arguments)
        done();
      });
  });
});
var mongodb = require('..')
  , assert = require('assert');

describe('mongodb adapter', function(){
  before(function(done){
    mongodb.connect('test', done);
  });

  it('should create', function(done){
    var attrs = [
      { title: 'Foo' },
      { title: 'Bar' },
      { title: 'Baz' }
    ];

    mongodb.query()
      .select('post')
      .create(attrs, function(err, records){
        done();
      }).on('data', function(records){
        console.log(records);
        done();
      });
  });

  it('should find', function(done){
    mongodb.query()
      .select('post')
      .where('title').eq('Bar')
      .find(function(err, records){
        done();
      }).on('data', function(records){
        console.log(records);
        done();
      });
  });

  it('should update', function(done){
    mongodb.query()
      .select('post')
      .update(function(err, records){
        done();
      }).on('data', function(records){
        console.log(records);
        done();
      });
  });

  it('should remove', function(done){
    mongodb.query()
      .select('post')
      .remove(function(err, records){
        done();
      }).on('data', function(records){
        console.log(records);
        done();
      });
  });
});
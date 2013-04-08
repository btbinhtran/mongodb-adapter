var mongodb = require('..')
  , assert = require('assert');

describe('mongodb adapter', function(){
  it('should define', function(done){
    var query = [
        ['select', 'posts']
      , ['return', 'posts']
    ];

    var topology = mongodb.execute(query);

    assert('mongodb' === topology.name);

    topology.on('data', function(data){
      done();
    });
  });
});

# Tower Mongodb Adapter

## Installation

```
npm install tower-mongodb-adapter
```

## Example

```js
var mongodb = require('tower-mongodb-adapter');

var query = [
    ['select', 'posts']
  , ['where', 'createdAt', 'lte', new Date]
  , ['return', 'posts']
];

mongodb.execute(query).on('data', function(record){
  
});
```

## Resources

- https://github.com/pereferrera/storm-feeds-example/blob/master/src/datasalt/storm/feeds/FeedTopology.java
- http://engineering.twitter.com/2011/08/storm-is-coming-more-details-and-plans.html
- https://github.com/nathanmarz/storm-starter/blob/master/src/jvm/storm/starter/WordCountTopology.java
- https://github.com/nathanmarz/storm-starter/blob/master/src/jvm/storm/starter/ReachTopology.java
- https://github.com/nathanmarz/storm-starter/tree/master/src/jvm/storm/starter/bolt
- https://github.com/nathanmarz/storm/wiki/Common-patterns
- https://github.com/nathanmarz/storm/wiki/Guaranteeing-message-processing
- https://github.com/nathanmarz/storm/wiki/Concepts

> A spout is a source of streams in a topology.
> All processing in topologies is done in bolts.
> Another important method is declareOutputFields, which declares the schema for the bolt's output tuples.
> One of the most important things that you need to do when designing a topology is to define how data is exchanged between components (how streams are consumed by the bolts). A Stream Grouping specifies which stream(s) are consumed by each bolt and how the stream will be consumed.

```java
public interface ISpout extends Serializable {
    void open(Map conf, TopologyContext context, SpoutOutputCollector collector);
    void close();
    void nextTuple();
    void ack(Object msgId);
    void fail(Object msgId);
}
```

```java
public class SplitSentence extends BaseRichBolt {
    OutputCollector _collector;
    
    public void prepare(Map conf, TopologyContext context, OutputCollector collector) {
        _collector = collector;
    }

    public void execute(Tuple tuple) {
        String sentence = tuple.getString(0);
        for(String word: sentence.split(" ")) {
            _collector.emit(tuple, new Values(word));
        }
        _collector.ack(tuple);
    }

    public void declareOutputFields(OutputFieldsDeclarer declarer) {
        declarer.declare(new Fields("word"));
    }        
}
```

```js
bolt('splitSentence')
  .attr('word', 'string') // declareOutputFields
  .init(function(options){
    this.x
  })
  .on('execute', function(b, data){
    data.val.split(' ').forEach(function(word){
      b.emit('data', word);
    });

    this.emit('success', data);
  })
  .on('data') // tuple
  .on('success') // processed input
  .on('error') // failed to process input

Bolt.prototype.execute = function()
Bolt.prototype.prepare;

spout('twitter')
  .open(function(){

  })
  .next(function(){

  })
  .close(function(){

  })
```

```js
builder.setBolt("word-counter", new WordCounter(),2)
  .fieldsGrouping("word-normalizer", new Fields("word"));

topology.bolt('word-counter')
  .from('word-normalizer', ['word'])

topology
  .node('word-counter')
    .input('word-normalizer', 'word')
```

```java
builder.setBolt("word-counter", new WordCounter(),2)
  .fieldsGrouping("word-normalizer", new Fields("word"))
  .allGrouping("signals-spout","signals");

//

public void execute(Tuple input) { String str = null;
try{ if(input.getSourceStreamId().equals("signals")){
str = input.getStringByField("action"); if("refreshCache".equals(str))
counters.clear();
}
}catch (IllegalArgumentException e) {
//Do nothing
}
```

```js
topology
  .node('signals-spout')
  .node('word-normalizer')
  .node('word-counter')
  .edge('word-normalizer', 'word-counter')
  .edge('signals-spout', 'word-counter')
```

```js
topology
  .node('signals-spout')
  .node('word-normalizer')
  .node('word-counter')
    .input('word-normalizer')
    .input('signals-spout');
```

First, you need to tell Storm whenever you're creating a new link in the tree of tuples. Second, you need to tell Storm when you have finished processing an individual tuple. By doing both these things, Storm can detect when the tree of tuples is fully processed and can ack or fail the spout tuple appropriately. 

```java
builder.setSpout("word1", new TestSpout("a"), 1); 
builder.setSpout("word2", new TestSpout("b"), 1); 
builder.setSpout("word3", new TestSpout("c"), 1); 
builder.setSpout("word4", new TestSpout("d"), 1); 

// setBolt(java.lang.String id, IBasicBolt bolt, java.lang.Number parallelism_hint) 
builder.setBolt("count", new CountBolt(), 10) 
                 .shuffleGrouping("word1") 
                 .shuffleGrouping("word2") 
                 .shuffleGrouping("word3") 
                 .shuffleGrouping("word4"); 
```

## License

MIT
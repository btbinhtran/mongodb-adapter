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

## License

MIT
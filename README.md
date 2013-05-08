# Tower Mongodb Adapter

## Installation

```bash
$ npm install tower-mongodb-adapter
```

## Examples

Selecting records:

```js
var mongodb = require('tower-mongodb-adapter');

mongodb.query()
  .select('post')
  .all(function(err, records){

  });
```

See [tower-query](https://github.com/tower/query) for more examples.

## License

MIT
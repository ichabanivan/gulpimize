## Supported ECMAScript 6

## Import

```js
//static imports
import _ from 'lodash'

// dynamic imports
require.ensure([], function() {
  let contacts = require('./contacts')
})
```

## Environments

### Main

```js
if (NODE_ENV == 'development') {
  console.log(`2 + 1 = ${2+1}`)
} else {
  console.log("!")
}
```

### Development

```js
if (true) {
  console.log(`2 + 1 = ${2+1}`)
} else {
  console.log("!")
}
```

### Production

```js
console.log("!")
```


# react-router-query-params

[![npm version](https://badge.fury.io/js/react-router-query-params.svg)](https://badge.fury.io/js/react-router-query-params)
[![Download Count](http://img.shields.io/npm/dm/react-router-query-params.svg?style=flat-square)](https://npmjs.org/package/react-router-query-params)

> Set query parameters with a schema for react-router.

## Install

```
npm install --save react-router-query-params
```

## Example

```jsx
import withQueryParams from 'react-router-query-params';
...

const ExampleComponent = ({
  queryParams,
  setQueryParams,
}) = (
  <div>
    <div>
      queryParams: {JSON.stringify(queryParams)}
    </div>

    <button onClick={() => setQueryParams({ example1: 'someQueryParam' })}>
      Set query param example
    </button>
  </div>
);

const ConnectedComponent = withQueryParams({
  stripUnknownKeys: false,
  keys: {
    example1: {
      default: 'example-1-default',
      validate: queryParam => !!queryParam && queryParam.length > 3,
    },
    example2: {
      default: (queryParam, props) => props.defaultValue,
      validate: (queryParam, props) =>
        !!queryParam && !props.disallowedValues.includes(queryParam)
    }
  }
})(ExampleComponent);
```

## API

### Props

* __`queryParams`__ (object): All current query parameters as key-value pairs in an object.

* __`setQueryParams`__ (function): Set one or more query parameters.
```js
this.props.setQueryParam({ key1: 'value1', key2: 'value2' })
```

### HoC

The library exports `withQueryParams` higher order component as default. The HoC takes a configuration object as the first argument, and has the following options:

* __`stripUnknownKeys`__ (boolean)
  * if `true`, removes keys from query parameters that are not configured with `keys`
  * default: false

* __`keys`__ (object)

#### Keys

Keys object is used to create a configuration for the query parameters that are intended to be used.

## Peer dependencies

* react
* react-router v. ^4.0.0
* react-router-dom v. ^4.0.0

## License

MIT

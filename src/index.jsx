import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import getDisplayName from 'react-display-name';

import {
  isObject,
  assert,
} from './utils';

export default function withQueryParams({
  keys,
  stripUnknownKeys = false,
  queryStringOptions,
} = {}) {
  if (keys && stripUnknownKeys) {
    assert(Object.keys(keys).length > 0, 'at least one query param key must be configured');
  }

  const QUERYPARAMS_OPTIONS = {
    arrayFormat: 'none', // one of: 'none', 'bracket', 'index',
    ...queryStringOptions,
  };

  return (Wrapped) => {
    class WithQueryParams extends PureComponent {
      static displayName = `withQueryParams(${getDisplayName(Wrapped)})`

      static propTypes = {
        location: PropTypes.shape({
          search: PropTypes.string,
          pathname: PropTypes.string,
        }).isRequired,
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired,
        }).isRequired,
      }

      setQueryParam = (...args) => {
        const {
          location,
          history,
        } = this.props;

        const values = isObject(args[0]) ? args[0] : {
          [args[0]]: args[1],
        };

        const to = history.createHref({
          pathname: location.pathname,
          search: queryString.stringify({
            ...queryString.parse(location.search, QUERYPARAMS_OPTIONS),
            ...values,
          }, QUERYPARAMS_OPTIONS),
        });

        history.push(to);
      }

      render() {
        const { location } = this.props;
        const queryParams = queryString.parse(location.search, QUERYPARAMS_OPTIONS);

        const newQueryParams = keys ? Object.keys(keys).reduce((acc, paramName) => ({
          ...acc,
          [paramName]: keys[paramName].validate(queryParams[paramName], this.props)
            ? queryParams[paramName]
            : keys[paramName].default(queryParams[paramName], this.props),
        }), {}) : queryParams;

        const allParams = stripUnknownKeys ? newQueryParams : {
          ...queryParams,
          ...newQueryParams,
        };

        const searchString = queryString.stringify(allParams, QUERYPARAMS_OPTIONS);

        if (location.search.replace('?', '') !== searchString) {
          return (
            <Redirect to={{ pathname: location.pathname, search: searchString }} />
          );
        }

        const wrappedProps = {
          location,
          setQueryParam: this.setQueryParam,
          queryParams: allParams,
        };

        return <Wrapped {...this.props} {...wrappedProps} />;
      }
    }

    return withRouter(WithQueryParams);
  };
}

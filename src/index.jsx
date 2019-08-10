import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import getDisplayName from 'react-display-name';

import { assert } from './utils';

export default function withQueryParams({
  keys,
  stripUnknownKeys = false,
  queryStringOptions,
} = {}) {
  if (keys && stripUnknownKeys) {
    assert(
      Object.keys(keys).length > 0,
      'at least one query param key must be configured'
    );
  }

  if (keys) {
    Object.keys(keys).forEach(key => {
      assert(keys[key].validate, `Missing validate function for key ${key}`);
      assert(
        typeof keys[key].validate === 'function',
        `'validate' for ${key} must be a function`
      );
    });
  }

  const QUERYPARAMS_OPTIONS = {
    arrayFormat: 'none', // one of: 'none', 'bracket', 'index',
    ...queryStringOptions,
  };

  return Wrapped => {
    class WithQueryParams extends PureComponent {
      static displayName = `withQueryParams(${getDisplayName(Wrapped)})`;

      static propTypes = {
        location: PropTypes.shape({
          search: PropTypes.string,
          pathname: PropTypes.string,
        }).isRequired,
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired,
        }).isRequired,
      };

      setQueryParams = obj => {
        const { location, history } = this.props;

        const to = history.createHref({
          pathname: location.pathname,
          search: queryString.stringify(
            {
              ...queryString.parse(location.search, QUERYPARAMS_OPTIONS),
              ...obj,
            },
            QUERYPARAMS_OPTIONS
          ),
        });

        history.push(to);
      };

      render() {
        const { location } = this.props;
        const queryParams = queryString.parse(
          location.search,
          QUERYPARAMS_OPTIONS
        );

        const newQueryParams = keys
          ? Object.keys(keys).reduce((acc, paramName) => {
              const defaultConf = keys[paramName].default;
              const defaultValue =
                typeof defaultConf === 'function'
                  ? defaultConf(queryParams[paramName], this.props)
                  : defaultConf;

              return {
                ...acc,
                [paramName]: keys[paramName].validate(
                  queryParams[paramName],
                  this.props
                )
                  ? queryParams[paramName]
                  : defaultValue,
              };
            }, {})
          : queryParams;

        const allParams = stripUnknownKeys
          ? newQueryParams
          : {
              ...queryParams,
              ...newQueryParams,
            };

        const searchString = queryString.stringify(
          allParams,
          QUERYPARAMS_OPTIONS
        );

        if (location.search.replace('?', '') !== searchString) {
          return (
            <Redirect
              to={{ pathname: location.pathname, search: searchString }}
            />
          );
        }

        const wrappedProps = {
          location,
          setQueryParams: this.setQueryParams,
          queryParams: allParams,
        };

        return <Wrapped {...this.props} {...wrappedProps} />;
      }
    }

    return withRouter(WithQueryParams);
  };
}

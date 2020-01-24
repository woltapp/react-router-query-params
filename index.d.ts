import React from 'react';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type Partial<T> = { [P in keyof T]?: T[P] };

export type InjectedQueryParams<QueryT = {}> = {
  queryParams: QueryT;
  setQueryParams: (queryParams: Partial<QueryT>) => void;
};

type RequiredDefault<T, P> = {
  default: T | ((val: T, props: P) => T);
  validate: (val: T, props: P) => boolean;
};

type OptionalDefault<T, P> = {
  default?: T | ((val: T | undefined, props: P) => T);
  validate: (val: T | undefined, props: P) => boolean;
};

export default function withQueryParams<QueryT = {}, OuterProps = {}>({
  keys,
  stripUnknownKeys,
  queryStringOptions,
}: {
  keys: {
    [K in keyof QueryT]: undefined extends QueryT[K]
      ? OptionalDefault<QueryT[K], OuterProps>
      : RequiredDefault<QueryT[K], OuterProps>;
  };
  stripUnknownKeys?: boolean;
  queryStringOptions?: {
    arrayFormat?: 'none' | 'bracket' | 'index';
  };
}): <P>(
  Wrapped: React.ComponentType<P & InjectedQueryParams<QueryT>>
) => React.FunctionComponent<Omit<P, keyof InjectedQueryParams<QueryT>>>;

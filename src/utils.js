export const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

export const assert = (condition, message = 'Assertion failed') => {
  if (!condition) {
    if (typeof Error !== 'undefined') {
      throw new Error(message);
    }

    throw message; // fallback if Error not supported
  }
};

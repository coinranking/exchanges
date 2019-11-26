const {
  isUndefined,
  isGreaterThanZero,
  concat,
  parseToFloat,
} = require('./utils');

// isUndefined
test('Check is isUndefined returns true', () => {
  expect(isUndefined(undefined)).toBe(true);
});

test('Check is isUndefined returns false', () => {
  expect(isUndefined('undefined')).toBe(false);
});

// isGreaterThanZero
test('Check is 10 is greater than zero', () => {
  expect(isGreaterThanZero(10)).toBe(true);
});

test('Check is 0 is not greater than zero', () => {
  expect(isGreaterThanZero(0)).toBe(false);
});

// concat
test('Check the concatted array', () => {
  expect(concat(['foo'], ['bar'])).toContain('foo', 'bar');
});

// parseToFloat
test('Check if there is a number returned', () => {
  expect(typeof parseToFloat('6')).toBe('number');
});

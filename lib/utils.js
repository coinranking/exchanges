const isUndefined = (value) => typeof value === 'undefined';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const isGreaterThanZero = (value) => typeof value === 'number' && value > 0;

const concat = (oldList, newList) => oldList.concat(newList);

const flatMap = async (list, callback) => {
  const nextList = await Promise.all(list.map(callback));
  return nextList.reduce(concat, []);
};

const arrayToChunks = (originalArray, chunkSize) => {
  const chunks = [];
  const originalLength = originalArray.length;
  let index = 0;

  while (index < originalLength) {
    chunks.push(originalArray.slice(index, index += chunkSize));
  }

  return chunks;
};

const throttleMap = (stack, callback, limit) => {
  if (limit === 0) {
    return stack.map((item) => callback(item));
  }

  return stack.map((item, i) => new Promise((resolve) => {
    setTimeout(
      () => resolve(callback(item)),
      limit * i + 1,
    );
  }));
};

const throttleFlatMap = async (list, callback, limit) => {
  const nextList = await Promise.all(throttleMap(list, callback, limit));
  return nextList.reduce(concat, []);
};

const parseToFloat = (number, modifier) => {
  const parsed = parseFloat(number);
  if (!parsed) return undefined;
  if (modifier) return modifier(parsed);
  return parsed;
};

module.exports = {
  isUndefined,
  sleep,
  isGreaterThanZero,
  concat,
  flatMap,
  arrayToChunks,
  throttleMap,
  parseToFloat,
  throttleFlatMap,
};

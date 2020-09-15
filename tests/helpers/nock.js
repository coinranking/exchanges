// Credit to https://github.com/NimaSoroush for this helper
const nock = require('nock');
const path = require('path');
const zlib = require('zlib');

const { CI } = process.env;

nock.back.fixtures = path.join(__dirname, '..', 'fixtures');

if (!CI) {
  nock.back.setMode('record');
  nock.enableNetConnect();
} else {
  nock.back.setMode('lockdown');
}

const makeCompressedResponsesReadable = (scope) => {
  if (scope.rawHeaders.indexOf('gzip') > -1) {
    try {
      const fullResponseBody = scope.response && scope.response.reduce
        && scope.response.reduce((previous, current) => previous + current);

      scope.response = JSON.parse(
        zlib.gunzipSync(Buffer.from(fullResponseBody, 'hex')).toString('utf8'),
      );

      while (scope.rawHeaders.indexOf('gzip') > -1) {
        const gzipIndex = scope.rawHeaders.indexOf('gzip');
        scope.rawHeaders.splice(gzipIndex - 1, 2);
      }

      const contentLengthIndex = scope.rawHeaders.indexOf('Content-Length');
      scope.rawHeaders.splice(contentLengthIndex - 1, 2);
    } catch (e) {
      // do nothing
    }
  }

  if (scope.rawHeaders.indexOf('br') > -1) {
    try {
      const fullResponseBody = scope.response && scope.response.reduce
        && scope.response.reduce((previous, current) => previous + current);

      scope.response = JSON.parse(
        zlib.brotliDecompressSync(Buffer.from(fullResponseBody, 'hex')).toString('utf8'),
      );

      while (scope.rawHeaders.indexOf('br') > -1) {
        const brotliIndex = scope.rawHeaders.indexOf('br');
        scope.rawHeaders.splice(brotliIndex - 1, 2);
      }

      const contentLengthIndex = scope.rawHeaders.indexOf('Content-Length');
      scope.rawHeaders.splice(contentLengthIndex - 1, 2);
    } catch (e) {
      // do nothing
      throw new Error(e);
    }
  }

  return scope;
};

const maskSecretInString = (secret) => (string) => string.split(secret).join('maskedSecret');

const maskSecret = (secret) => (scope) => {
  scope.rawHeaders = scope.rawHeaders.map(maskSecretInString(secret));
  if (typeof scope.response === 'string') {
    scope.response = maskSecretInString(secret)(scope.response);
  }
  scope.path = maskSecretInString(secret)(scope.path);
  return scope;
};

const defaultOptions = (secret) => ({
  afterRecord: (outputs) => {
    let parsed = outputs;
    parsed = parsed.map(makeCompressedResponsesReadable);
    if (secret) {
      parsed = parsed.map(maskSecret(secret));
    }
    return parsed;
  },
});

module.exports = { nock, defaultOptions };

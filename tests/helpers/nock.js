// Credit to https://github.com/NimaSoroush for this helper
const nock = require('nock');
const path = require('path');
const zlib = require('zlib');

nock.back.fixtures = path.join(__dirname, '..', 'fixtures');
nock.back.setMode('record');

nock.enableNetConnect();

const makeCompressedResponsesReadable = (scope) => {
  if (scope.rawHeaders.indexOf('gzip') > -1) {
    while (scope.rawHeaders.indexOf('gzip') > -1) {
      const gzipIndex = scope.rawHeaders.indexOf('gzip');
      scope.rawHeaders.splice(gzipIndex - 1, 2);
    }

    const contentLengthIndex = scope.rawHeaders.indexOf('Content-Length');
    scope.rawHeaders.splice(contentLengthIndex - 1, 2);

    const fullResponseBody = scope.response && scope.response.reduce
      && scope.response.reduce((previous, current) => previous + current);

    try {
      scope.response = JSON.parse(
        zlib.gunzipSync(Buffer.from(fullResponseBody, 'hex')).toString('utf8'),
      );
    } catch (e) {
      // do nothing
    }
  }
  return scope;
};

const defaultOptions = {
  afterRecord: (outputs) => outputs.map(makeCompressedResponsesReadable),
};

module.exports = { nock, defaultOptions };

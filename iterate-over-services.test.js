'use strict'

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  iterateOverServices
} = require('./stolcher-client.js');


test('iterateOverServices returns true when callback succeeds immediately', async () => {
  const seen = []
  const ok = await iterateOverServices((url) => {
    seen.push(url);
    return true;
  })

  assert.equal(!!ok, true);
  assert.equal(seen.length, 1);
})


test('iterateOverServices retries when the callback does not succeeds', async () => {
  const seen = []
  const ok = await iterateOverServices( async(url) => {
    const length = seen.length;
    seen.push(url);
    if (length === 0) {
      throw new Error('Generic error');
    }
    return true;
  })

  assert.equal(!!ok, true);
  assert.equal(seen.length, 2);
})
'use strict'

const test = require('node:test');
const assert = require('node:assert/strict');
const {mock} = require('node:test');

const {
  getServicesStatus
} = require('./stolcher-client.js');


test('getStatus returns status array when fetch succeeds', async (t) => {
  const mockResponse = [
    {
      "lastCheckedAt": "2026-02-19T14:11:00.015562Z",
      "monitoredServiceName": "Emnify",
      "status": "Offline",
      "statusMessage": "Resource temporarily unavailable (cdn.emnify.net:443)"
    },
    {
      "lastCheckedAt": "2026-02-19T14:11:00.002802Z",
      "monitoredServiceName": "Sangoma Callback",
      "status": "Offline",
      "statusMessage": "Resource temporarily unavailable (pbx.mftitalia.it:80)"
    }
  ];

  if (typeof globalThis.fetch !== 'function') {
    globalThis.fetch = async () => {
      throw new Error('fetch was not mocked');
    };
  }

  mock.method(global, 'fetch', async () => {
    return Promise.resolve({
      json: () => Promise.resolve(mockResponse)
    });
  });

  const result = await getServicesStatus(1);

  assert.deepEqual(result, mockResponse);

  mock.restoreAll();
})
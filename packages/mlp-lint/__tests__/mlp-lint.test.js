'use strict';

const mlpLint = require('..');
const assert = require('assert').strict;

assert.strictEqual(mlpLint(), 'Hello from mlpLint');
console.info('mlpLint tests passed');

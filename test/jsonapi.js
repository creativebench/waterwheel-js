const test = require('ava');
const requireSubvert = require('require-subvert')(__dirname);

test.beforeEach(t => {
  t.context.JSONAPI = requireSubvert.require('../lib/jsonapi');
  t.context.credentials = {user: 'b', pass: 'b'};
  t.context.base = 'http://foo.dev';
});

test.afterEach(t => {
  requireSubvert.cleanUp();
});

test('JSONAPI - Create', t => {
  const jsonapi = new t.context.JSONAPI(t.context.base, t.context.credentials);
  t.is(true, jsonapi instanceof t.context.JSONAPI, 'Unexpected creation.');
});

test('JSONAPI - Collections / Lists', t => {
  requireSubvert.subvert('axios', options => (
    Promise.resolve({data: options})
  ));
  const jsonapi = new t.context.JSONAPI(t.context.base, t.context.credentials);
  return jsonapi.request('node/article', {})
    .then(res => {
      t.is('http://foo.dev/api/node/article?_format=api_json', res.url);
    });
});

test('JSONAPI - Related resources', t => {
  requireSubvert.subvert('axios', options => (
    Promise.resolve({data: options})
  ));
  const jsonapi = new t.context.JSONAPI(t.context.base, t.context.credentials);
  return jsonapi.request('node/article', {}, 'cc1b95c7-1758-4833-89f2-7053ae8e7906/uid')
    .then(res => {
      t.is('http://foo.dev/api/node/article/cc1b95c7-1758-4833-89f2-7053ae8e7906/uid?_format=api_json', res.url);
    });
});

test('JSONAPI - Filter basic', t => {
  requireSubvert.subvert('axios', options => (
    Promise.resolve({data: options})
  ));
  const jsonapi = new t.context.JSONAPI(t.context.base, t.context.credentials);
  return jsonapi.request('node/article', {
    filter: {
      uuid: {
        value: '563196f5-4432-4964-9aeb-e4d326cb1330'
      }
    }
  })
    .then(res => {
      t.is('http://foo.dev/api/node/article?_format=api_json&filter%5Buuid%5D%5Bvalue%5D=563196f5-4432-4964-9aeb-e4d326cb1330', res.url);
    });
});

test('JSONAPI - Filter with operator', t => {
  requireSubvert.subvert('axios', options => (
    Promise.resolve({data: options})
  ));
  const jsonapi = new t.context.JSONAPI(t.context.base, t.context.credentials);
  return jsonapi.request('node/article', {
    filter: {
      created: {value: '1469001416', operator: '='}
    }
  })
    .then(res => {
      t.is('http://foo.dev/api/node/article?_format=api_json&filter%5Bcreated%5D%5Bvalue%5D=1469001416&filter%5Bcreated%5D%5Boperator%5D=%3D', res.url);
    });
});

const Request = require('./helpers/request');
const methods = require('./helpers/methods');

const qs = require('qs');

module.exports = class JSONAPI extends Request {
  constructor(base, credentials) {
    super(base, credentials);
  }

  /**
 * General JSONAPI GET method.
 *
 * @param {string} resource
 *   The relative path to fetch from the API.
 * @param {object} params
 *   GET arguments to send with the request.
 * @param {string} id
 *   An ID of an individual item to request.
 * @return {promise}
 *   Resolves when the request is fulfilled, rejects if there's an error.
 */
  request(resource, params = {}, id = false) {
    const format = 'api_json';
    const url = `/api/${resource}${id ? `/${id}` : ''}?_format=${format}${Object.keys(params).length ? `&${qs.stringify(params, {indices: false})}` : ''}`;
    return this.issueRequest(methods.get, url, '');
  }
};

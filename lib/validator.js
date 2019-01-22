/**
 * Validates data against a schema.
 * @module validator 
 **/

// Imports
const fs = require('fs');
// Third Party Imports
const jsonschema = require('jsonschema');

// Internal Functionality
const schema = fs.readFileSync('./schema.json');

// Exports
/**
 * @function validate
 * @param {Object} data The object to validate against the schema.
 */
exports.test = function (data) {
    return jsonschema.validate(data, schema);
};
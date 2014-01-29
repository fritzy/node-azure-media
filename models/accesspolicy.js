var Very = require('verymodel');
var common = require('./common');
var uuid = require('node-uuid');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974297.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    Name: {type: common.types.Name, required: true},
    DurationInMinutes: {type: 'number', required: true},
    Permissions: {type: Very.VeryValidator().isInt().isIn([0, 1, 2, 4, 8])},
});

var Very = require('verymodel');
var common = require('./common');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974297.aspx

module.exports = new Very.VeryModel({
    Id: {},
    Name: {type: common.types.Name},
    Created: {type: 'date'},
    LastModified: {type: 'date'},
    Name: {required: true},
    DurationInMinutes: {type: 'number', required: true},
    Permissions: {type: Very.VeryType().isInt().isIn([0, 1, 2, 4, 8])},
});

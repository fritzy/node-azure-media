var Very = require('verymodel');
var common = require('./common');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974308.aspx

module.exports = new Very.VeryModel({
    Code: {static: true},
    Message: {static: true},
});

var Very = require('verymodel');
var common = require('./common');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    PendingFilesCount: {type: 'integer'},
    FinishedFilesCount: {type: 'integer'},
    ErrorFilesCount: {type: 'integer'},
    ErrorFilesDetails: {type: 'integer'},
});

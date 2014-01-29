var Very = require('verymodel');
var common = require('./common');
var Asset = require('./asset');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {},
    Configuration: {},
    EndTime: {},
    ErrorDetails: {},
    HistoricalEvents: {},
    MediaProcessorId: {},
    Name: {},
    PerfMessage: {},
    Priority: {},
    Progress: {},
    RunningDuration: {},
    StartTime: {},
    State: {},
    TaskBody: {}, // oh my gord, xml in json
    Options: {},
    EncryptionKeyId: {},
    EncryptionSchema: {},
    EncryptionVersion: {},
    InitializationVector: {},
    OutputMediaAssets: {collection: Asset},
    InputMediaAssets: {collection: Asset},
});

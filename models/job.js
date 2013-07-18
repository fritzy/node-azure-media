var Very = require('verymodel');
var common = require('./common');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    Name: {}
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    EndTime: {type: 'date', static: true},
    Priority: {type: Very.VeryType().isInt()},
    RunningDuration: {},
    StartTime: {},
    State: {},
    TemplateId: {},
    InputMediaAssets: {collection: Asset, required: true},
    OutputMediaAssets: {static: true, collection: Asset},
    Tasks: {collection: Task},
    JobNotificationSubscriptions: {collection: JobNotifcationSubscription},
});

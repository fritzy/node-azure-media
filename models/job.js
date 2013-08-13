var Very = require('verymodel');
var common = require('./common');
var Asset = require('./asset');
var Task = require('./task');
var JobNotificationSubscription = require('./jobnotificationsubscription');
var odata = require('./odata');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    Name: {},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    EndTime: {type: 'date', static: true},
    Priority: {type: Very.VeryType().isInt()},
    RunningDuration: {},
    StartTime: {},
    State: {},
    TemplateId: {},
    InputMediaAssets: {collection: odata, required: true},
    OutputMediaAssets: {static: true, collection: Asset},
    Tasks: {collection: Task},
    JobNotificationSubscriptions: {collection: JobNotificationSubscription},
});

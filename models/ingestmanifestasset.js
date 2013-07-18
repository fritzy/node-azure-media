var Very = require('verymodel');
var Asset = require('./asset');
var common = require('./common');
var IngestManifestFile = require('./ingestmanifestfile');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    ParentIngestManifestId: {required: true},
    IngestManifestFiles: {static: true, collection: IngestManifestFile},
    Asset: {model: Asset, required: true},
});

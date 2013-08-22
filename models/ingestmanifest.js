var Very = require('verymodel');
var common = require('./common');
var IngestManifestSatistics = require('./ingestmanifeststatistics');
var IngestManifestAsset = require('./ingestmanifestasset');
var StorageAccount = require('./storageaccount');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    Name: {},
    State: {static: true, type: Very.VeryValidator().isInt().isIn([0, 1, 2])},
    BlobStorageUriForUpload: {static: true},
    Statistics: {model: IngestManifestSatistics},
    IngestManifestAssets: {collection: IngestManifestAsset},
    PendingIngestManifestAssets: {collection: IngestManifestAsset},
    StorageAccountName: {},
    StorageAccount: {model: StorageAccount, static: true},
});

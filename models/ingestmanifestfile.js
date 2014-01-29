var Very = require('verymodel');
var Asset = require('./asset');
var common = require('./common');
var ErrorDetail = require('./errordetail');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    Name: {},
    State: {static: true, type: Very.VeryValidator().isInt().isIn([0, 1, 2])},
    ParentIngestManifestId: {required: true},
    ParentIngestManifestAssetId: {required: true},
    ErrorDetail: {static: true},
    MimeType: {},
    IsPrimary: {type: 'boolean'},
    EncryptionVersion: {},
    EncryptionSchema: {type: Very.VeryValidator().isIn(['StorageEncryption', 'CommonEncryption'])},
    IsEncrypted: {type: 'boolean'},
    EncryptionKeyId: {},
    InitializationVector: {},
});

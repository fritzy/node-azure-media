var Very = require('verymodel');
var common = require('./common');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974275.aspx

module.exports = new Very.VeryModel({
    Id: {},
    Name: {type: common.types.Name},
    ContentFileSize: {type: Very.VeryType().isInt()},
    ParentAssetId: {},
    EncryptionVersion: {},
    EncryptionScheme: {},
    IsEncrypted: {},
    EncryptionKeyId: {},
    InitializationVector: {},
    IsPrimary: {},
    LastModified: {},
    Created: {},
    MimeType: {},
    ContentChecksum: {type: Very.VeryType().isHexidecimal()},
});

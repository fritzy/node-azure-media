var Very = require('verymodel');
var common = require('./common');

module.exports = new Very.VeryModel({
    Id: {static: true},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    ContentKeyType: {type: Very.VeryValidator().isInt().isIn([0, 1, 2])},
    EncryptedContentKey: {type: Very.VeryValidator().len(0, 4000)},
    Name: {type: Very.VeryValidator().len(0, 4000)},
    ProtectionKeyId: {type: Very.VeryValidator().len(0, 4000)},
    ProtectionKeyType: {},
    Checksum: {type: Very.VeryValidator().len(0, 4000)},
});

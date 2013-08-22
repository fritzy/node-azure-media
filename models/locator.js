var Very = require('verymodel');
var common = require('./common');
var Asset = require('./asset');
var AccessPolicy = require('./accesspolicy');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974308.aspx

module.exports = new Very.VeryModel({
    Id: {},
    Name: {type: Very.VeryValidator().len(0, 4000)},
    ExpirationDateTime: {},
    Type: {type: Very.VeryValidator().isInt().isIn([0, 1, 2]), required: true},
    Path: {static: true},
    BaseUri: {static: true},
    ContentAccessComponent: {static: true},
    AccessPolicyId: {static: true},
    AssetId: {static: true},
    StartTime: {type: 'date'},
    AssetPolicy: {model: AccessPolicy, static: true},
    Asset: {model: Asset, static: true},
});

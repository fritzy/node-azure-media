var Very = require('verymodel');
var common = require('./common');
var Locator = require('./locator');
var ContentKey = require('./contentkey');
var AssetFile = require('./assetfile');
var StorageAccount = require('./storageaccount');
var uuid = require('node-uuid');
var metadata = require('./odata_metadata');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974277.aspx

module.exports = new Very.VeryModel({
    Id: {static: true},
    State: {static: true, type: Very.VeryType().isInt().isIn([0, 1, 2])},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    AlternateId: {type: Very.VeryType().len(0, 4000)},
    Name: {type: Very.VeryType().len(0, 4000)},
    __metadata: {model: metadata},
    Options: {static: true, type: Very.VeryType().isInt().isIn([0, 1, 2, 4])},
    Uri: {static: true},
    Locators: {collection: Locator},
    ContentKeys: {collection: ContentKey},
    Files: {collection: AssetFile},
    ParentAssets: {collection: 'this'},
    StorageAccountName: {},
    StorageAccount: {model: StorageAccount},
});

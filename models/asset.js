var Very = require('verymodel');
var common = require('./common');
var Locator = require('./locator');
var ContentKey = require('./contentkey');
var AssetFile = require('./assetfile');
var StorageAccount = require('./storageaccount');
var uuid = require('node-uuid');
var metadata = require('./odata_metadata');
// http://msdn.microsoft.com/en-us/library/windowsazure/hh974277.aspx


var Model = new Very.VeryModel({
    Id: {static: true},
    State: {static: true, type: Very.VeryValidator().isInt().isIn([0, 1, 2])},
    Created: {type: 'date', static: true},
    LastModified: {type: 'date', static: true},
    AlternateId: {type: Very.VeryValidator().len(0, 4000)},
    Name: {type: Very.VeryValidator().len(0, 4000)},
    __metadata: {model: metadata},
    Options: {static: true, type: Very.VeryValidator().isInt().isIn([0, 1, 2, 4])},
    Uri: {static: true},
    Locators: {collection: Locator},
    ContentKeys: {collection: ContentKey},
    Files: {collection: AssetFile},
    ParentAssets: {collection: 'this'},
    StorageAccountName: {},
    StorageAccount: {model: StorageAccount},
});

Model.extendModel({
    delete: function (cb) {
        this.api.rest.asset.delete(this.Id, cb);
    },

    update: function (cb) {
        this.api.rest.asset.update(this.Id, this.toObject(), cb);
    },

    listFiles: function (cb, query) {
        this.api.rest.asset.listFiles(this.Id, cb, query);
    },

    get: function (cb) {
        this.api.rest.asset.get(this.Id, cb);
    },
});

module.exports = Model;


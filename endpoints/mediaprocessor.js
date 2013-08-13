var path = require('path');
var modelName = path.basename(module.filename, '.js');

var calls = {

    create: function createAsset(data, cb) {
        this.createRequest(modelName, data, cb);
    },

    get: function getAsset(id, cb) {
        this.getRequest(modelName, id, cb);
    },

    list: function (cb, query) {
        this.listRequest(modelName, cb, query);
    },

    update: function updateAsset(id, data, cb) {
        this.updateRequest(modelName, id, data, cb);
    },

    delete: function deleteAsset(id, cb) {
        this.deleteRequest(modelName, id, cb);
    },

    getCurrentByName: function (name, cb) {
        this.rest.mediaprocessor.list(function (err, replies) {
            if (replies.length > 0) {
                cb(err, replies[0]);
            } else {
                cb('No valid replies', null);
            }
        }, {$top: 1, $filter: "Name eq '" + name + "'", $orderby: 'Version desc'});
    },

};

module.exports = calls;

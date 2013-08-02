var path = require('path');
var modelName = path.basename(module.filename, '.js');

var calls = {

    create: function createAsset(data, cb) {
        this.createRequest(modelName, data, cb);
    },

    get: function getAsset(id, cb) {
        this.getRequest(modelName, id, cb);
    },

    list: function (cb) {
        this.listRequest(modelName, cb);
    },

    update: function updateAsset(id, data, cb) {
        this.updateRequest(modelName, id, data, cb);
    },

    delete: function deleteAsset(id, cb) {
        this.deleteRequest(modelName, id, cb);
    },

};

module.exports = calls;

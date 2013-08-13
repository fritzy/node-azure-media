var path = require('path');
var modelName = path.basename(module.filename, '.js');

var calls = {

    create: function (data, cb) {
        this.createRequest(modelName, data, cb);
    },

    get: function (id, cb) {
        this.getRequest(modelName, id, cb);
    },

    list: function (cb, query) {
        this.listRequest(modelName, cb, query);
    },

    update: function (id, data, cb) {
        this.updateRequest(modelName, id, data, cb);
    },

    // asset files are deleted when their parent asset is deleted

};

module.exports = calls;

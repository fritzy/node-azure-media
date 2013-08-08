var path = require('path');
var modelName = path.basename(module.filename, '.js');

var calls = {

    create: function (data, cb) {
        this.createRequest(modelName, data, cb);
    },

    get: function (id, cb) {
        this.getRequest(modelName, id, cb);
    },

    list: function (cb) {
        this.listRequest(modelName, cb);
    },
    
    //you can't update access policies, so omitted

    delete: function (id, cb) {
        this.deleteRequest(modelName, id, cb);
    },

};

module.exports = calls;

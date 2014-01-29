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
    
    //you can't update access policies, so omitted

    delete: function (id, cb) {
        this.deleteRequest(modelName, id, cb);
    },

    findOrCreate: function (duration, permissions, cb) {
        this.rest.accesspolicy.list(function (err, accesspolicies) {
            if (!err && accesspolicies.length > 0) {
                cb(err, accesspolicies[0]);
            } else {
                this.rest.accesspolicy.create({DurationInMinutes: duration, Permissions: permissions, Name: 'NodeAzureMedia_' + duration + '_' + permissions}, cb);
            }
        }.bind(this), {$filter: "Name eq 'NodeAzureMedia_" + duration + "_" + permissions + "'",  $orderby: 'Created desc', $top: 1});
    },

};

module.exports = calls;

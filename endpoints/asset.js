var path = require('path');
var modelName = path.basename(module.filename, '.js');
var models = require('../models');
var request = require('request');

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

    listFiles: function (id, cb, query) {
        cb = cb || function () {};

        request.get({
            uri: this.modelURI('asset', id) + '/AssetFiles',
            headers: this.defaultHeaders(), 
            followRedirect: false, 
            strictSSL: true,
            qs: query
        }, function (err, res) {
            console.log(err, res.statusCode);
            var objs = [];
            if (res.statusCode == 200) {
                var data = JSON.parse(res.body).d.results;
                data.forEach(function (rawd) {
                    var dobj = models['assetfile'].create(rawd);
                    objs.push(dobj);
                });
                cb(err, objs);
            } else {
                cb(err || 'Expected 200 status, received: ' + res.statusCode);
            }
        });

    },

};

module.exports = calls;

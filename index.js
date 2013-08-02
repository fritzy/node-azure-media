var models = require('./models');
var endpoints = require('./endpoints');
var request = require('request');

var resourceMap = {
    accesspolicy: 'AccessPolicies',
    assetfile: 'Files',
    asset: 'Assets',
    contentkey: 'ContentKeys',
    ingestmanifest: 'IngestManifests',
    ingestmanifestasset: 'IngestManifestAssets',
    ingestmanifestfile: 'IngestManifestFiles',
    job: 'Jobs',
    jobtemplate: 'JobTemplates',
    locator: 'Locators',
    mediaprocessor: 'MediaProcessors',
    notificationendpoint: 'NotificationEndpoints',
    task: 'Tasks',
    tasktemplate: 'TaskTemplates',
};

function modelURI(modelName, id) {
    var url = this.config.base_url + resourceMap[modelName];
    if (id) {
        url = url + "('" + id + "')";
    }
    return url;
}


function AzureAPI(config) {
    this.config = config || {};
    if (!this.config.hasOwnProperty('base_url')) {
        this.config.base_url = "https://media.windows.net/API/";
    }
    if (!this.config.hasOwnProperty('oauth_url')) {
        this.config.oauth_url = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13";
    }
    this.auth_token = config.auth_token || '';
    this.rest = {};
}

(function () {

    this.init = function (cb) {
        Object.keys(endpoints).forEach(function (endpoint) {
            this.rest[endpoint] = {};
            Object.keys(endpoints[endpoint]).forEach(function (call) {
                this.rest[endpoint][call] = function () {
                    endpoints[endpoint][call].apply(this, arguments);
                }.bind(this);
            }.bind(this));
        }.bind(this));

        this.getAuthToken(function (err, result) {
            //get the first redirect
            request.get({
                uri: modelURI('assets'), 
                headers: this.defaultHeaders(), 
                followRedirect: false, 
                strictSSL: true
            }, function (err, res) {
                if (res.statusCode === 301) {
                    this.config.base_url = res.headers.location;
                    console.log("changing base url to",  this.config.base_url);
                }
                cb(err, result);
            }.bind(this));
        }.bind(this));
    };

    this.defaultHeaders = function (opts) {
        var headers = {
            Accept: 'application/json;odata=verbose',
            DataServiceVersion: '3.0',
            MaxDataServiceVersion: '3.0',
            'x-ms-version': '2.2',
            'Content-Type': 'application/json;odata=verbose',
            Authorization: 'Bearer ' + this.oauth.access_token
        };
        return headers;
    };

    this.getAuthToken = function (cb) {
        request.post({
            uri: this.config.oauth_url, 
            form: {
                grant_type: 'client_credentials', 
                client_id: this.config.client_id,
                client_secret: this.config.client_secret,
                scope: 'urn:WindowsAzureMediaServices'
            },
            strictSSL: true
        }, function (err, res) {
            if (err) throw Error("Authentication Error");
            var result = JSON.parse(res.body);
            this.oauth = result;
            this.oauth.time_started = Date.now();
            cb(err, result.access_token);
        }.bind(this));
    };

    this.getRequest = function (model, id, cb) {
        request.get({
            uri: modelURI(model, id),
            headers: this.defaultHeaders(), 
            followRedirect: false, 
            strictSSL: true
        }, function (err, res) {
            if (res.statusCode == 200) {
                var data = JSON.parse(res.body).d;
                var dobj = models[model].create(data);
                cb(err, dobj);
            } else {
                if (!err) err = 'Did not get 200 back from get.';
                cb(err);
            }
        });
    };

    this.listRequest = function (model, cb) {
        request.get({
            uri: modelURI(model),
            headers: this.defaultHeaders(), 
            followRedirect: false, 
            strictSSL: true
        }, function (err, res) {
            var objs = [];
            if (res.statusCode == 200) {
                var data = JSON.parse(res.body).d.results;
                data.forEach(function (rawd) {
                    var dobj = models[model].create(rawd);
                    objs.push(dobj);
                });
                cb(err, objs);
            } else {
                if (!err) err = 'Did not get 200 back from list.';
                cb(err);
            }
        });
    };

    this.createRequest = function (model, data, cb) {
        var pl = models[model].create(data).toObject();
        request.post({
            uri: modelURI(model),
            headers: this.defaultHeaders(),
            body: JSON.stringify(pl),
            followRedirect: false,
            strictSSL: true
        }, function (err, res) {
            if (res.statusCode == 201) {
                var data = JSON.parse(res.body).d;
                var dobj = models[model].create(data);
                cb(err, dobj);
            } else {
                if (!err) err = 'Did not get 201 back from create.';
                cb(err);
            }
        });
    };

    this.deleteRequest = function (model, id, cb) {
        request({
            method: 'DELETE', 
            uri: modelURI(model, id),
            headers: this.defaultHeaders(),
            followRedirect: false, 
            strictSSL: true
        }, function (err, res) {
            if (res.statusCode == 204) {
                cb(err);
            } else {
                cb('Did not recieve 204 in DELETE');
            }
        });
    };

}).call(AzureAPI.prototype);

module.exports = AzureAPI;

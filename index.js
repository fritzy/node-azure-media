var models = require('./models');
var endpoints = require('./endpoints');
var request = require('request');

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

(function() {

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
            var header = {
                Accept: 'application/json;odata=verbose',
                DataServiceVersion: '3.0',
                MaxDataServiceVersion: '3.0',
                'x-ms-version': '2.2',
                Authorization: 'Bearer ' + this.oauth.access_token
            };
            request.get({followRedirect: false, headers: header, uri: this.config.base_url + 'Assets'}, function (err, res) {
                if (res.statusCode === 301) {
                    this.config.base_url = res.headers.location;
                    console.log("changing base url to",  this.config.base_url);
                }
                cb(err, result);
            }.bind(this));
        }.bind(this));
    };

    this.getAuthToken = function (cb) {
        request.post({uri: this.config.oauth_url, form: {
            grant_type: 'client_credentials', 
            client_id: this.config.client_id,
            client_secret: this.config.client_secret,
            scope: 'urn:WindowsAzureMediaServices'
        }}, function (err, res) {
            if (err) throw Error("Authentication Error");
            var result = JSON.parse(res.body);
            this.oauth = result;
            this.oauth.time_started = Date.now();
            cb(err, result.access_token);
        }.bind(this));
    };

    this.listRequest = function (model, cb) {
        var header = {
            Accept: 'application/json;odata=verbose',
            DataServiceVersion: '3.0',
            MaxDataServiceVersion: '3.0',
            'x-ms-version': '2.2',
            Authorization: 'Bearer ' + this.oauth.access_token
        };
        request.get({followRedirect: false, headers: header, uri: this.config.base_url + model[0].toUpperCase() + model.slice(1) + 's'}, function (err, res) {
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
        var header = {
            Accept: 'application/json;odata=verbose',
            DataServiceVersion: '3.0',
            MaxDataServiceVersion: '3.0',
            'x-ms-version': '2.2',
            'Content-Type': 'application/json;odata=verbose',
            Authorization: 'Bearer ' + this.oauth.access_token
        };
        var pl = models[model].create(data).toObject();
        request.post({followRedirect: false, headers: header, uri: this.config.base_url +  model[0].toUpperCase() + model.slice(1) + 's', body: JSON.stringify({Name: 'test'})}, function (err, res) {
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
        var header = {
            Accept: 'application/json;odata=verbose',
            DataServiceVersion: '3.0',
            MaxDataServiceVersion: '3.0',
            'x-ms-version': '2.2',
            'Content-Type': 'application/json;odata=verbose',
            Authorization: 'Bearer ' + this.oauth.access_token
        };
        var url = this.config.base_url +  model[0].toUpperCase() + model.slice(1) + 's' + "('" + id + "')";
        request({method: 'DELETE', followRedirect: false, headers: header, uri: url}, function (err, res) {
            if (res.statusCode == 204) {
                cb(err);
            } else {
                cb('Did not recieve 204 in DELETE');
            }
        });
    };

}).call(AzureAPI.prototype);

module.exports = AzureAPI;

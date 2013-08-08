var async = require('async');
var moment = require('moment');
var url = require('url');
var request = require('request');

var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Duplex = require('stream').Duplex;

function AzureBlob(api) {
    this.api = api;
}

(function () {

    this.generateMetadata = function (assetId, cb) {
        console.log("generating metadata for", assetId);
        request({
            method: 'GET',
            uri: this.api.config.base_url + '/CreateFileInfos',
            qs: {assetid: "'" + assetId + "'"},
            headers: this.api.defaultHeaders(),
            strictSSL: true
        }, function (err, res) {
            console.log("generate meta data", err, res.body);
            cb()
        });
    };

    this.uploadStream = function (filename, stream, uploading_cb, done_cb) {
        stream.pause();
        async.waterfall([
            //create an asset
            function (cb) {
                this.api.rest.asset.create({Name: filename}, cb);
            }.bind(this),
            //create a policy
            function (asset, cb) {
                this.api.rest.accesspolicy.create({Name: 'Upload', DurationInMinutes: 30, Permissions: 2}, function (err, result) {
                    cb(err, {asset: asset, policy: result});
                }.bind(this));
            }.bind(this),
            //create a location
            function (results, cb) {
                this.api.rest.locator.create({
                    StartTime: moment.utc().subtract('minutes', 10).format('M/D/YYYY hh:mm:ss A'),
                    AccessPolicyId: results.policy.Id,
                    AssetId: results.asset.Id,
                    Type: 1,
                }, function (err, locator) {
                    console.log(err);
                    results.locator = locator;
                    console.log(moment(results.locator.ExpirationDateTime)._d);
                    console.log(moment(results.locator.StartTime)._d);
                    console.log(moment()._d);
                    cb(err, results);
                }.bind(this));
            }.bind(this),

        ], function (err, result) {
            var path = result.locator.Path;
            var parsedpath = url.parse(path);
            parsedpath.pathname += '/' + filename;
            path = url.format(parsedpath);
            //upload the stream
            console.log(result.locator.toObject());
            console.log(result.policy.toObject());
            console.log(result.asset.toObject());
            console.log('::', result.locator.Path);
            console.log("::", path);
            r = request.put({method: 'PUT', url: path, headers: {
                'Content-Type': 'application/octet-stream',
                'x-ms-blob-type': 'BlockBlob',
                //'x-ms-version': moment.utc().subtract('day', 1).format('YYYY-MM-DD'),
                //'x-ms-date': moment.utc().format('YYYY-MM-DD'),
                //Authorization: 'Bearer ' + this.api.oauth.access_token
            }, strictSSL: true}, function (err, res) {
                console.log(res.statusCode, res.request.headers, res.request.path);
                console.log("uploaded", err, res.body);
            });
            stream.resume();
            stream.pipe(r);
            stream.on('end', function () {
                console.log("upload finished");
                async.waterfall([
                    //delete upload location
                    function (cb) {
                        this.api.rest.locator.delete(result.locator.Id, cb);
                    }.bind(this),
                    //generate file metadata
                    function (cb) {
                        this.generateMetadata(result.asset.Id, cb);
                    }.bind(this),
                ], function(err, metadata) {
                    console.log("done with waterfall");
                    if (typeof done_cb !== 'undefined') {
                        done_cb(err, path, result);
                    }
                }.bind(this));
            }.bind(this));
            if (typeof uploading_cb !== 'undefined') {
                console.log("uploading...");
                uploading_cb(err, path, result);
            }
        }.bind(this));
    };

    this.downloadStream = function (assetId, stream, done_cb) {
        async.waterfall([
            function (cb) {
                this.api.rest.accesspolicy.create({Name: 'Download', DurationInMinutes: 60, Permissions: 1}, function (err, result) {
                    console.log(err);
                    cb(err, result);
                }.bind(this));
            }.bind(this),
            function (policy, cb) {
                this.api.rest.locator.create({AccessPolicyId: policy.Id, AssetId: assetId, StartTime: moment.utc().subtract('minutes', 5).format('MM/DD/YYYY hh:mm:ss A'), Type: 1, ExpirationDateTime: moment.utc().add('days', 1).format('MM/DD/YYYY hh:mm:ss A')}, function (err, locator) {
                    console.log(locator.toObject());
                    cb(err, locator);
                }.bind(this));
            }.bind(this),
        ], function (err, locator) {
            console.log("ready to download");
            var path = locator.Path;
            var parsedpath = url.parse(path);
            parsedpath.pathname += '/cheese.jpg';
            path = url.format(parsedpath);
            console.log(path);
            request({
                uri: path,
                method: 'GET',
            }, function (err, res) {
                console.log("got");
                console.log(res.statusCode);
                console.log(res.body);
            }).pipe(stream);
            stream.on('end', function (err) {
                console.log("done downloading...");
                if (typeof done_cb !== 'undefined') {
                    done_cb(err);
                }
            });
        }.bind(this));
    };

    this.getAssetByName = function () {
    };

    this.getAssetById = function () {
    };


}).call(AzureBlob.prototype);

module.exports = AzureBlob;

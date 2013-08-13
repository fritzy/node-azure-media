var async = require('async');
var moment = require('moment');
var url = require('url');
var request = require('request');
var uuid = require('node-uuid');

var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var Duplex = require('stream').Duplex;

function AzureBlob(api) {
    this.api = api;
}

(function () {

    this.generateMetadata = function (assetId, cb) {
        request({
            method: 'GET',
            uri: this.api.config.base_url + '/CreateFileInfos',
            qs: {assetid: "'" + assetId + "'"},
            headers: this.api.defaultHeaders(),
            strictSSL: true
        }, function (err, res) {
            cb()
        });
    };

    this.uploadStream = function (filename, stream, length, uploading_cb, done_cb) {
        stream.pause();
        async.waterfall([
            //create an asset
            function (cb) {
                this.api.rest.asset.create({Name: filename}, cb);
            }.bind(this),
            //create a policy
            function (asset, cb) {
                this.api.rest.accesspolicy.create({Name: 'Upload', DurationInMinutes: 300, Permissions: 2}, function (err, result) {
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
                    results.locator = locator;
                    cb(err, results);
                }.bind(this));
            }.bind(this),

        ], function (err, result) {
            var path = result.locator.Path;
            var parsedpath = url.parse(path);
            parsedpath.pathname += '/' + filename;
            path = url.format(parsedpath);
            //upload the stream
            r = request.put({method: 'PUT', url: path, headers: {
                'Content-Type': 'application/octet-stream',
                'x-ms-blob-type': 'BlockBlob',
                'Content-Length': length,
                //'x-ms-version': moment.utc().subtract('day', 1).format('YYYY-MM-DD'),
                //'x-ms-date': moment.utc().format('YYYY-MM-DD'),
                //Authorization: 'Bearer ' + this.api.oauth.access_token
            }, strictSSL: true}, function (err, res) {
                console.log(0)
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
                    if (typeof done_cb !== 'undefined') {
                        done_cb(err, path, result);
                    }
                }.bind(this));
            }.bind(this));
            stream.resume();
            stream.pipe(r);
            if (typeof uploading_cb !== 'undefined') {
                uploading_cb(err, path, result);
            }
        }.bind(this));
    };

    this.downloadStream = function (assetId, mimetype, stream, done_cb) {
        async.waterfall([
            function (cb) {
                this.api.rest.accesspolicy.create({Name: 'Download', DurationInMinutes: 60, Permissions: 1}, function (err, result) {
                    cb(err, result);
                }.bind(this));
            }.bind(this),
            function (policy, cb) {
                this.api.rest.locator.create({AccessPolicyId: policy.Id, AssetId: assetId, StartTime: moment.utc().subtract('minutes', 5).format('MM/DD/YYYY hh:mm:ss A'), Type: 1}, function (err, locator) {
                    cb(err, locator);
                }.bind(this));
            }.bind(this),
            function (locator, cb) {
                this.api.rest.assetfile.list(function (err, results) {
                    if (results.length > 0) {
                        cb (false, locator, results[0]);
                    } else {
                        cb ("No files associated with asset.");
                    }
                }.bind(this), {$filter: "ParentAssetId eq '" + assetId + "' and MimeType eq '" + mimetype + "'", $orderby: 'Created desc', $top: 1});
            }.bind(this),
        ], function (err, locator, fileasset) {
            var path = locator.Path;
            var parsedpath = url.parse(path);
            parsedpath.pathname += '/' + fileasset.Name;
            path = url.format(parsedpath);
            console.log(path);
            request({
                uri: path,
                method: 'GET',
            }, function (err, res) {
                if (typeof done_cb !== 'undefined') {
                    done_cb(err);
                }
            }).pipe(stream);
        }.bind(this));
    };

    this.getAssetByName = function () {
    };

    this.getAssetById = function () {
    };

    this.encodeVideo = function (assetId, encoder, cb) {
        async.waterfall([
            function (cb) {
                this.api.mediaprocessor.getCurrentByName('Windows Azure Media Encoder', cb);
            },
            function (processor) {
                this.api.rest.asset.get(assetId, function (err, asset) {
                    cb(err, processor, asset);
                });
            },
            function (processor, asset) {
                this.api.rest.job.create({
                    Name: 'EncodeVideo-' + uuid();
                    InputMediaAssets: [{'__metadata': {uri: asset.__metadata.uri}}],
                    Task: [{
                        Configuration: encoder,
                        MediaProcessorId: processor.Id,
                        TaskBody: "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"
                    }],
                }, function (err, job) {
                    cb(err, processor, asset, job);
                });
            },
        ], function (err, processor, asset, job) {
            cb(err, job, asset);
        });
    };


}).call(AzureBlob.prototype);

module.exports = AzureBlob;

var repl = require('repl');
var AzureMedia = require('./index');
var optimist = require('optimist');
optimist.demand(['config']);
var config = require(optimist.argv.config);

var api = new AzureMedia(config.auth);
api.init(function () {
    api.rest.asset.create({'Name': 'testtodelete'}, function (err, asset) {
        api.rest.accesspolicy.list(function (err, policies) {
            policies.forEach(function (policy) {
                console.log(policy.Id);
                api.rest.accesspolicy.delete(policy.Id);
            });
            api.rest.asset.list(function (err, assets) {
                assets.forEach(function (asset) {
                    console.log(asset.Id);
                    asset.delete();
                });
                api.rest.assetfile.list(function (err, files) {
                    files.forEach(function (file) {
                        console.log(file.Id);
                        api.rest.assetfile.delete(file.Id);
                    });
                });
            });
        });
    });
});

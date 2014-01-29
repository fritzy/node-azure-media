var repl = require('repl');
var AzureMedia = require('./index');
var optimist = require('optimist');
optimist.demand(['config']);
var config = require(optimist.argv.config);

var api = new AzureMedia(config.auth);
api.init(function () {


    repl.start({}).context.api = api;
});

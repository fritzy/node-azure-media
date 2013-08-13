var Very = require('verymodel');
var metadata = require('./odata_metadata');

module.exports = new Very.VeryModel({
    '__metadata': {model: metadata},
});

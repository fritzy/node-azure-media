var Very = require('verymodel');
var common = require('./common');

module.exports = new Very.VeryModel({
    Name: {static: true},
    isDefault: {type: 'boolean'},
});

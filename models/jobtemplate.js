var Very = require('verymodel');
var common = require('./common');
// http://msdn.microsoft.com/en-us/library/windowsazure/jj853024.aspx

module.exports = new Very.VeryModel({
    Id: {},
    Name: {},
    Created: {},
    LastModified: {},
    JobTempalteBody: {},
    NumberofInputAssets: {},
    TemplateType: {},
    TaskTemplates: {},
});

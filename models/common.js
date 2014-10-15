var Very = require('verymodel');

module.exports = {
    types: {
        Name: Very.VeryValidator().notRegex(/[!*'();:@&=+$,/?%#[\]"]/),
    },
};

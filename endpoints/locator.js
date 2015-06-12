var path = require('path');
var modelName = path.basename(module.filename, '.js');

var calls = {

    create: function createAsset(data, cb) {
        this.createRequest(modelName, data, cb);
    },

    get: function getAsset(id, cb) {
        this.getRequest(modelName, id, cb);
    },

    list: function (cb) {
        this.listRequest(modelName, cb);
    },

    update: function updateAsset(id, data, cb) {
        this.updateRequest(modelName, id, data, cb);
    },

    delete: function deleteAsset(id, cb) {
        this.deleteRequest(modelName, id, cb);
    },
    
    deleteAndCreate: function (data, cb) {
      this.rest.asset.listLocators(data.AssetId, function (err, locators) {
        if(!err && locators.length > 0) {
          this.rest.locator.delete(locators[0].toJSON().Id, function (err) {
            if(err) cb(err);
            else {
              this.rest.locator.create(data, cb);
            }
          }.bind(this));
        }
        else{
          this.rest.locator.create(data, cb);
        }
      }.bind(this), {$filter: "AccessPolicyId eq '" + data.AccessPolicyId + "'", $top: 1});
    }
};

module.exports = calls;

var calls = {

    create: function createAsset(data, cb) {
        this.createRequest('asset', data, cb);
    },

    get: function getAsset(id) {
    },

    list: function (cb) {
        this.listRequest('asset', cb);
    },

    update: function updateAsset(id) {
    },

    delete: function deleteAsset(id, cb) {
        this.deleteRequest('asset', id, cb);
    },

    linkContentKey: function linkContentKeyToAsset() {
    },

    unlinkContentKey: function unlinkContentKeyFromAsset() {
    },

};

module.exports = calls;

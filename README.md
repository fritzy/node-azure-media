# Azure Media for Node.js

Azure's Media REST API provides a way to store, encode, and deliver media (video and images).
This library makes using the API easier.

    var AzureMedia = require('azure-media');
    var myconfig = require('./myconfig');

    var api = new AzureMedia(myconfig); // {client_id: 'your azure media id', client_secret: 'your azure media secret'} 
    api.init(function (err) {
        // do your work here or after this callback
    });

## Install

npm install azure-media

## Using Microsoft's Documentation

All of the data structures and endpoints used in this library are documented in [Azure Media Service REST API Reference](http://msdn.microsoft.com/en-us/library/windowsazure/hh973617.aspx).

Each subsection is modeled based on its "Entity Properties" section (eg. [Asset Entity Properties](http://msdn.microsoft.com/en-us/library/windowsazure/hh974277.aspx#asset_entity_properties)).

Each model usable at `API.rest.[lowercase model name]` with create, get, update, list methods.

## REST Endpoints

All REST endpoints are in the initialized api lib at api.rest.someendpoint (eg. `api.rest.asset`)

"data" is a JavaScript object for the appropriate endpoint model documented in the Properties section of each model in [Azure Media Service REST API Reference](http://msdn.microsoft.com/en-us/library/windowsazure/hh973617.aspx).  
Callbacks generally return an object, called a model. It uses [VeryModel](https://github.com/fritzy/VeryModel). VeryModel instances behave like normal objects. If you want a simpler object, call `.toObject()` and use the returned value.

Each endpoint will have some of the following methods:

### update
Signature: `update(id, data, callback)`  
Callback: `function (err, model)`

### create
Signature: `create(data, callback)`  
Callback: `function(err, model)`

Example:

    api.rest.asset.create({Name: 'Some Asset'}, function (err, asset) {
        if (err) {
            console.log(err);
        } else {
            console.log("Created asset: " + asset.Id);
        }
    });

### delete
Signature: `delete(id, callback)`  
Callback: `function(err)`

### get
Signature: `get(id, callback)`  
Callback: `function(err, model)`

### list
Signature: `list(callback, query)`  
Callback: `function(err, model)`

The `query` parameter is a JavaScript object of the query parameters documented in [OData Query String Options](http://www.odata.org/documentation/odata-v2-documentation/uri-conventions/#4_Query_String_Options) (eg: `{'$filter': "Name eq 'Bill'"}`)

###accesspolicy

AccessPolicys should be reused, rather than just creating a new one for every use.
So rather than create, or trying to manage this yourself, use

Signature: `findOrCreate(durationInMinutes, permissions, callback)`  
Callback: `function (err, accesspolicy_model)`

###assetfileindex
###ingestmanifestasset
###job

Signature: `cancel(id, callback)`  
Callback: `function (err)`

###locator
###notificationendpoint
###tasktemplate
###asset


###contentkey
###ingestmanifest
###ingestmanifestfile
###jobtemplate
###mediaprocessor
###task

## Models

Most callbacks return a [VeryModel](https://github.com/fritzy/VeryModel) instance.
These are based on Microsoft's documentation and are implemented in /models/

Some models have extra ORM-like methods, allowing you to interact with the model itself which will work with the Azure REST API behind the scenes.

###accesspolicy
###assetfileindex
###ingestmanifestasset
###job
###locator
###notificationendpoint
###tasktemplate
###asset
###contentkey
###ingestmanifest
###ingestmanifestfile
###jobtemplate
###mediaprocessor
###task

## Workflow Methods

uploadStream

downloadStream

getDownloadURL

encode

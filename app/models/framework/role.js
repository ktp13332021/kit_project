// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

// define schema

var RoleSchema = new Schema({
    code: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    description: String,
    activefrom: Date,
    activeto: Date,
    landingpage: String,
    secureditems: [{
        secitemuid: { type: Schema.ObjectId, ref: 'SecuredItem' },
        secitemname: String,
        sitypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        moduleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        module: { type: String, required: true },
        permissions: [{
            permissionuid: { type: Schema.ObjectId, ref: 'Permission' },
            permissioncode: String,
            isselected: Boolean
        }]
    }],
    ordercategories: [{
        ordercategoryuid: { type: Schema.ObjectId, ref: 'OrderCategory' }
    }],
    reports: [{
        reporttemplateuid: { type: Schema.ObjectId, ref: 'ReportTemplate' }
    }]
});

RoleSchema.plugin(resuable);
module.exports = mongoose.model('Role', RoleSchema);
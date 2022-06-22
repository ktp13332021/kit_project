// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

var SecuredItemSchema = new Schema({
    code: { type: String, required: true, index: true },
    name: { type: String, required: true, index: true },
    sitypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue', required: true },
    moduleuid: { type: Schema.ObjectId, ref: 'ReferenceValue', required: true },
    module: { type: String },
    description: String,
    activefrom: Date,
    activeto: Date,
    formtemplateuid: { type: Schema.ObjectId, ref: 'FormTemplate' },
    permissions: [{ type: Schema.ObjectId, ref: 'Permission' }]
});

SecuredItemSchema.plugin(resuable);
module.exports = mongoose.model('SecuredItem', SecuredItemSchema);
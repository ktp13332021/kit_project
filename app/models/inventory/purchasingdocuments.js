// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var PurchasingDocumentSchema = new Schema({
    /** uploaddate {Date} - the date in which the file was uplaoded */
    uploaddate: Date,
    /** uploadedby {Schema.ObjectId} - the user who uploaded */
    uploadedby: { type: Schema.ObjectId, ref: 'User' },
    /** purchaserequestuid {ObjectId} - if uploaded as part of the purchase rquest  */
    purchaserequestuid: { type: Schema.ObjectId, ref: 'PurchaseRequest' },
    /** purchaseorderuid {ObjectId} - if uploaded as part of the purchase order */
    purchaseorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** scanneddocument String */
    scanneddocument: String,
    /** documentname {string}  */
    documentname: String,
    /** filetype {string}  */
    filetype: String
});

PurchasingDocumentSchema.plugin(resuable);

module.exports = mongoose.model('PurchasingDocument', PurchasingDocumentSchema);
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DisposeDocumentSchema = new Schema({
    /** uploaddate {Date} - the date in which the file was uplaoded */
    uploaddate: Date,
    /** uploadedby {Schema.ObjectId} - the user who uploaded */
    uploadedby: { type: Schema.ObjectId, ref: 'User' },
    /** stocktransferuid {ObjectId} - if uploaded as part of the stock transfer  */
    stocktransferuid: { type: Schema.ObjectId, ref: 'StockTransfer' },
    /** scanneddocument String */
    scanneddocument: String,
    /** documentname {string}  */
    documentname: String,
    /** filetype {string}  */
    filetype: String
});

DisposeDocumentSchema.plugin(resuable);

module.exports = mongoose.model('DisposeDocument', DisposeDocumentSchema);
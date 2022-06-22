/**
 * Schema representing threeway matching  document.
 * The three way matching contains the matching data of PO, GRNs and Invoice.
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module contract
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ThreewayMatchingSchema = new Schema({
    /** vendoruid {ObjectId} - link to vendor master. */
    vendoruid: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
   /** invoicenumber {String} - the invoice number given by vendor */
    invoicenumber : String,
    /** invoicedate {Date} - date and time of invoice*/
    invoicedate : Date,
     /** invoiceamount {Number} - the net amount of the invoice  */
     invoiceamount: Number,
     /** taxamount {Number} - the tax amount of the invoice  */
     taxamount: Number,
     /** discount {Number} -  discount if any given by the vendor */
     discount: Number,
     /** roundoff {Number} - round off - different to be matched */
     roundoff: Number,
     /** diffamount {Number} - difference in amount - different to be matched */
     diffamount: Number,
     /** statusuid {ObjectId} - reference value code : INVSTS - RAISED,  COMPLETED */
     statusuid: {
         type: Schema.ObjectId,
         ref: 'ReferenceValue'
     },
     /** comments {String} - comments or remarks */
    comments: String,
     /** recordedby {ObjectId} - user who is raising it */
     recordedby: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    podetails : [{
                pouid : {type:Schema.ObjectId, ref: 'PurchaseOrder'},
                poitemdetails : [{type:Schema.ObjectId}]
    }],
    goodsreceivedetails : [{
        goodsreceiveuid : {type:Schema.ObjectId, ref: 'GoodsReceive'},
        goodsreceiveitemdetails : [{type:Schema.ObjectId}]
    }],
});

ThreewayMatchingSchema.plugin(resuable);

module.exports = mongoose.model('ThreewayMatching', ThreewayMatchingSchema);

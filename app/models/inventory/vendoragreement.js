/**
 * Schema representing vendor agreement document.
 * The vendor agreement document containts the details for purchasing price.
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
var VendorAgreementSchema = new Schema({
    /** vendoruid {ObjectId} - reference to the vendor master */
    vendoruid: {
        type: Schema.ObjectId,
        ref: 'Vendor'
    },
    /** activefrom {Date} - start date for the department */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the department. Can be null for active departments. */
    activeto: Date,

    /** itemdetails [] - the details of the items received */
    itemdetails: [{
        itemmasteruid: {
            type: Schema.ObjectId,
            ref: 'ItemMaster'
        },
        code: {
        type: String
        },
        /** Name {string} defines the  name given to the department*/
        name: {
            type: String
        },
        /** purchasinguomuid {ObjectId} - reference domain code : INVUOM */
        purchasinguomuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /** taxcodeuid {ObjectId} - reference to the GST Tax Code */
        taxcodeuid: {
            type: Schema.ObjectId,
            ref: 'TaxMaster'
        },
        tieredpricing : [{
            minimumquantity : Number,
            maximumquantity : Number,
            unitprice : Number,
            freequantity : Number,
            activefrom : Date,
            activeto : Date
        }]
       
    }]
});

VendorAgreementSchema.plugin(resuable);

module.exports = mongoose.model('VendorAgreement', VendorAgreementSchema);

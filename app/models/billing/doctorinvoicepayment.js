/**
 * Schema representing the Doctor Invoice Payment.
 * The AccountReceivable schema is populated during the AR Process on the payment is made.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module AccountReceivable
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DoctorInvoicePaymentSchema = new Schema({
    doctorinvoiceuid: {
        type: Schema.ObjectId,
        ref: 'DoctorInvoice'
    },
    /** sequencenumber - sequence number uniquely generated for the AR*/
    sequencenumber: String,
    /** paiddate {Date} - date which the payment was made */
    paiddate: {
        type: Date,
        required: true
    },
    /** paidamount {Number} - the amount of payment made */
    paidamount: Number,
    /** bankcharges {Number} - less bank commission charges */
    bankcharges: Number,
    /** comments - comments to be printed in the receipt */
    comments: String,
    /** iscancelled {Boolean} - whether this entry is cancelled */
    iscancelled: Boolean,
    /** canceldate {Date} - date which the AR was cancelled */
    canceldate: {
        type: Date
    },
    /** cancelledbyuseruid {ObjectId} - reference to the user who cancelled it */
    cancelledbyuseruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** cancelreasonuid {ObjectId} - reference domain code : BILRFD */
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** cancelcomments - cancel comments to be printed in the receipt */
    cancelcomments: String

});

DoctorInvoicePaymentSchema.plugin(resuable);

module.exports = mongoose.model('DoctorInvoicePayment', DoctorInvoicePaymentSchema);
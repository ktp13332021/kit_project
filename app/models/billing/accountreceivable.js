/**
 * Schema representing the Account Receivable Settlement.
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

var PatientBillDetailsSchema = new Schema({
    /** patientbilluid {ObjectId} - reference to PatientBill against which this payment is made*/
    patientbilluid: { type: Schema.ObjectId, ref: 'PatientBill' },
    /** patientpaymentuids [{ObjectId}] - reference to PaymentDetails of PatientBill*/
    patientpaymentuids: [{ type: Schema.ObjectId }],
    /** adjusteddeposits [{ObjectId}] - reference to the deposits which were adjusted due to this AR*/
    adjusteddeposits: [{ type: Schema.ObjectId, ref: 'Deposit' }],
    /** adjustedcreditnotes [{ObjectId}] - reference to the creditnotes which were adjusted due to this AR*/
    adjustedcreditnotes: [{ type: Schema.ObjectId, ref: 'CreditNote' }],
    /** amountsettled {Number} - partial amount that has been settled for this particular bill from total AR*/
    amountsettled: Number
});

// define schema
var AccountReceivableSchema = new Schema({
    /** sequencenumber - sequence number uniquely generated for the AR*/
    sequencenumber: String,
    /** settlementdate {Date} - date which the payment was made */
    settlementdate: {
        type: Date,
        required: true
    },
    /** tpauid {ObjectId} - reference to the TPA from which payment was received */
    tpauid: {
        type: Schema.ObjectId,
        ref: 'TPA'
    },
    /**useruid {ObjectId} - reference to the user who created the AR*/
    useruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** userdepartmentuid {ObjectId} - reference to the user logged in department who created the AR*/
    userdepartmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** internalcomments - comments to be shown in the screen to users */
    internalcomments: String,
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
    cancelcomments: String,
    /** patientbilldetails [{}] - composite schema containing the list of bill details */
    patientbilldetails: [PatientBillDetailsSchema],
    /** isindividualbill {Boolean} - whether this AR was created for individual bills or not*/
    isindividualbill: Boolean,
    /** totalreceivedamount {Number} - total amount that was received in this AR*/
    totalreceivedamount: Number
});

AccountReceivableSchema.plugin(resuable);

module.exports = mongoose.model('AccountReceivable', AccountReceivableSchema);
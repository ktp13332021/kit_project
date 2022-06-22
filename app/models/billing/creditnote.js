/**
 * Schema representing the Credit Notes.
 * The Credit Note schema stores the all the detail such as patient, visit details, creditnote number, credit amount, date, comments.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module CreditNote
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var CreditNoteSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: {
        type: Schema.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: {
        type: Schema.ObjectId,
        ref: 'PatientVisit'
    },
    /** sequencenumber - sequence number uniquely generated for the credit note*/
    sequencenumber: String,
    /** creditdate {Date} - date which the credit note was made */
    creditdate: {
        type: Date,
        required: true
    },
    /** currencyuid {ObjectId} - the currency details - referencedomain code : CURNCY*/
    currencyuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** creditamount{Number} - paidamount in paid currency */
    creditamount: Number,
    /** localcurrencyamount{Number} - paidamount in local currency */
    amount: Number,
    /** exchangerateused {Number} - exchange rate that was used on that date */
    exchangerageused: Number,
    /** orginvoicerefuid {ObjectId} - reference to the original invoice reference */
    orginvoicerefuid: {
        type: Schema.ObjectId,
        ref: 'PatientBill'
    },
    /** reference to patient billed items */
    creditnoteitems: [{
        patientbilleditemuid: {
            type: Schema.ObjectId,
            required: true
        },
        orderitemuid: {
            type: Schema.ObjectId,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    /**useruid {ObjectId} - reference to the user who created the credit note*/
    useruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** userdepartmentuid {ObjectId} - reference to the count in which the deposit was received */
    userdepartmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /**approvedbyuseruid {ObjectId} - reference to the user who approved the credit note*/
    approvedbyuseruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** internalcomments - comments to be shown in the screen to users */
    internalcomments: String,
    /** comments - comments to be printed in the receipt */
    comments: String,
    /** isipdcredit {Boolean} - whether this credit note is for an IPD visit or not*/
    isipdcredit: Boolean,
    /** iscancelled {Boolean} - whether this entry is cancelled */
    iscancelled: Boolean,
    /** cancelledbyuseruid {ObjectId} - reference to the user who cancelled it */
    cancelledbyuseruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** cancelreasonuid {ObjectId} - reference domain code : CANRSN */
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** cancelcomments - cancel comments to be printed in the receipt */
    cancelcomments: String,
    /** isadjusted - whether this credit note entry is an adjustment entry or not*/
    isadjusted: Boolean,
    /** adjustedbilluid - reference to PatientBill against which this entry has been adjusted*/
    adjustedbilluid: {
        type: Schema.ObjectId,
        ref: 'PatientBill'
    },
    /** orgcreditnoteuid - self reference (reference to the original credit note document in case of adjustment entries)*/
    orgcreditnoteuid: {
        type: Schema.ObjectId,
        ref: 'CreditNote'
    },
    /** isaradjustment - whether this entry was made through AR or not*/
    isaradjustment: Boolean,
    /** roundoff - round off value on total credit note amount*/
    roundoff: Number,
    /** discounttypeuid - discounttype of creditnote. Reference to DSCtYP*/
    discounttypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** shouldnotbeused {Boolean} - Whether this credit note should be used or not during calculations*/
    shouldnotbeused: Boolean
});

CreditNoteSchema.plugin(resuable);

module.exports = mongoose.model('CreditNote', CreditNoteSchema);
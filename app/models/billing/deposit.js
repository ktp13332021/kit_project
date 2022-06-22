/**
 * Schema representing the Deposits.
 * The Deposit schema stores the all the detail such as patient, visit details, receipt number, deposit amount, date, comments.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module Deposit
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billingenums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DepositSchema = new Schema({
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
    /** sequencenumber - sequence number uniquely generated for the deposit or refund*/
    sequencenumber: String,
    /** depositdate {Date} - date which the deposit was made */
    depositdate: {
        type: Date,
        required: true
    },
    /** deposittype {ObjectId} - enum : GENERAL, ENCOUNTER, DEPARTMENT, BILLINGGROUP */
    deposittype: {
        type: String,
        enum: [
            billingenums.depositTypes.general,
            billingenums.depositTypes.encounter,
            billingenums.depositTypes.department,
            billingenums.depositTypes.billingGroup
        ],
        required: true
    },
    /** entypeuid {ObjectId} - optional encounter - referencedomain code : ENTYPE - OUTPATIENT OR INPATIENT */
    entypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** departmentuid {ObjectId} - optional department - reference to Department */
    departmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** billinggroupuid {ObjectId} - deposited towards optional billing group */
    billinggroupuid: {
        type: Schema.ObjectId,
        ref: 'BillingGroup'
    },
    /** paidby {String} - the nextofkin name who paid the deposit */
    paidby: String,
    /** currencyuid {ObjectId} - the currency details - referencedomain code : CURNCY*/
    currencyuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** paidamount {Number} - the amount of deposit paid */
    paidamount: Number,
    /** paymentmodeuid {ObjectId} - referencedomain code : PAYMOD - Cash / Credit Card / Cheque / Online */
    paymentmodeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** denominationuid {ObjectId} - Denomination details of this deposit, if payment mode is Cash */
    denominationuid: {
        type: Schema.ObjectId,
        ref: 'Denomination'
    },
    /** carddetails - details about the card payment */
    carddetails: {
        /** cardtypeuid {ObjectId} - referencedomaincode CCTYPE - Mastercard, Visa, American Express */
        cardtypeuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /** cardnumber - the last 4 digits of the card */
        cardnumber: String,
        /** nameasincard - Name as in the card */
        nameasincard: String,
        /** Bank name {ObjectId} - Reference domain code : BANKNM */
        banknameuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /** transactionrefnumber : String */
        transactionrefnumber: String
    },
    otherpaymentdetails: {
        /** Bank name {ObjectId} - Reference domain code : BANKNM */
        banknameuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue'
        },
        /** instrumentdate {Date} - Date of the cheque or transaction */
        instrumentdate: Date,
        /** instrumentnumber : String */
        instrumentnumber: String
    },
    /** localcurrencyamount{Number} - paidamount in local currency */
    amount: Number,
    /** exchangerateused {Number} - exchange rate that was used on that date */
    exchangerateused: Number,
    /**useruid {ObjectId} - reference to the user who received the payment - internal captured*/
    useruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** userdepartmentuid {ObjectId} - reference to the Department in which the deposit was received  - internal captured*/
    userdepartmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** internalcomments - comments to be shown in the screen to users */
    internalcomments: String,
    /** comments - comments to be printed in the receipt */
    comments: String,
    /** isrefund {Boolean} - whether this entry is a refund */
    isrefund: Boolean,
    /** orgdepositrefuid {ObjectId} - reference to the original deposit reference */
    orgdepositrefuid: {
        type: Schema.ObjectId,
        ref: 'Deposit'
    },
    /** iscancelled {Boolean} - whether this entry is cancelled */
    iscancelled: Boolean,
    /** cancelledbyuseruid {ObjectId} - reference to the user who cancelled it */
    cancelrefundbyuseruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** cancelreasonuid {ObjectId} - reference domain code : CANRSN */
    cancelrefundreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** cancelcomments - cancel comments to be printed in the receipt */
    cancelrefundcomments: String,
    /** isadjusted - whether this entry is an adjustment for bill */
    isadjusted: Boolean,
    /** adjustedbilluid - patientbill id for which this adjustment is made for */
    adjustedbilluid: {
        type: Schema.ObjectId,
        ref: 'PatientBill'
    },
    /** isipddeposit {Boolean} - Whether this deposit is made for an IPD visit or not*/
    isipddeposit: Boolean,
    /** isaradjustment - whether this entry was made through AR or not*/
    isaradjustment: Boolean,
    /** shouldnotbeused {Boolean} - Whether this deposit should be used or not during calculations*/
    shouldnotbeused: Boolean
});

DepositSchema.plugin(resuable);

module.exports = mongoose.model('Deposit', DepositSchema);
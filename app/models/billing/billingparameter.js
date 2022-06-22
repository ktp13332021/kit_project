/**
 * Schema representing the Billing Parameter.
 * The Billing Parameter schema stores the all the options such as default payor, cancel duration, etc..
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module Billing Parameter
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billingEnums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var BillingParameterSchema = new Schema({

    /** defaultcurrencyuid {ObjectId} - the default currency to be used. reference domain code : CURNCY*/
    defaultcurrencyuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** defaultpaymentmodeuid {ObjectId} - the default payment mode to be used. reference domain code : PAYMOD*/
    defaultpaymentmodeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** defaultpayor {ObjectId} - the default payor that needs to be inserted for each patient */
    defaultpayoruid: {
        type: Schema.ObjectId,
        ref: 'Payor'
    },
    /** cancelbilldurationforopd {Date} - the cancel bill cut off time (only time part) for OPD for receipt */
    cancelbilldurationforopd: Date,
    /** cancelbilldurationforipd {Number} - the cancel bill cut off time (only time part) for IPD for receipt */
    cancelbilldurationforipd: Date,
    /** refundapprovalrequired {Boolean} - whether refund process requires approval */
    refundapprovalrequired: Boolean,
    /** billfinalizationrequired {Boolean} - whether bill finalization & receipt generation is diff process for IPD */
    billfinalizationrequired: Boolean,
    /** specialdiscountapprovalreqd {Boolean} - whether special discount needs approval */
    specialdiscountapprovalreqd: Boolean,
    /** defaultpaidamount {Boolean} - whether the balance amount should be defaulted as paid amount */
    defaultpaidamount: Boolean,
    /** denominationreqdforopd {Boolean} - whether currency denomination to be captured for opd */
    denominationreqdforopd: Boolean,
    /** denominationreqdforipd {Boolean} - whether currency denomination to be captured for ipd */
    denominationreqdforipd: Boolean,
    /** admissiondatetariff {Boolean} - whether to apply admission date tariff incase of tariff change while inpatient stay */
    admissiondatetariff: Boolean,
    /** amountprecision {Number} - number of decimal places to be displayed for all AMOUNT values */
    amountprecision: Number,
    /** cwquerymaxduration {Number} - Maximum number of days that can be queryied in Cashier Worklist function*/
    cwquerymaxduration: Number,
    /** displaytaxfield {Boolean} - whether to display tax fields in transactions */
    displaytaxfield: Boolean,
    /** maxcashrefund {Number} - Maximum amount of cash refund that can be made*/
    maxcashrefund: Number,
    /** bedcalculationuid {ObjectId} - the . reference domain code : BEDCAL*/
    bedcalculationuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** ipdgracehours {Number} - Maximum grace hours that can be allowed for IPD.*/
    ipdgracehours: Number,
    /** halfchargeperiod {Number} - Hours of time for which Half charge must be applied for IPD.*/
    halfchargeperiod: Number,
    /** roundoffat {String} - Whether round off should be applied at Bill level or Billing group level for receipt */
    roundoffat: {
        type: String,
        enum: [
            billingEnums.params.roundOffAt.billLevel,
            billingEnums.params.roundOffAt.billingGroupLevel
        ],
        required: true
    },
    /** roundofflevel {String} - Whether the amounts must be FLOORed, CEILed or MIDPOINTed to the nearest XXX for receipt */
    roundofflevel: {
        type: String,
        enum: [
            billingEnums.params.roundOffLevel.floor,
            billingEnums.params.roundOffLevel.ceil,
            billingEnums.params.roundOffLevel.midPoint
        ],
        required: true
    },
    /** roundoffdiscount {Boolean} - Whether discount should be rounded off or not for receipt */
    roundoffdiscount: Boolean,
    /** enableroundoff {Boolean} - Whether to apply Round Off or not for receipt */
    enableroundoff: Boolean,
    /** roundoffmidpoint {String} - Nearest mid point for calculating mid point level round off for receipt*/
    roundoffmidpoint: {
        type: String,
        enum: [
            billingEnums.params.roundOffMidPoints._25,
            billingEnums.params.roundOffMidPoints._50
        ]
    },
    /** maxpercentageforbillspecialdiscount {Boolean} - Maximum percentage of bill amount that can be given as bill level special discount. */
    maxpercentageforbillspecialdiscount: Number,
    /** allow patient discharge even if billing is not completed */
    allowpatientdischargebeforebilling: Boolean,
    /** roundoffatinvoice {String} - Whether round off should be applied at Bill level or Billing group level for invoice */
    roundoffatinvoice: {
        type: String,
        enum: [
            billingEnums.params.roundOffAt.billLevel,
            billingEnums.params.roundOffAt.billingGroupLevel
        ],
        required: true
    },
    /** roundofflevelinvoice {String} - Whether the amounts must be FLOORed, CEILed or MIDPOINTed to the nearest XXX for invoice */
    roundofflevelinvoice: {
        type: String,
        enum: [
            billingEnums.params.roundOffLevel.floor,
            billingEnums.params.roundOffLevel.ceil,
            billingEnums.params.roundOffLevel.midPoint
        ],
        required: true
    },
    /** roundoffdiscountinvoice {Boolean} - Whether discount should be rounded off or not for invoice*/
    roundoffdiscountinvoice: Boolean,
    /** enableroundoffinvoice {Boolean} - Whether to apply Round Off or not for invoice */
    enableroundoffinvoice: Boolean,
    /** roundoffmidpointinvoice {String} - Nearest mid point for calculating mid point level round off for invoice */
    roundoffmidpointinvoice: {
        type: String,
        enum: [
            billingEnums.params.roundOffMidPoints._25,
            billingEnums.params.roundOffMidPoints._50
        ]
    },
    /** cancelbilldurationforopdinvoice {Date} - the cancel bill cut off time (only time part) for OPD for invoice */
    cancelbilldurationforopdinvoice: Date,
    /** cancelbilldurationforipdinvoice {Number} - the cancel bill cut off time (only time part) for IPD for invoice */
    cancelbilldurationforipdinvoice: Date,
    /** useoptariffforhomemed {Boolean} - Whether OP tariff must be used for Homemed medications of IP. */
    useoptariffforhomemed: Boolean,
    /** cancelbilldaysforopd {Number} - Number of days upto which receipt bill can be allowed to be cancelled for OPD.*/
    cancelbilldaysforopd: Number,
    /** cancelbilldaysforipd {Number} - Number of days upto which receipt bill can be allowed to be cancelled for IPD.*/
    cancelbilldaysforipd: Number,
    /** cancelbilldaysforopdinvoice {Number} - Number of days upto which invoice bill can be allowed to be cancelled for OPD.*/
    cancelbilldaysforopdinvoice: Number,
    /** cancelbilldaysforipdinvoice {Number} - Number of days upto which invoice bill can be allowed to be cancelled for IPD.*/
    cancelbilldaysforipdinvoice: Number,
    /** billcancelpaymentsisdeposit {Boolean} - Whether the payments must be converted to Deposits or not during Bill Cancel and AR Cancel*/
    billcancelpaymentsisdeposit: Boolean
});

BillingParameterSchema.plugin(resuable);

module.exports = mongoose.model('BillingParameter', BillingParameterSchema);
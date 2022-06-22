/**
 * Schema representing the Patient Bill.
 * The PatientBill schema is populated during the billing process once the bill is committed.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module PatientBill
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billingenums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var PatientBilledItemSchema = new Schema({
    /** orderitemname {String} - denoormalized here for readability purposes */
    orderitemname: {
        type: String
    },
    /** orderitemuid {ObjectId} - reference to the order item */
    orderitemuid: {
        type: Schema.ObjectId,
        required: true
    },
    /** chargecodetype {String} - differencetiates between order and package */
    chargecodetype: {
        type: String,
        enum: [
            billingenums.chargeCodeTypes.patientOrder,
            billingenums.chargeCodeTypes.patientPackage
        ]
    },
    /** tariffuid {ObjectId} - reference to the tariff */
    tariffuid: {
        type: Schema.ObjectId,
        required: true
    },
    /** ordernumber {String} -  for traceability purposes */
    ordernumber: String,
    /** patientorderuid {ObjectId} - reference to the patient order for traceability purposes */
    patientorderuid: {
        type: Schema.ObjectId,
        required: true,
    },
    /** patientorderitemuid {ObjectId} - refernece to the patient order items for traceability purposes*/
    patientorderitemuid: {
        type: Schema.ObjectId,
        required: true
    },
    /** quantity {Number} - the actual quantity */
    quantity: {
        type: Number,
        required: true
    },
    /** unitprice {Number} - the unit price based on the tariff */
    unitprice: {
        type: Number,
        required: true
    },
    /** payordiscount {Number} - payor discount based on agreement */
    payordiscount: {
        type: Number
    },
    /** specialdiscount {Number} - special discount if any given */
    specialdiscount: {
        type: Number
    },
    /** taxmasteruid {ObjectId} - reference to tax code */
    taxmasteruid: {
        type: Schema.ObjectId,
        ref: 'TaxMaster'
    },
    /** taxamount {ObjectId} - the total amount of tax */
    taxamount: {
        type: Number
    },
    /** netamount {Number} - the final amount for the row */
    netamount: {
        type: Number
    },
    /** overriddenprice {Boolean} - whether the price is overridden by the careprovider - defaults false */
    overriddenprice: {
        type: Boolean
    },
    /** departmentuid {ObjectId} - reference to the department which raised the order */
    departmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** careprovideruid {ObjectId} - reference to the careprovider who ordered */
    careprovideruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** chargedate {Date} - date for which the chargecode is made  */
    chargedate: {
        type: Date,
        required: true
    },
    /** chargecodeuid {ObjectId} - reference to the chargecodes from which this item is billed */
    chargecodeuid: {
        type: Schema.ObjectId,
        ref: 'PatientChargeCode'
    },
    /** billinggroupuid {ObjectId} - reference to billing group to which this item was allocate while settling bill */
    billinggroupuid: {
        type: Schema.ObjectId,
        ref: 'BillingGroup'
    },
    /** billingsubgroupuid {ObjectId} - reference to billing sub group to which this item was allocate while settling bill */
    billingsubgroupuid: {
        type: Schema.ObjectId,
        ref: 'BillingGroup'
    },
    /** roundoff {Number} - the amount added with net amount for rounding it. */
    roundoff: Number,
    /** unitcost {Number} - the cost of the item from billable item or wac*/
    unitcost: {
        type: Number
    },
    /** profitability {Number} - profit in percentage*/
    profitability: {
        type: Number
    }
});
var PaymentDetailsSchema = new Schema({
    /** sequencenumber - sequence number uniquely generated for each payment */
    sequencenumber: String,
    /** paiddate {Date} - date which the payment was made */
    paiddate: {
        type: Date,
        required: true
    },
    /** currencyuid {ObjectId} - the currency details - referencedomain code : CURNCY*/
    currencyuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** paidamount {Number} - the amount of payment made */
    paidamount: Number,
    /** paymentmodeuid {ObjectId} - referencedomain code : PAYMOD - Cash, Credit Card, Cheque, Online, Deposit, Credit Note*/
    paymentmodeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** denominationuid {ObjectId} - Denomination details of this payment, if payment mode is Cash */
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
        transactionrefnumber: String,
        /** bankcharges {Number} - less bank commission charges */
        bankcharges : Number
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
    /** returnchange {Number} - the local currency amount that was returned to patient against his excess payment of bill*/
    returnchange: Number,
    /** iscancelled {Boolean} - whether this entry is cancelled */
    iscancelled: Boolean,
    /** canceldate {Date} - date which the payment was cancelled */
    canceldate: {
        type: Date
    },
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
    /**useruid {ObjectId} - reference to the user who created the payment*/
    useruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** userdepartmentuid {ObjectId} - reference to the user logged in department who created the payment*/
    userdepartmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** isarsettlement {Boolean} - Whether this payment was made through AR or not*/
    isarsettlement: Boolean,
    /** shouldnotbeused {Boolean} - Whether this payment should be used in calculations or not. (This value will be true for Deposits and Credit Notes mode of payments)*/
    shouldnotbeused: Boolean
});

// define schema
var PatientBillSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        ref: 'Patient'
    },
    /** patientvisituid {ObjectId} - reference to the visit schema */
    patientvisituid: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        ref: 'PatientVisit'
    },
    /** sequencenumber - sequence number uniquely generated for the Bill*/
    sequencenumber: String,
    /** billdate {Date} - date which the bill was made */
    billdate: {
        type: Date,
        required: true
    },
    /** payoruid {ObjectId} - link to the payor schema */
    payoruid: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Payor'
    },
    /** payoragreementuid {ObjectId} - link to the payoragreement schema */
    payoragreementuid: {
        type: Schema.ObjectId,
        required: true,
        ref: 'PayorAgreement'
    },
    /** tpauid  */
    tpauid: {
        type: Schema.ObjectId,
        ref: 'TPA'
    },
    /**useruid {ObjectId} - reference to the user who generated the bill - internal captured*/
    useruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** userdepartmentuid {ObjectId} - reference to the user logged in department who generated the bill  - internal captured*/
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
    /** orgbillrefuid {ObjectId} - reference to the original patient bill reference */
    orgbillrefuid: {
        type: Schema.ObjectId,
        ref: 'PatientBill'
    },
    /** iscancelled {Boolean} - whether this entry is cancelled */
    iscancelled: Boolean,
    /** canceldate {Date} - date which the bill was cancelled */
    canceldate: {
        type: Date
    },
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
    /** patientbilleditems [{}] - composite schema containing the list of charge codes that are billed */
    patientbilleditems: [PatientBilledItemSchema],
    /** paymentdetails[{}] - details about the payments made. */
    paymentdetails: [PaymentDetailsSchema],
    /** billtemplateuid {ObjectId} - template that has to be used for printing , reference to ReportTemplate */
    billtemplateuid: {
        type: Schema.ObjectId
    },
    /** roundoff {Number} - the amount added with total bill amount for rounding it. */
    roundoff: Number,
    /** totalbillamount {Number} - the total bill amount. */
    totalbillamount: Number,
    /** isipdbill {Boolean} - whether this bill is for an IPD visit or not*/
    isipdbill: Boolean,
    /*isfullysettled {Boolean} - whether full payment has been settled for this total bill amount*/
    isfullysettled: Boolean,
    /** totalcopayamount {Number} - total copay amount of the bill*/
    totalcopayamount: Number,
    /** isinterim {Boolean} - whether this bill was settled as interim bill or not.*/
    isinterim: Boolean,
    /** gldetailsuid {ObjectId} - Reference to PayorGuaranteeLetter.*/
    gldetailsuid: {
        type: Schema.ObjectId,
        ref: 'PayorGuaranteeLetter'
    }
});

PatientBillSchema.plugin(resuable);

module.exports = mongoose.model('PatientBill', PatientBillSchema);

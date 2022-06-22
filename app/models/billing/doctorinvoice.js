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
    /** patientbilleditemuid {ObjectId} - refernece to the patient billed item for traceability purposes*/
    patientbilleditemuid: {
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
    /** chargedate {Date} - date for which the chargecode is made  */
    chargedate: {
        type: Date,
        required: true
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

// define schema
var DoctorInvoiceSchema = new Schema({
    /** isdoctorinvoice {Boolean}  - true for Doctor Invoice,  false for Doctor Share */
    isdoctorinvoice: Boolean,
    /**careprovideruid {ObjectId} - reference to the careprovider for whom the invoice is generated*/
    careprovideruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** gstregno {String} - tax registration number */
    gstregno: String,
    /** companyname {String} - company name used for tax registration purposes */
    companyname: String,
    /** companyaddress {String} - address of the company */
    companyaddress: String,
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
    /** sequencenumber - sequence number uniquely generated for the Doctor Invoice*/
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
    /** patientbilluid {ObjectId} - reference to the original patient bill reference */
    patientbilluid: {
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
    patientbilleditems: [PatientBilledItemSchema]
});

DoctorInvoiceSchema.plugin(resuable);

module.exports = mongoose.model('DoctorInvoice', DoctorInvoiceSchema);
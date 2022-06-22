/**
 * Schema representing the Patient Charge Codes.
 * The Patient charge codes get populated upon order (raising or executing) and is a intermediate schema before the invoice is produced.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module PatientChargeCode
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billingEnums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation


// define schema
var PatientChargeCodeSchema = new Schema({
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
    /** allocationinitialized {Boolean} - whether the allocation is started for this entry - defaults to false*/
    allocationinitialized: {
        type: Boolean
    },
    /** chargecodes [{}] - composite schema containing the list of charge codes */
    chargecodes: [{
        /** orderitemname {String} - denoormalized here for readability purposes */
        orderitemname: {
            type: String
        },
        /** orderitemuid {ObjectId} - reference to the order item */
        orderitemuid: {
            type: Schema.ObjectId,
            required: true
        },
        /** tariffuid {ObjectId} - reference to the tariff */
        tariffuid: {
            type: Schema.ObjectId,
            required: true
        },
        /** ordernumber {String} -  for traceability purposes */
        ordernumber: String,
        /** chargecodetype {String} - differencetiates between order and package */
        chargecodetype: {
            type: String,
            enum: [
                billingEnums.chargeCodeTypes.patientOrder,
                billingEnums.chargeCodeTypes.patientPackage,
            ]
        },
        /** patientorderuid {ObjectId} - reference to the patient order or patient package for traceability purposes */
        patientorderuid: {
            type: Schema.ObjectId,
            required: true
        },
        /** patientorderitemuid {ObjectId} - refernece to the patient order items or patient package for traceability purposes*/
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
        /** visitpayoruid {ObjectId} - reference to the visit payor */
        visitpayoruid: {
            type: Schema.ObjectId
        },
        /** allocatedpayoruid {ObjectId} - reference to the allocated payor */
        allocatedpayoruid: {
            type: Schema.ObjectId,
            ref: 'Payor'
        },
        /** allocatedagreementuid {ObjectId} - reference to the allocated agreement */
        allocatedagreementuid: {
            type: Schema.ObjectId,
            ref: 'PayorAgreement'
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
        /** issplit {Boolean} - whether the item has been split - defaults to false*/
        issplit: {
            type: Boolean
        },
        /** splitparentuid {ObjectId} - self reference uid  - to be used in case of undo the split */
        splitparentuid: {
            type: Schema.ObjectId
        },
        /** statusflag {String} - Whether the order raised with this charge code has been cancelled or not . A or D */
        statusflag: String,
        /** isbilled {Boolean} - Whether bill is settled or not for this charge code. Defaults to false. */
        isbilled: Boolean,
        /** patientbilluid {ObjectId} - populate with patientbilluid if it isbilled = true, if not null */
        patientbilluid : {type : Schema.ObjectId, ref : 'PatientBill'},
        /* mergedto {ObjectId} - self reference uid - to identify which document was this entry merged to while merging unpaid charge codes of previous visits.*/
        mergedto: {
            type: Schema.ObjectId
        },
        /* mergedfrom {ObjectId} - self reference uid - to identify which document was this entry merged from while merging unpaid charge codes of previous visits.*/
        mergedfrom: {
            type: Schema.ObjectId
        },
        /* mergedfromchargecodeitemuid {ObjectId} - reference to the inner id of charge codes array from which this was merged.*/
        mergedfromchargecodeitemuid: {
            type: Schema.ObjectId
        },
        /** billinggroupuid {ObjectId} - reference to billing group to which this charge code is allocated to*/
        billinggroupuid: {
            type: Schema.ObjectId
        },
        /** billingsubgroupuid {ObjectId} - reference to billing sub group to which this charge code is allocated to*/
        billingsubgroupuid: {
            type: Schema.ObjectId
        },
        /** specialdiscountlevel {Number} - Whether the special discount is applied at Bill level (0) or Billing group level (1) or Billing sub group level (2) or Item level (3), for this charge code*/
        specialdiscountlevel: Number,
        /** ishomemedorder {Boolean} - Whether the patient order item linked with this charge code is of type Discharge Medications or not*/
        ishomemedorder: Boolean,
        /** orgquantity {Number} - the original quantity before split - will be used by interface */
        orgquantity: {
            type: Number
        },
        /** unitcost {Number} - the cost of the item from billable item or wac in case of medicine and supply*/
        unitcost: {
            type: Number
        }
    }]
});

PatientChargeCodeSchema.plugin(resuable);

module.exports = mongoose.model('PatientChargeCode', PatientChargeCodeSchema);

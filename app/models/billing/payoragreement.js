/**
 * Schema representing the PayorAgreement.
 * The PayorAgreement schema stores the all the detail such as code, name, inclusions exclusions, coverage limits, discounts, homemed limits, etc.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module PayorAgreement
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billingEnums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var PayorAgreementSchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given for the agreement*/
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the agreement */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the agreement. */
    activeto: Date,
    /** billtype {String} - type of the bill whether Invoice or Receipt  */
    billtype: {
        type: String,
        enum: [
            billingEnums.billTypes.invoice,
            billingEnums.billTypes.receipt
        ],
        required: true
    },
    /** encountertype {ObjectId} - type of the encounter - domaincode : ENTYPE  combobox*/
    encountertypeuid: {
        type: Schema.ObjectId,
        reference: 'ReferenceValue'
    },
    /** primarytariffuid {ObjectId} - reference to the primary tariff domaincode : TARIFF  combobox*/
    primarytariffuid: {
        type: Schema.ObjectId,
        reference: 'ReferenceValue'
    },
    /** secondarytariffuid {ObjectId} - reference to the secondary tariff domaincode : TARIFF  combobox*/
    secondarytariffuid: {
        type: Schema.ObjectId,
        reference: 'ReferenceValue'
    },
    /** tertiarytariffuid {ObjectId} - reference to the tertiary tariff domaincode : TARIFF  combobox*/
    tertiarytariffuid: {
        type: Schema.ObjectId,
        reference: 'ReferenceValue'
    },
    /** ispackageallowed {Boolean} - whether packages are allowed in this agreement - default true */
    ispackageallowed: Boolean,
    /** isspecialdiscallowed {Boolean} - whether special discount or discretionary discount allowed in this agreement - default true */
    isspecialdiscallowed: Boolean,
    /** claimpercentage {Number} - the maximum claim percentage in this agreement. Default is 100. The rest will be paid by the patient or next payor */
    claimpercentage: Number,
    /** allgroupsincluded {Boolean} - whether all billing groups are included or only some. - default true  */
    allgroupsincluded: Boolean,
    /** inclusions {ObjectId} - references to specific billing groups that are included - chips control */
    inclusions: [{
        type: Schema.ObjectId,
        reference: 'BillingGroup'
    }],
    /** includeditems {ObjectId} - references to item level inclusions  -chips control*/
    includeditems: [{
        type: Schema.ObjectId,
        reference: 'OrderItem'
    }],
    /** limits {ObjectId} - limits to billing groups if any needs to be mentioned here */
    inclusionlimits: [{
        billinggroupuid: {
            type: Schema.ObjectId,
            reference: 'BillingGroup'
        },
        maximumlimit: Number,
        copayamount: Number,
        copaypercentage: Number
    }],
    /** limits {ObjectId} - limits to item level if any needs to be mentioned here */
    inclusionitemlimits: [{
        orderitemuid: {
            type: Schema.ObjectId,
            reference: 'OrderItem'
        },
        maximumlimit: Number,
        copayamount: Number,
        copaypercentage: Number
    }],
    /** exclusions {ObjectId} - references to specific billing groups that are excluded - chips control*/
    exclusions: [{
        type: Schema.ObjectId,
        reference: 'BillingGroup'
    }],
    /** excludeditems {ObjectId} - references to item level exclusions - chips control*/
    excludeditems: [{
        type: Schema.ObjectId,
        reference: 'OrderItem'
    }],
    /** groupdiscounts {} - details of discounts at billing group level*/
    groupdiscounts: [{
        /** domaincode : TARIFF combo*/
        tarifftypeuid: {
            type: Schema.ObjectId,
            reference: 'ReferenceValue'
        },
        /** autocomplete */
        billinggroupuid: {
            type: Schema.ObjectId,
            reference: 'BillingGroup'
        },
        discountamount: Number,
        discountpercentage: Number
    }],
    /** itemleveldiscounts {} - details of discounts at itemlevel level*/
    itemleveldiscounts: [{
        /** domaincode : TARIFF combo*/
        tarifftypeuid: {
            type: Schema.ObjectId,
            reference: 'ReferenceValue'
        },
        /** autocomplete */
        orderitemuid: {
            type: Schema.ObjectId,
            reference: 'OrderItem'
        },
        discountamount: Number,
        discountpercentage: Number
    }],
    payoragreementalerts: [{
        alertmessage: String,
        activefrom: Date,
        activeto: Date
    }],
    /** homemedgroups {} - details of homemedicine allowed at billing group level*/
    homemedgroups: [{
        /** autocomplete */
        billinggroupuid: {
            type: Schema.ObjectId,
            reference: 'BillingGroup'
        },
        duration: Number,
        maxquantity: Number,
        maxprice: Number
    }],
    /** homemeditems {} - details of home medicine allowed at itemlevel level*/
    homemeditems: [{
        /** autocomplete */
        orderitemuid: {
            type: Schema.ObjectId,
            reference: 'OrderItem'
        },
        duration: Number,
        maxquantity: Number,
        maxprice: Number
    }]
});

PayorAgreementSchema.plugin(resuable);

module.exports = mongoose.model('PayorAgreement', PayorAgreementSchema);
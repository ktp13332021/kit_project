/**
 * Schema representing the Tariff Details.
 * The Tariff schema stores the all the detail such as code, name, order item, tarifftype, unitprice, etc.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module Tariff
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billingEnums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TariffSchema = new Schema({
    /** chargecode {String} - charge code for the order item */
    chargecode: {
        type: String,
        required: true,
        index: true
    },
    /** tarifftypeuid {ObjectId} - reference to tariff type such as standard, foreigner, etc  combobox domaincode : TARIFF*/
    tarifftypeuid: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        reference: 'ReferenceValue'
    },
    /** encountertype {ObjectId}  - reference to the encounter type - combobox domaincode : ENTYPE*/
    encountertypeuid: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        reference: 'ReferenceValue'
    },
    /** itemtype {String} -  */
    itemtype: {
        type: String,
        enum: [
            billingEnums.itemTypes.orderItem,
            billingEnums.itemTypes.orderSet
        ],
        required: true
    },
    /** orderitemuid {ObjectId} - reference to the order item  - autocomplete*/
    orderitemuid: {
        type: Schema.ObjectId,
        reference: 'OrderItem'
    },
    /** ordersetuid {ObjectId} - reference to orderset - autocomplete */
    ordersetuid: {
        type: Schema.ObjectId,
        reference: 'OrderSet'
    },
    /** billinggroupuid {ObjectId} - reference to the billing group - autocomplete */
    billinggroupuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'BillingGroup'
    },
    /** billingsubgroupuid {} {ObjectId} - reference to the billing subgroup - autocomplete */
    billingsubgroupuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'BillingGroup'
    },
    /** usesamegroupforhomemed - visible only for OrderCatType = MEDICINE, by default this will be true. If false, then mandatory to enter billing group for homemed. */
    usesamegroupforhomemed : Boolean,
    /** homemedbillinggroupuid {ObjectId} - reference to the billing group - autocomplete */
    homemedbillinggroupuid: {
        type: Schema.ObjectId,
        reference: 'BillingGroup'
    },
    /** homemedbillingsubgroupuid {} {ObjectId} - reference to the billing subgroup - autocomplete */
    homemedbillingsubgroupuid: {
        type: Schema.ObjectId,
        reference: 'BillingGroup'
    },
    /** unitprice {Number} - the unit price for the item. */
    unitprice: {
        type: Number
    },
    /** minprice {Number} - the minimum unit price for the item. */
    minprice: {
        type: Number
    },
    /** maxprice {Number} - the maximum unit price for the item. */
    maxprice: {
        type: Number
    },
    /** costprice {Number} - the cost unit price for the item. */
    costprice: {
        type: Number
    },
    /** currencyuid {ObjectId} - reference to the currency type - combobox domaincode : CURNCY */
    currencyuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'ReferenceValue'
    },
    /** activefrom {Date} - start date for the tariff */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the tariff. */
    activeto: Date,
    /** doctorshare {Number} - the doctor share for the item. */
    doctorshare: {
        type: Number
    }
});

TariffSchema.plugin(resuable);

module.exports = mongoose.model('Tariff', TariffSchema);
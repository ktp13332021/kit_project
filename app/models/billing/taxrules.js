/**
 * Schema representing the TaxRule Details.
 * The TaxRule schema stores the all the rule such as encounter, visittype, billing group, items, applicable tax code.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module TaxRule
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TaxRuleSchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given for the taxmaster*/
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the taxmaster */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the taxmaster. */
    activeto: Date,
    /** encountertypeuid {ObjectId}  - reference to the encounter type - combobox domaincode : ENTYPE*/
    encountertypeuid: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        reference: 'ReferenceValue'
    },
    /** visittypeuid {ObjectId}  - reference to the visit type - combobox domaincode : VSTTYP*/
    visittypeuid: {
        type: Schema.ObjectId,
        index: true,
        reference: 'ReferenceValue'
    },
    /** billinggroups {ObjectId} - reference to the list of associated Billing group - chips control */
    billinggroups: [{
        billinggroupuid: {
            type: Schema.ObjectId,
            reference: 'BillingGroup'
        },
        taxmasteruid: {
            type: Schema.ObjectId,
            reference: 'TaxMaster'
        }
    }],
    /** billingsubgroups {ObjectId} - reference to the list of associated Billing group - chips control */
    billingsubgroups: [{
        billingsubgroupuid: {
            type: Schema.ObjectId,
            reference: 'BillingGroup'
        },
        taxmasteruid: {
            type: Schema.ObjectId,
            reference: 'TaxMaster'
        }
    }],
    /** orderitemuid {ObjectId} - reference to the list of associated OrderItem - chips control */
    orderitems: [{
        orderitemuid: {
            type: Schema.ObjectId,
            reference: 'OrderItem'
        },
        taxmasteruid: {
            type: Schema.ObjectId,
            reference: 'TaxMaster'
        }
    }]

});

TaxRuleSchema.plugin(resuable);

module.exports = mongoose.model('TaxRule', TaxRuleSchema);
/**
 * Schema representing the Billing Groups.
 * The Billing Groups schema stores the all the detail code, name, parentgroup, display order, etc.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module Billing Group
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var BillingGroupSchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given for the billinggroup*/
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the billinggroup */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the billinggroup. */
    activeto: Date,
    /** locallangdesc {String} - local language for the billinggroup*/
    locallangdesc: String,
    /** issubgroup{boolean} - Indicates whether the billinggroup is sub subgroup - switch*/
    issubgroup: Boolean,
    /** parentgroup{ObjectId} - records the linked parent billinggroup - autocomplete*/
    parentgroup: {
        type: Schema.ObjectId,
        ref: 'BillingGroup'
    },
    /** displayorder {Number} - order in which the group should be displayed in the invoice / receipt and screen */
    displayorder: Number,
    /** allowsplitting {Boolean} - whether splitting should be allowed at this level or not  - default true*/
    allowsplitting: Boolean,
    /** allowspecialdiscount {Boolean} - whether special discount should be applied on this group - default true*/
    allowspecialdiscount: Boolean,
    /** allowpriceoverride {Boolean} - whether price override needs to be allowed or not - default false */
    allowpriceoverride: Boolean,
    /** chargegroupcodeuid {ObjectId} - reference domain code : CRGGRPCOD */
    chargegroupcodeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** accountcodeuid {ObjectId} - reference domain code : ACCODE */
    accountcodeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' }
});

BillingGroupSchema.plugin(resuable);

module.exports = mongoose.model('BillingGroup', BillingGroupSchema);
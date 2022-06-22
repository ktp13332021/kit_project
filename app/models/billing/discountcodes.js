/**
 * Schema representing the Discount codes.
 * The Discount Codes schema stores the discounts that can be applied during allocate bill
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module DiscountCodes
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DiscountCodeSchema = new Schema({
    /** code {String} - Code of discount */
    code: {
        type: String,
        required: true
    },
    /** name {String} - name of discount */
    name: {
        type: String,
        required: true
    },
    /** description {String} - description of discount */
    description: {
        type: String
    },
    /** activefrom {Date}  - Date from which this discount is active */
    activefrom: Date,
    /** activeto {Date} - Date upto which this discount is active */
    activeto: Date,
    /** disccategory {ObjectId} - Reference to the discount category reference value*/
    discountcategoryuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** isitemlevel {Boolean} - Whether the discount can be applied at item or group level*/
    isitemlevel: Boolean,
    /** isbilllevel {Boolean} - Whether the discount can be applied at bill level*/
    isbilllevel: Boolean,
    /** maxpercentage {Number} - Maximum percentage of discount that can applied*/
    maxpercentage: {
        type: Number,
        required: true
    },
    /** needsuserauth {Boolean} - Whether authorization by user is required for discount*/
    needsuserauth: Boolean,
    /** authusers {Array} - List of users who can authorize this discount*/
    authusers: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    /** needsotpauth {Boolean} - Whether OTP authorazation is required for discount*/
    /*needsotpauth: Boolean*/
});

DiscountCodeSchema.plugin(resuable);

module.exports = mongoose.model('DiscountCode', DiscountCodeSchema);
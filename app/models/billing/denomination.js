/**
 * Schema representing Denominations for various transactions.
 * The Denomination schema stores amount, currency and quantity.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module Denomination
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DenominationDetailsSchema = new Schema({
    /** currency {Number} - the currency value */
    currency: Number,
    /** quantity {Number} - the quantity of corresponding currency*/
    quantity: Number
});

// define schema
var DenominationSchema = new Schema({
    /** amount {Number} - total amount that has been denominated */
    amount: Number,
    /** details {DenominationDetailsSchema} - details of currencies and the quantity that contains in denomination*/
    details: [DenominationDetailsSchema]
});

DenominationSchema.plugin(resuable);

module.exports = mongoose.model('Denomination', DenominationSchema);
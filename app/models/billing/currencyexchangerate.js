/**
 * Schema representing the Currency Exchange Rate for Billing.
 * The CurrencyExchangeRate schema stores Base Rate, Conversion Rate.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module CurrencyExchangeRate
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var CurrencyExchangeRateSchema = new Schema({
    /** activefrom {Date} - start date for the agreement */
    activefrom: {
        type: Date,
        required: true,
        index: true
    },
    /** exchangerates - the various exchange rates */
    exchangerates: [{
        foreigncurrencyuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue',
            required: true
        },
        defaultcurrencyuid: {
            type: Schema.ObjectId,
            ref: 'ReferenceValue',
            required: true
        },
        exchangeratio: Number,
        comments: String
    }]
});

CurrencyExchangeRateSchema.plugin(resuable);

module.exports = mongoose.model('CurrencyExchangeRate', CurrencyExchangeRateSchema);
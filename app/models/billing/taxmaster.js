/**
 * Schema representing the Tax Code Details.
 * The TaxMaster schema stores the all the detail such as code, name, percentage, etc.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module TaxMaster
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var billilngEnums = require('./billingenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var TaxMasterSchema = new Schema({
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
    /** taxtype {String} - type of the tax whether Input or Output  */
    taxtype: {
        type: String,
        enum: [
            billilngEnums.taxTypes.input,
            billilngEnums.taxTypes.output
        ],
        required: true
    },
    /** taxpercentage {Number} - the percentage for tax that needs to be applied */
    taxpercentage: {
        type: Number,
        required: true
    },
    /** istaxbeforediscount {Boolean} - whether the tax has to be applied for price before special discount, default value is false */
    istaxbeforediscount: Boolean,
    /** isexclusive {Boolean} - whether the tax is exlusive of total receipt amount or inclusive. (Default value is true) */
    isexclusive: Boolean
});

TaxMasterSchema.plugin(resuable);

module.exports = mongoose.model('TaxMaster', TaxMasterSchema);
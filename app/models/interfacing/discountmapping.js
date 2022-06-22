/**
* Schema representing the discountmapping with GL No for ERP interface  .
* The discountmapping schema stores the all the detail such as discount,encountertype,Creditaccountno,debitaccoutno etc.

* @module discountmapping
*/
// import the necessary modules

var mongoose = require("mongoose");
var reusable = require("../framework/reusableobjects");

var Schema = mongoose.Schema;

// define schema
var discountmappingSchema = new Schema({

    /** discountcodeuid {ObjectId} - reference to the DiscountCode  */
    discountcodeuid: {type: Schema.ObjectId,ref: 'DiscountCode'},

    /** entypeuid {ObjectId} - reference to the encounter type - opd or ipd */
    entypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** creditaccountno - Credit GL account */
    creditaccountno: String,

    /** debitaccountno - Debit GL account */
    debitaccountno: String,

    /** activefrom - start date for GL mapping  */
    activefrom: Date,
    
    /** activefrom - end date for GL mapping  */
    activeto: Date
});

discountmappingSchema.plugin(reusable);
module.exports = mongoose.model('discountmapping', discountmappingSchema);
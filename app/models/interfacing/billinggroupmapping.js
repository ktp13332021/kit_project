/**
* Schema representing the billinggroupmapping with GL No for ERP interface  .
* The billinggroupmapping schema stores the all the detail such as billinggroup,billingsubgroup,department,Creditaccountno,debitaccoutno etc.

* @module billinggroupmapping
*/
// import the necessary modules

var mongoose = require("mongoose");
var reusable = require("../framework/reusableobjects");

var Schema = mongoose.Schema;

// define schema
var BillinggroupmappingSchema = new Schema({

    /** billinggroupuid {ObjectId} - reference to the billing group  */
    billinggroupuid: {
        type: Schema.ObjectId,
        ref: 'BillingGroup'
    },

    /** billingsubgroupuid {ObjectId} - reference to the billing group */
    billingsubgroupuid: {
        type: Schema.ObjectId,
        ref: 'BillingGroup'
    },

    /** entypeuid {ObjectId} - reference to the encounter type - opd or ipd */
    entypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** departmentuid {ObjectId} - reference to the Department where the order is placed */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },

    /** creditaccountno - Credit GL account */
    creditaccountno: String,

    /** debitaccountno - Debit GL account */
    debitaccountno: String,

    /** activefrom - start date for mapping  */
    activefrom: Date,
    
    /** activefrom - end date for mapping  */
    activeto: Date
});

BillinggroupmappingSchema.plugin(reusable);
module.exports = mongoose.model('billinggroupmapping', BillinggroupmappingSchema);
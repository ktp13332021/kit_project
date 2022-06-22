/**
* Schema representing the inventorymapping with GL No for ERP interface  .
* The inventorymapping schema stores the all the detail such as productcategory,Creditaccountno,debitaccoutno etc.

* @module inventorymapping
*/
// import the necessary modules

var mongoose = require("mongoose");
var reusable = require("../framework/reusableobjects");

var Schema = mongoose.Schema;

// define schema
var inventorymappingSchema = new Schema({

    /** productcatuid {ObjectId} - reference to the item product category  */
    productcatuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** creditaccountno - Credit GL account */
    creditaccountno: String,

    /** debitaccountno - Debit GL account */
    debitaccountno: String,

    /** activefrom - start date for GL mapping  */
    activefrom: Date,
    
    /** activefrom - end date for GL mapping  */
    activeto: Date
});

inventorymappingSchema.plugin(reusable);
module.exports = mongoose.model('inventorymapping', inventorymappingSchema);
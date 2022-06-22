/**
* Schema representing the paymentmodemapping with GL No for ERP interface  .
* The paymentmodemapping schema stores the all the detail such as paymentmode,Creditaccountno,debitaccoutno etc.

* @module paymentmodemapping
*/
// import the necessary modules

var mongoose = require("mongoose");
var reusable = require("../framework/reusableobjects");

var Schema = mongoose.Schema;

// define schema
var paymentmodemappingSchema = new Schema({

    /** paymnetmodeuid {ObjectId} - reference to the paymentmode such as cash,card etc  */
    paymnetmodeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** cardtypeuid {ObjectId} - reference to the cardtype such as master,visa etc  */
    cardtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** creditaccountno - Credit GL account */
    creditaccountno: String,

    /** debitaccountno - Debit GL account */
    debitaccountno: String,

    /** activefrom - start date for GL mapping  */
    activefrom: Date,
    
    /** activefrom - end date for GL mapping  */
    activeto: Date
});

paymentmodemappingSchema.plugin(reusable);
module.exports = mongoose.model('paymentmodemapping', paymentmodemappingSchema);
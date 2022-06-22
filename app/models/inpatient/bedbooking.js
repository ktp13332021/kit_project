
/**
 * Schema representing data for the Bed reservation or bed booking. 
 * The admission details schema contains the additional details to patientvisit.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module bedbooking
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the bedbooking.
 * 
 */
var BedBookingSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /**bedcatuid {ObjectId} - category of the bed to reserve */
    bedcatuid : { type: Schema.ObjectId, ref: 'ReferenceValue'},
    /** warduid {ObjectId} - optional ward to reserve */
    warduid : { type: Schema.ObjectId, ref: 'Ward'},
    /** beduid {ObjectId} - optional bed to reserve */
    beduid  : { type: Schema.ObjectId, ref: 'Bed'},
    /** bookedate {Date} - the date for resrvation */
    bookeddate : Date,
    /** bookedby {ObjectId} - user who reserved */
    bookedby : { type: Schema.ObjectId, ref: 'User'},
    /** bookingat{Date} - date and time of booking*/
    bookedat : Date,
    /** commnets {String} - comments and remarks */
    comments : String,
    /** isolationrequired { Boolean}  - whether the patient needs isolation*/
    isolationrequired : Boolean,
    /** expectedlos {number} - expected length of stay */
    expectedlos: Number
  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
BedBookingSchema.plugin(resuable);
module.exports =  mongoose.model('BedBooking', BedBookingSchema);


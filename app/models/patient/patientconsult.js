/**
 * Schema representing consult request of the patient.
 * The ConsultRequest schema stores the details related to referral, consult request..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module ConsultRequest
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var ConsultRequestSchema = new Schema({
      /** patientuid {ObjectId} - reference to the patient schema */
      patientuid : { type: Schema.ObjectId, ref: 'Patient', required:true,index: true },
      /** patientvisituid {ObjectId} - reference to the patient visit schema */
      patientvisituid : { type: Schema.ObjectId, ref: 'PatientVisit'},
      /** referraldate {Date} - the date of referral - defaults to current date*/
      referraldate : Date,
      /** referringdepartmentuid {ObjectId} - the department of the  logged in user */
      referringdepartmentuid : {type : Schema.ObjectId, ref:'Department'},  
      /** referringcareprovideruid {ObjectId} - the details of the  logged in user */
      referringcareprovideruid : {type : Schema.ObjectId, ref:'User'},  
      /** referredto {ObjectId} - the department to which the patient is referred */
      referredto : {type : Schema.ObjectId, ref:'Department'},  
      /** referredtocareprovider {ObjectId} - the careprovider to whom the patient is referred */
      referredtocareprovider : {type : Schema.ObjectId, ref:'User'},  
      /** appointmentdate {Date} - the date for which consult is sought - defaults to current date*/
      appointmentdate : Date,
      /** comments {String} - any other comments */
      comments : String,
      /** isactive {Boolean} - whether the record is active - defaults to true*/
      isactive : Boolean,
      /** replycomments {String} - comments entered by the referred to department */
      replycomments : String,
      /** ischeckedin {Boolean} - whether the consult is checked in  */
      ischeckedin : Boolean,
      /** isbooked {Boolean} - whether the consult is booked for appointment */
      isbooked : Boolean
  
  });
  
 ConsultRequestSchema.plugin(resuable);
 
 module.exports = mongoose.model('ConsultRequest', ConsultRequestSchema);

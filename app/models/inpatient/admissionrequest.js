/**
 * Schema representing admission request of the patient.
 * The AdmissionRequest Schema stores the details related to referral for admission..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module AdmissionRequestSchema
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var AdmissionRequestSchema = new Schema({
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
      /** referredtoward {ObjectId} - the ward to which the patient is referred */
      referredtoward : {type : Schema.ObjectId, ref:'Location'},  
      /** admittingcareprovider {ObjectId} - the careprovider to whom the patient is referred */
      admittingcareprovider : {type : Schema.ObjectId, ref:'User'},  
      /** admissiondate {Date} - the date for which admission is sought - defaults to current date*/
      admissiondate : Date,
      /** comments {String} - any other comments */
      comments : String,
      /** isactive {Boolean} - whether the record is active - defaults to true*/
      isactive : Boolean,
      /** isadmitted {Boolean} - whether the patient is admitted from request */
      isadmitted : Boolean,
      /** replycomments {String} - comments entered by the referred to department */
      replycomments : String,
      /** cancelledby {ObjectId} - user who cancelledit */
      cancelledby : {type : Schema.ObjectId, ref:'User'}, 
      /** canceldate {Date}  - date and time of cancel*/
      canceldate : Date
  });
  
 AdmissionRequestSchema.plugin(resuable);
 
 module.exports = mongoose.model('AdmissionRequest', AdmissionRequestSchema);

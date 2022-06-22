/**
 * Schema representing Death Record of the patient.
 * The DeathRecord schema stores whether the patient is deceased and details related to it..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module DeathRecord
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var DeathRecordSchema = new Schema({
      /** patientuid {ObjectId} - reference to the patient schema */
      patientuid : { type: Schema.ObjectId, ref: 'Patient', required:true,index: true },
      /** patientvisituid {ObjectId} - reference to the patient visit schema */
      patientvisituid : { type: Schema.ObjectId, ref: 'PatientVisit'},
      /** departmentuid {ObjectId} - the department of the patient or logged in user */
      departmentuid : {type : Schema.ObjectId, ref:'Department'},  
      /** isdiedoutsidehospital {Boolean} - whether the patient died outside hospital and just recording this information */
      isdiedoutsidehospital : Boolean,
     /** deathdatetime {Date} - the date and time of the death */
     deathdatetime : {type:Date},
     /** deathreasonuid {ObjectId} - reference domain code 'DTHRSN' - values 'CARDIAC ARREST','AGE RELATED', 'ACCIDENT' */
     deathreasonuid   : { type: Schema.ObjectId, ref: 'ReferenceValue'},
     /** confcareprovideruid {ObjectId} - reference to the doctor who confirmed the death */
     confcareprovideruid   : { type: Schema.ObjectId, ref: 'User'},
     /** isbroughtdead {Boolean} - whether the patient was brought dead */
     isbroughdead : Boolean,
     /** comments {String} - any other comments */
     comments : String,
     /** sendtouid {ObjectId} - reference to the status  code : SENDTO*/
     sendtouid : { type: Schema.ObjectId, ref: 'ReferenceValue' }
  });
  
 DeathRecordSchema.plugin(resuable);
 
 module.exports = mongoose.model('DeathRecord', DeathRecordSchema);

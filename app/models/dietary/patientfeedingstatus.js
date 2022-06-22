
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation for NPO status function.


// define schema
var PatientFeedingStatusSchema = new Schema({
  /** patientuid {ObjectId} - reference to the patient schema */
  patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
  /** patientvisituid {ObjectId} - reference to the patient visit schema */
  patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
  /** dieticianuid {ObjectId} - reference to the dietician*/
  dieticianuid : { type: Schema.ObjectId, ref: 'User'},
  /** isnpostatus {Boolean} - wehther the patient is in NPO (Nil Per Oral - nothing by mouth) status */
  isnpostatus : Boolean,
  /** istubefeedingstatus {Boolean} - wehther the patient is Tube Feeding status */
  istubefeedingstatus : Boolean,
  /** startdate {Date} - start date of the plan */
  startdate : Date,
  /** enddate {Date} - start date of the plan */
  enddate : Date,
  /** comments {String} - comments about the plan */
  comments : String
});

PatientFeedingStatusSchema.plugin(resuable);

module.exports = mongoose.model('PatientFeedingStatus', PatientFeedingStatusSchema);

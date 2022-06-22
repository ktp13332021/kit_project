
/**
 * Schema representing master data for defining radiology execution details. 
 * The execution is done by the technician before the report is assigned
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module ExecutionDetails
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the radiology execution details.
 * 
 */
var ExecutionDetailsSchema = new Schema({
  /** patientuid {ObjectId} reference to the patient schema */
  patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
  /** paitientvisituid {ObjectId} reference to the patient visit schema */
  patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
  /** patientorderuid  {ObjectId} - reference to the patient order */
  patientorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
  /** executiondetails {} - details of the execution */
  executiondetails: {
    /** reference to the patient order item uids. */
    patientorderitemuids: [{ type: Schema.ObjectId }],
    /** executedbyuid {ObjectId} - the technician who executed */
    executedbyuid: { type: Schema.ObjectId, ref: 'User' },
    /** executiondate {Date} - date and time of execution */
    executiondate: Date,
    /** comments {String} - comments to be printed in the result */
    comments: String,
    /** modalityuid {ObjectId} - location modality executed */
    modalityuid: { type: Schema.ObjectId, ref: 'Location' }
  },
  technicianuid: { type: Schema.ObjectId, ref: 'User' },
  careprovideruid: { type: Schema.ObjectId, ref: 'User' },
  radiologistuid: { type: Schema.ObjectId, ref: 'User' },
  assignedbyuid: { type: Schema.ObjectId, ref: 'User' },
  assigneddate: Date
});

/** plugin the framework attributes like createdat, createdby, etc. */
ExecutionDetailsSchema.plugin(resuable);
module.exports = mongoose.model('ExecutionDetails', ExecutionDetailsSchema);


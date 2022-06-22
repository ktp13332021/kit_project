// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ERDischargeSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of the logged in user */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** dischargedby {ObjectId} - reference to the doctor who discharged */
    dischargedby: { type: Schema.ObjectId, ref: 'User' },
    /** dischargedate  {Date} - date and time of discharge */
    dischargedate: Date,
    /** dischargetype {ObjectId} - reference to the dischrage type code : ERDTYP*/
    dischargetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dischargestatus {ObjectId} - reference to the status  code : ERDSTS*/
    dischargestatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** comments {String} - comments if any */
    comments: String,
    admissionrequestuid: { type: Schema.ObjectId, ref: 'AdmissionRequest' },
    surgeryrequestuid: { type: Schema.ObjectId, ref: 'SurgeryRequest' },
    deathrecorduid: { type: Schema.ObjectId, ref: 'DeathRecord' },
    externalreferraluid: { type: Schema.ObjectId, ref: 'ReferralOut' },
    /** cancelcomments {String} - comments entered by the referred to department */
    cancelcomments: String
});

ERDischargeSchema.plugin(resuable);

module.exports = mongoose.model('ERDischarge', ERDischargeSchema);
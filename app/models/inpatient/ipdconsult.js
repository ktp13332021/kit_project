/**
 * Schema representing data for the IPD Consult of the patient. 
 * The ipd consult schema contains the details of the careprovider visiting the patient.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module admissiondetail
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the IPDConsult.
 * 
 */
var IPDConsultSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** startdate {Date} - datetime at which the consult started */
    startdate: { type: Date, required: true },
    /** startdate {Date} - datetime at which the consult ended */
    enddate: { type: Date },
    /** careprovideruid {ObjectId} - the doctor who is consulting */
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** departmentuid {ObjectId} - the department of the doctor who is consulting */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** consulttypeuid {ObjectId} - reference value code : CSLTYP */
    consulttypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** statusuid {ObjectId} - reference to the current status - Same as visit status (VSTSTS)*/
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isactive {Boolean} - active or not */
    isactive: Boolean,
    /** examinationuid {ObjectId} - reference to the examination */
    examinationuid: { type: Schema.ObjectId, ref: 'Examination' },
    /** replyexaminationuid {ObjectId} - reference to the examination */
    replyexaminationuid: { type: Schema.ObjectId, ref: 'Examination' },
    /** cancelreason {String} - reason for cancel */
    cancelreason: String,
    /** cancelledby {ObjectId} - who cancel the consult */
    cancelledby: { type: Schema.ObjectId, ref: 'User' },
    /** cancelleddate {Date} - cancelled date */
    cancelleddate: Date,
});

/** plugin the framework attributes like createdat, createdby, etc. */
IPDConsultSchema.plugin(resuable);
module.exports = mongoose.model('IPDConsult', IPDConsultSchema);
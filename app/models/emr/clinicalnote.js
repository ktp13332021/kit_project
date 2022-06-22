// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var emrenum = require('../emr/emrenum');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ClinicalNoteSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of patient visit */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** careprovideruid {ObjectId} - the doctor who did the clinical note */
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** name {String} - the name of the note */
    name: { type: String },
    /** screentype {String} - type of the screen */
    screentype: String,
    /** notetext {String} - the text used for clinical note */
    notetext: { type: String },
    /** formuid {ObjectId} - reference to the form if it is used in clinical note */
    formuid: { type: Schema.ObjectId, ref: 'PatientForm' },
    /** annotationuid {ObjectId} - reference to the annotations if it is used in clinical note */
    annotationuid: { type: Schema.ObjectId, ref: 'ImageAnnotation' },
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
        comments: String,
        status: { type: String, enum: emrenum.auditstatusenum },
        notetype: { type: String, enum: ['FREETEXT', 'FORM', 'ANNOTATION'] }
    }]
});

ClinicalNoteSchema.plugin(resuable);

module.exports = mongoose.model('ClinicalNote', ClinicalNoteSchema);
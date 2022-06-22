// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var emrenum = require('../emr/emrenum');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ExaminationSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of patient visit */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** careprovideruid {ObjectId} - the doctor who did the examination */
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** isactive{Boolean} - whether active or not */
    isactive: Boolean,
    /** examdate {Date} - the doctor who did the examination */
    examdate: { type: Date },
    /** examinationtext {String} - the text used for examinnation */
    examinationtext: { type: String },
    /** formuid {ObjectId} - reference to the form if it is used in examination */
    formuid: { type: Schema.ObjectId, ref: 'PatientForm' },
    /** annotationuid {ObjectId} - reference to the annotations if it is used in examination */
    annotationuid: { type: Schema.ObjectId, ref: 'ImageAnnotation' },
    /** isreusedfromothermodules {Boolean} - is this reused from other modules - default to false */
    isreusedfromothermodules: Boolean,
    /** auditlog details */
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        activestatus: Boolean,
        modifiedat: Date,
        comments: String,
        status: { type: String, enum: emrenum.auditstatusenum },
        examinationtype: { type: String, enum: ['FREETEXT', 'FORM', 'ANNOTATION'] }
    }]
});

ExaminationSchema.plugin(resuable);

module.exports = mongoose.model('Examination', ExaminationSchema);
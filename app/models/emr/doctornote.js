// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var emrenum = require('../emr/emrenum');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DoctorNoteSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of patient visit */
    departmentuid: { type: Schema.ObjectId, ref: 'Department', index: true },
    /** doctornote - links to the careprovider*/
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** notetext {String} - the text used for notes */
    notetext: { type: String },
    /** auditlog  */
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
        comments: String,
        status: { type: String, enum: emrenum.auditstatusenum },
    }]
});

DoctorNoteSchema.plugin(resuable);

module.exports = mongoose.model('DoctorNote', DoctorNoteSchema);
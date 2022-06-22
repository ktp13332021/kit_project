// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var emrenum = require('../emr/emrenum');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var MedicalHistorySchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of the logged in user */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** medical histories - links to the diagnosis master */
    pasthistories: [{
        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        durationinyear: Number,
        durationinmonth: Number,
        comments: String
    }],
    /** pasthistorytext - free text for past history  */
    pasthistorytext: String,
    /** family histories - links to the diagnosis master */

    familyhistories: [{
        /** reference domain code : NOKTYP */
        reltypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        problemtext: { type: String },
        durationinyear: Number,
        durationinmonth: Number,
        comments: String
    }],
    /** familyhistorytext - free text for family history  */
    familyhistorytext: String,

    /** personal history -  */
    personalhistories: [{
        /** reference domain code : SOCHST */
        behaviouruid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        durationinyear: Number,
        durationinmonth: Number,
        comments: String
    }],
    /** personalhistorytext - free text for personal history  */
    personalhistorytext: String,
    /** isreusedfromothermodules {Boolean} - is this reused from other modules - default to false */
    isreusedfromothermodules: Boolean,
    /** auditlog  */
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
        audittype: { type: String, enum: ['PAST', 'FAMILY', 'PERSONAL'] },
        status: { type: String, enum: emrenum.auditstatusenum }
    }]
});

MedicalHistorySchema.plugin(resuable);

module.exports = mongoose.model('MedicalHistory', MedicalHistorySchema);
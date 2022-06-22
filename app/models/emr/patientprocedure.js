// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var PatientProcedureSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of the logged in user */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** careprovideruid {ObjectId} - the doctor who did the procedure*/
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** reasonforprocedure {String} - reason for procedure request */
    reasonforprocedure: String,
    /** procedurestartdate {Date} - start date and time */
    procedurestartdate: Date,
    /** procedureenddate {Date} - end date and time */
    procedureenddate: Date,
    /** proceduretext - free text for procedure  */
    proceduretext: String,
    /** procedures - links to the procedures */
    procedures: [{
        procedureuid: { type: Schema.ObjectId, ref: 'Procedure' },
        /** multiplicityuid {ObjectId} - reference domain - PRDMLC */
        multiplicityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** settinguid {ObjectId} - reference domain - PRDSET */
        settinguid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    }],
    unchartedprocedures: [{
        procedureuid: { type: Schema.ObjectId, ref: 'Procedure' },
        /** multiplicityuid {ObjectId} - reference domain - PRDMLC */
        multiplicityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** settinguid {ObjectId} - reference domain - PRDSET */
        settinguid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** uncharedby {ObjectId} - use who deleted the procedure*/
        uncharedby: { type: Schema.ObjectId, ref: 'User' },
        /** uncharedat {Date} - uncharted date and time */
        uncharedat: Date
    }],
    /** bodysites [{ObjectId}] - if the procedure is restricted to certain body sites*/
    bodysites: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** procedurestatusuid {ObjectId} - reference domain - PRDSTS */
    procedurestatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** procedureresult {String} - outcome or result */
    procedureresult: String,
    /** auditlog  */
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date
    }],
    codedprocedures: [{
        codingtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        procedureuid: { type: Schema.ObjectId, ref: 'Procedure' },
        procedurecode: String,
        procedurename: String,
        /** multiplicityuid {ObjectId} - reference domain - PRDMLC */
        multiplicityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** settinguid {ObjectId} - reference domain - PRDSET */
        settinguid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** coderuid {ObjectId} - the doctor who coded the diagnosis*/
        coderuid: { type: Schema.ObjectId, ref: 'User' },
        comments: String,
        codingdate: Date,
        /** isactive{Boolean} - whether active or not */
        isactive: Boolean
    }]

});

PatientProcedureSchema.plugin(resuable);

module.exports = mongoose.model('PatientProcedure', PatientProcedureSchema);
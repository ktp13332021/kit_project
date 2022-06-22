// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ORRecordSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /**   {ObjectId} orscheduleslotuid - Unique ID of the or schedule - slots */
    orscheduleslotuid: { type: Schema.ObjectId, ref: 'ORSchedule.slots' },
    /** operatingroomuid {ObjectId} - the operating room in which the surgery was performed */
    operatingroomuid: { type: Schema.ObjectId, ref: 'Location' },
    /** reasonforprocedure {String} - reason for procedure request */
    reasonforprocedure: String,
    /** theatreindate {Date} - start date and time */
    theatreindate: Date,
    /** theatreoutdate {Date} - end date and time */
    theatreoutdate: Date,
    /** anaesthesiastartdate {Date} - start date and time */
    anaesthesiastartdate: Date,
    /** anaesthesiaenddate {Date} - end date and time */
    anaesthesiaenddate: Date,
    /** procedurestartdate {Date} - start date and time */
    procedurestartdate: Date,
    /** procedureenddate {Date} - end date and time */
    procedureenddate: Date,
    /** procedureduration {Number} - diff of procedureenddate and procedurestartdate in minutes */
    duration: Number,
    /** proceduretext - free text for procedure  */
    proceduretext: String,
    /** procedures - links to the procedures */
    procedures: [{
        procedureuid: { type: Schema.ObjectId, ref: 'Procedure' },
    }],
    /** bodysites [{ObjectId}] - if the procedure is restricted to certain body sites*/
    bodysites: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** surgeons {ObjectId} - the careprovider to who is to perform the surgery  */
    surgeons: [{
        roleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        careprovideruid: { type: Schema.ObjectId, ref: 'User' }
    }],
    /** anaesthetist {ObjectId} - the careprovider who is the anaesthetist for the suergery */
    anaesthetist: [{ type: Schema.ObjectId, ref: 'User' }],
    /** scrubnurses {ObjectId} - the user who is the scrub nurse for the suergery */
    scrubnurses: [{ type: Schema.ObjectId, ref: 'User' }],
    /** implantdetails {String} - the implant  used for surgery */
    implantdetails: { type: String },
    /** surgeonnotes {String} - the text used by surgeon */
    surgeonnotes: { type: String },
    /** procedurestatusuid {ObjectId} - reference domain - PRDSTS */
    procedurestatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** planningtypeuid {ObjectId} - reference domain SRGTYP */
    planningtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** criticalityuid {ObjectId} - reference domain CRITCL */
    criticalityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** formuid {ObjectId} - reference to the forms if it is used in surgery */
    checklists: [{
        /** checklisttypeuid {ObjectId} - reference domain - PRTMPL */
        checklisttypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        formuid: { type: Schema.ObjectId, ref: 'PatientForm' }
    }],
    /** auditlog  */
    auditlog: [{
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
        procedurestatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    }]

});

ORRecordSchema.plugin(resuable);

module.exports = mongoose.model('ORRecord', ORRecordSchema);
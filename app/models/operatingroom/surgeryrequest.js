/**
 * Schema representing surgery request of the patient.
 * The SurgeryRequest Schema stores the details related to referral for surgery..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module SurgeryRequestSchema
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var SurgeryRequestSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit' },
    /** referraldate {Date} - the date of referral - defaults to current date*/
    referraldate: Date,
    /** referringdepartmentuid {ObjectId} - the department of the  logged in user */
    referringdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** referringcareprovideruid {ObjectId} - the details of the  logged in user */
    referringcareprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** referredto {ObjectId} - the department to which the patient is referred */
    referredto: { type: Schema.ObjectId, ref: 'Department' },
    /** surgeon {ObjectId} - the careprovider to whom the patient is referred */
    surgeon: { type: Schema.ObjectId, ref: 'User' },
    /** surgerydate {Date} - the date for which admission is sought - defaults to current date*/
    surgerydate: Date,
    /** comments {String} - any other comments */
    comments: String,
    /** proceduredetails {ObjectID} - details about the procedure */
    proceduredetails: [{ type: Schema.ObjectId, ref: 'Procedure' }],
    /** isactive {Boolean} - whether the record is active - defaults to true*/
    isactive: Boolean,
    /** diagnosisdetails - this needs to be copied from patient diagnosis list control. */
    diagnosisdetails: [{
        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        /** disordername {String} - free text diagnosis used for adhoc purposes */
        disordername: String
    }],
    /** planningtypeuid {ObjectId} - reference domain SRGTYP */
    planningtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** anaesthesiauid {ObjectId} - reference domain ANESTY*/
    anaesthesiauid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** surgeons {ObjectId} - the careprovider to who is to perform the surgery  */
    surgeons: [{
        /** roleuid {ObjectId} - reference domain SGRTYP*/
        roleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        careprovideruid: { type: Schema.ObjectId, ref: 'User' }
    }],
    /** requestedanaesthetist {ObjectId} - the anaesthetist who is the requested for the suergery */
    requestedanaesthetist: { type: Schema.ObjectId, ref: 'User' },
    /** allocateanaesthetist {ObjectId} - the anaesthetist who is the allocated for the suergery */
    allocateanaesthetist: { type: Schema.ObjectId, ref: 'User' },
    /** issurgeryscheduled {Boolean} - whether the patient is surgery is booked from request */
    issurgeryscheduled: Boolean,
    /** cancelreasonuid {ObjectId} - reference domain SRCNRN */
    cancelreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    cancelledby: { type: Schema.ObjectId, ref: 'User' },
    /** replycomments {String} - comments entered by the referred to department */
    replycomments: String,
    counsellingdetails: [{
        followupdate: Date,
        /** statusuid {ObjectId} - reference domain CONSTS */
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** useruid {ObjectId} - the user who do the consultation*/
        useruid: { type: Schema.ObjectId, ref: 'User' },
        modifiedat: Date,
        /** comments {String} - any other comments */
        comments: String,
    }]
});

SurgeryRequestSchema.plugin(resuable);

module.exports = mongoose.model('SurgeryRequest', SurgeryRequestSchema);
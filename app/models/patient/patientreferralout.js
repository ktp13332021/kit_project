/**
 * Schema representing consult request of the patient.
 * The ConsultRequest schema stores the details related to referral, consult request..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module ConsultRequest
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ReferralOutSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit' },
    /** referredto {ObjectId} - the outside hospital to which the patient is referred */
    referredto: { type: Schema.ObjectId, ref: 'ReferringOrg' },
    /** referredtodepartment {string} - the department to which the patient is referred */
    referredtodepartment: { type: String },
    /** referredtocareprovider {string} - the careprovider to which the patient is referred */
    referredtocareprovider: { type: String },
    /** diagnosisdetails - this needs to be copied from patient diagnosis list control. */
    diagnosisdetails: [{
        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        /** referencedomain code : ENTSTG - Admission, Discharge, Pre-Op, Post-Op */
        encounterstageuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        comments: String,
        onsetdate: Date,
        isprimary: Boolean,
        /** reference code : SEVRTY - mild, moderate, severe**/
        severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** comorbidityuid {ObjectId} - comorbidity - referencedomaincode : COMORB  */
        comorbidityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** disordername {String} - free text diagnosis used for adhoc purposes */
        disordername: String
    }],
    /** referraldetails {String} - details about the referral */
    referraldetails: String,
    /** referraldate {Date} - the date of referral - defaults to current date*/
    referraldate: Date,
    /** refercategoryuid {ObjectId} - category of the referral - reference code : REFCAT */
    refercategoryuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** referralcause {String} - cause of referral */
    referralcause: String,
    /** referringdepartmentuid {ObjectId} - the department of the  logged in user */
    referringdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** referringcareprovideruid {ObjectId} - the details of the  logged in user */
    referringcareprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** isactive {Boolean} - whether the record is active - defaults to true*/
    isactive: Boolean,

});

ReferralOutSchema.plugin(resuable);

module.exports = mongoose.model('ReferralOut', ReferralOutSchema);
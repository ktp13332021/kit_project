/**
 * Schema representing data for the discharge process. 
 * The various steps in discharge process are Plan, Order, Medical Discharge, Final Discharge.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module dischargeprocess
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the dischargeprocess.
 * 
 */
var DischargeProcessSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /**bedcatuid {ObjectId} - category of the bed to reserve */
    bedcatuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** warduid {ObjectId} - optional ward to reserve */
    warduid: { type: Schema.ObjectId, ref: 'Ward' },
    /** beduid {ObjectId} - optional bed to reserve */
    beduid: { type: Schema.ObjectId, ref: 'Bed' },
    /**dischargingcareprovider {ObjectId} - the careprovider who approved the discharge */
    dischargingcareprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** planneddischargedate {Date} - the date and time of dicsharge (planned datetime) */
    planneddischargedate: Date,
    /** patientstatusuid {ObjectId} - reference to patient status code : PATSTS */
    patientstatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dischargeplancomments {String} - comments at the time of discharge planning */
    dischargeplancomments: String,
    /** dischargesummarydone {Boolean} - whether the discharge summary is completed */
    dischargesummarycompleted: Boolean,
    /** openordersprocessed {Boolean} - whether all the open orders have been processed */
    openordersprocessed: Boolean,
    /** homemedordered {Boolean} - whether home medication has been ordered */
    homemedordered: Boolean,
    /** dischargediagcompleted {Boolean} - whethere discharge diagnosis is completed */
    dischargediagcompleted: Boolean,
    /** whether phaarmacy returns are completed */
    pharmacyreturnscompleted: Boolean,
    /** refernece to the generated bed charge patient order */
    bedchargeorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** medicaldischargedate {Date} - the date and time of medical dicsharge (actual datetime) */
    medicaldischargedate: Date,
    /** dischargetypeuid {ObjectId} - reference value code : DISCTY*/
    dischargetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** infectiontypeuid {ObjectId} - reference value code : DISINF */
    infectiontypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** destinationuid {ObjectId} - reference value code : DISDTN */
    destinationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** modeoftransportuid  {ObjectId} - reference value code : DISMOD */
    modeoftransportuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dischargeoutcomeuid  {ObjectId} - reference value code : DISOCM */
    dischargeoutcomeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** clearance or no dues from various departmentuid */
    dischargeclearance: [{
        /** deptuid  {ObjectId} - the department for which clearance is sought before discharge */
        deptuid: { type: Schema.ObjectId, ref: 'Department' },
        /** isdischargecleared {Boolean} - whethe discharge is okay */
        isdischargecleared: Boolean,
        /** useruid {ObjectId} - the user who provided the clearance */
        useruid: { type: Schema.ObjectId, ref: 'User' },
        /** clearedat {Date} - datetime at which this clearance was made */
        clearedat: { type: Date },
        /** comments {String} - any comments while changing the details*/
        comments: String,
    }],
    /** statusuid {ObjectId} - REference value code : DISSTS */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dischargestage {Number} - 1 - advice, 2- order, 3 - medical discharge, 4 - final discharge */
    dischargestage: Number,
    /** finaldischargedate {Date} - the date and time of dicsharge (actual datetime) */
    finaldischargedate: Date,
    /** commnets {String} - comments and remarks */
    comments: String,
    /** dischargeadvicedon {Date} - the date and time of discharge advice (system datetime) */
    dischargeadvicedon: Date,
    /** dischargeorderedon {Date} - the date and time of discharge order (system datetime) */
    dischargeorderedon: Date,
    /** medicaldischargedon {Date} - the date and time of medical discharge (system datetime) */
    medicaldischargedon: Date,
    /** finaldischargedon {Date} - the date and time of final discharge (system datetime) */
    finaldischargedon: Date,
    /** auditlogs [] - the audit history of the record. */
    auditlogs: [{
        /** modifiedat {Date} - datetime at which this change was made */
        modifiedat: { type: Date, required: true },
        /** useruid {ObjectId} - the logged in user who made the chagne to the order */
        useruid: { type: Schema.ObjectId, ref: 'User' },
        /** comments {String} - any comments while changing the details*/
        comments: String,
        /** statusuid {ObjectId} - reference to the current status */
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** dischargestage {Number} - 1 - advice, 2- order, 3 - medical discharge, 4 - final discharge */
        dischargestage: Number,

    }]

});

/** plugin the framework attributes like createdat, createdby, etc. */
DischargeProcessSchema.plugin(resuable);
module.exports = mongoose.model('DischargeProcess', DischargeProcessSchema);
/**
 * Schema representing Drug Master.
 * The DrugGroup schema is used to various clinical attributes of the drug 
 * See {@tutorial drugmaster-tutorial} for an overview.
 *
 * @module DrugMaster
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var DrugMasterSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given for the cchpi concept*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** locallangdesc {String} - local language for the cchpi concept*/
    locallangdesc: String,
    /** activefrom {Date} - start date for the cchpi concept */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the cchpi concept. */
    activeto: Date,
    /** orderitemuid {ObjectId} - reference to the underlying order item. Not set for generic drug */
    orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem' },
    /** genericdruguid {ObjectId} - reference to the generic drug that this drug belongs to. Chips control. */
    genericdruguid: [{ type: Schema.ObjectId, ref: 'DrugMaster' }],
    /** inFormulary {Boolean} - whether this drug is available in the formulary or not. - defaults true */
    inFormulary: { type: Boolean },
    /** isrx {Boolean} - whether prescription can be allowed for this medicine - defaults true */
    isrx: Boolean,
    /** isgenericdrug {Boolean} - whether this drug is a generic drug - defaults false */
    isgenericdrug: Boolean,
    /** isiv {Boolean} - whether this drug is to be administered through IV  - defaults to false*/
    isiv: Boolean,
    /** isantibiotic {Boolean} - whether this drug is a antibiotic drug - defaults false */
    isantibiotic: Boolean,
    /** infusionrate {Number} - enabled if isiv. rate of infusion */
    infusionrate: Number,
    /** infusionduration {Number} - infusion duration in minutes */
    infusionduration: Number,
    /** infusionrateuom {Object} - UOM of infusion rate*/
    infusionrateuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** infusionduration {Object} - UOM of infusion duration */
    infusiondurationuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** prescribeuom {ObjectId} - reference domain code : INVUOM */
    prescibeuomuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dosagenotapplicable {Boolean} - whether this drug needs dosage or not - default false */
    dosagenotapplicable: Boolean,
    /** defaultdosage {Number} - default dosage for this drug - can be fractional dosage */
    defaultdosage: Number,
    /** defaultdosageuom {ObjectId} - reference domain code : INVUOM */
    defaultdosageuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dosagestrength {Number} - Strength of the dosage */
    dosagestrength: Number,
    /** dosagestrengthuom {ObjectId} - reference domain code : INVUOM */
    dosagestrengthuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** defaultrouteuid {ObjectId} - reference domain code : ROUTE */
    defaultrouteuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** restrictroutes {ObjectId} - restrict only some routes - reference domain code : ROUTE */
    restrictroutes: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** defaultfrequencyuid {ObjectId} - default frequency during drug selection for ordering */
    defaultfrequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
    /** restrictfrequencies {ObjectId} - restrict only to certain frequency while ordering */
    restrictfrequencies: [{ type: Schema.ObjectId, ref: 'Frequency' }],
    /** formuid {ObjectId} - reference domain code : DGFORM */
    formuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** druggroups [{ObjectId}] - reference to the drug groups */
    druggroups: [{ type: Schema.ObjectId, ref: 'DrugGroup' }],
    /** allergens [{ObjectId}] - reference to the drug groups */
    allergens: [{ type: Schema.ObjectId, ref: 'DrugGroup' }],
    /** ishighalertdrug {Boolean} - whether the drug is high alert drug - defaults to false*/
    ishighalertdrug: Boolean,
    /** isessentialdrug {Boolean} - whether the drug is an essential drug - defaults to false*/
    isessentialdrug: Boolean,
    /** essentialdrugtypeuid  {ObjectId} - reference domain code : ESSNDG -if isessentialdrug enable*/
    essentialdrugtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isscheduleddrug : Boolean - whether the drug is marked as scheduled drug - defaults to false*/
    isscheduleddrug: Boolean,
    /** scheduleddrugtypeuid {ObjectId} - reference domain code : SCHDRG -if isscheduleddrug enable*/
    scheduleddrugtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
     /** isnarcoticdrug : Boolean - whether the drug is marked as narcotic drug - defaults to false*/
     isnarcoticdrug: Boolean,
     /** narcoticdrugtypeuid {ObjectId} - reference domain code : NRCDRG -if isscheduleddrug enable*/
     narcoticdrugtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isresearchdrug {Boolean} - whether this drug is a research drug - defaults false */
    isresearchdrug: Boolean,
    /** isipfillallowed {Boolean} - whether IP Fill is allowed for this drug  - defaults to true*/
    isipfillallowed: Boolean,
    /** iscrushingallowed {Boolean} - whether this drug can be crushed for administration - defaults to true*/
    iscrushingallowed: Boolean,
    /** drugcodes - the drug code information from the external drug database */
    drugcodes: [{
        /** code type : reference domain code : DCODTY */
        codetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        code: String
    }],
    /** instructionuid {ObjectId} - reference to Take instruction */
    instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** tallmantext {String} - the Tall man text convention for this drug */
    tallmantext: String,
    /** compatible fluids -- chips control */
    compatiblefluids: [{
        drugmasteruid: { type: Schema.ObjectId, ref: 'Drugmaster' }
    }],
    /** iscompounddrug {Boolean} - whether this drug is a compounding drug - defaults to false*/
    iscompounddrug: Boolean,
    /** compounding formula - separate tab */
    compounddetails: {
        outputqty: Number,
        compounddetail: [{
            inputdruguid: { type: Schema.ObjectId, ref: 'DrugMaster' },
            inputdrugname: String,
            inputdrugqty: Number
        }]
    },

    /** isvaccine {Boolean} -  whether this drug is a vaccine - defaults to false */
    isvaccine: Boolean,
    /** pregnancycheckuid {ObjectId} - reference domain code : PREGNC */
    pregnancycheckuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** pregnancycheckmessage {String} - If pregnancycheckuid is not empty */
    pregnancycheckmessage: String,
    /** isslidingscale {Boolean} - whether this drug uses sliding scale for dosage calculation - defaults to false */
    isslidingscale: Boolean,
    /** slidingscale definition - separate tab*/
    slidingscaledetails: {
        resultitemuid: { type: Schema.ObjectId, ref: 'ResultItem' },
        rangedetails: [{
            agegroupuid: { type: Schema.ObjectId, ref: 'AgeMaster' },
            genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            fromvalue: Number,
            tovalue: Number,
            dosage: Number
        }]
    },
    /** istaperingdose {Boolean} - whether this drug allows tapering doses - defaults to false */
    istaperingdose: Boolean,
    /** interactions - separate tab */
    druginteractions: [{
        interactingdruguid: { type: Schema.ObjectId, ref: 'DrugMaster' },
        severity: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        message: String
    }],
    /** dosage limits - separate tab */
    dosagelimits: [{
        minage: Number,
        minageuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        maxage: Number,
        maxageuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        maxunitdosage: Number,
        maxdosageperday: Number,
        maxunitdosageperkg : Number,
        maxdosageperkgperday : Number,
        message: String
    }],
    /** diagnosis alerts & investigation alerts - separate tab */
    diagnosisalerts: [{
        problemuid: { type: Schema.ObjectId, ref: 'Problem' },
        problemname: String,
        severity: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        message: String
    }],
    investigationalerts: [{
        resultitemuid: { type: Schema.ObjectId, ref: 'ResultItem' },
        resultitemname: String,
        severity: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /*Mild modurate severe SVRETY*/
        message: String,
        genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        minvalue: Number,
        maxvalue: Number
    }],

    /** vaccinetypeuid {ObjectId} - vaccine type - reference domain code : VACCINETYPE -- vaccinetype in EPI file*/
    vaccinetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** volume {Number} - the size of the drug in terms of dosage uom */
    volume: Number

});

DrugMasterSchema.plugin(resuable);

module.exports = mongoose.model('DrugMaster', DrugMasterSchema);
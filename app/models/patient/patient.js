/**
 * Schema representing Patient Demographic details.
 * The Patient is registered in the OP, emergency or IP registration process.
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module Patient
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;



var PatientAddressSchema = new Schema({
    address: String,
    area: String,
    areauid: { type: Schema.ObjectId, ref: 'Area' },
    city: String,
    cityuid: { type: Schema.ObjectId, ref: 'City' },
    state: String,
    stateuid: { type: Schema.ObjectId, ref: 'State' },
    country: String,
    countryuid: { type: Schema.ObjectId, ref: 'Country' },
    zipcode: String,
    zipcodeuid: { type: Schema.ObjectId, ref: 'Zipcode' }

});

var PatientContactSchema = new Schema({
    workphone: String,
    homephone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String,

});

var ReferralSourceSchema = new Schema({
    reftypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    referringorguid: { type: Schema.ObjectId, ref: 'ReferringOrg' },
    referreddate: { type: Date },
    referercomments: { type: String }
});

/** schema for patient demographics change */
var PatientDemoChange = new Schema({
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: Date,
    /** modifiedby {ObjectId} - the logged in user who made the chagne to the patient */
    modifiedby: { type: Schema.ObjectId, ref: 'User' },
    /** organisationuid {ObjectId} - the organisation of the logged in user who made the chagne to the patient */
    organisationuid: { type: Schema.ObjectId, ref: 'Organisation' },
    /** postaudit {String} - diff from previous to current*/
    postaudit: String
});

var PatientSchema = new Schema({
    /** mrn {String} - medical record number to be generated uniquely for the patient usine sequence number generation */
    mrn: { type: String, required: true, index: true },
    /** firstname {String} - the first part of the name of the patient */
    firstname: { type: String, required: true, index: true },
    /** middlename {String} - the middle part of the name of the patient */
    middlename: { type: String },
    /** lastname {String} - the last part of the name of the patient */
    lastname: { type: String, index: true },
    /** titleuid {ObjectId} - reference domain code : TITLE */
    titleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** genderuid {ObjectId} - reference domain code : GENDER */
    genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isvip {Boolean} - whether patient is a very important patient (VIP) - defaults to false */
    isvip: { type: Boolean },
    /** viptypeuid {ObjectId} - reference domain code : VIPTYP */
    viptypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isanonymous {Boolean} - whether anonymity has to be maintained about this patient - default false */
    isanonymous: { type: Boolean },
    /** dateofbirth {Date} - the date of birth of the patient (original or guess) */
    dateofbirth: { type: Date },
    /** isdobestimated {Boolean} - this is set to true, if the original date of birth is not recorded */
    isdobestimated: { type: Boolean },
    /** isbuddhistdate {Boolean} - whether the date of birth to be displayed in thai buddist calendar format */
    isbuddhistdate: { type: Boolean },
    /** registereddate {Date} - the actual date of registration of the patient */
    registereddate: { type: Date },
    /** nationalityuid {ObjectId} - nationality of the patient reference domain code : NATNTY */
    nationalityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** religionuid {ObjectId} - religion of the patient reference domain code : RELGON */
    religionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** raceuid {ObjectId} - race of the patient reference domain code : RACE */
    raceuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** occupationuid {ObjectId} - occupation of the patient reference domain code : OCCUPN */
    occupationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** patienttypeuid {ObjectId} - patient type - reference domain code : PATTYP */
    patienttypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** preflanguid {ObjectId} - preferred language of the patient - reference domain code : PRFLAN */
    preflanguid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** maritalstatusuid {ObjectId} - marital status of the patient - reference domain code : MARTST */
    maritalstatusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isinterpreterreqd {Boolean} - whether the patient requires interpreter - defaults to false */
    isinterpreterreqd: { type: Boolean },
    /** notes {String} - any comments, notes about the patient */
    notes: { type: String },
    /** tempmrnid {String} - Temporary MRN if used in case of temp registration */
    tempmrnid: { type: String },
    /** nationalid {String} - national universal identifier of the patient ususally issued by the government */
    nationalid: { type: String },
    /** natidexpirtydate {Date} - expiry date of the national id for the patient */
    natidexpirtydate: { type: Date },
    /** address {PatientAddressSchema} - full address of the patient including the city, state, country, zipcode  */
    address: PatientAddressSchema,
    /** contact {PatientContactSchema}  - phone, mobile and email id of the patient*/
    contact: PatientContactSchema,
    /** refererdetail {ReferralSourceSchema} - details about the clinic or gp who referred the patient */
    refererdetail: ReferralSourceSchema,
    /** patientimageuid {Photo} - the photograph of the patient */
    patientimageuid: { type: Schema.ObjectId, ref: 'PatientImage' },
    /** patientdemochanges {PatientDemoChange} - details of the audit changes */
    patientdemochanges: [PatientDemoChange],

    /** typeareauid {ObjectId} - type area - reference domain code : TYPEAREA  -- typearea in PERSON file*/
    typeareauid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** ispatientmerged {Boolean} - should not allow to register if the patient record is merged */
    ispatientmerged: Boolean,
    /** mergedpatientmrn {ObjetId} - is this patient merged with another mrn */
    mergedpatientuid: { type: Schema.ObjectId, ref: 'Patient' },
    /** housetypeuid {ObjectId} - house type - reference domain code : HOUSETYP  -- housetype in ADDReSS file*/
    housetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    patientexistid: { type: String },
    patientexisthn: { type: String }

});


PatientSchema.plugin(resuable);
module.exports = mongoose.model('Patient', PatientSchema);



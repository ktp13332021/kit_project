/**
 * Schema representing Patient Additional details.
 * The PatientAdditionalDetails stores the secondary addresses, NOK details, payor details, etc.
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module PatientAdditionalDetail
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;


var PatientAliasNameSchema = new Schema({
    aliastypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    firstname: { type: String },
    middlename: { type: String },
    lastname: { type: String }
});

var PatientDetailAddressSchema = new Schema({
    addresstypeuid: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
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
    zipcodeuid: { type: Schema.ObjectId, ref: 'Zipcode' },

});

var PatientDetailContactSchema = new Schema({
    workphone: String,
    homephone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String

});


var PatientIDDetail = new Schema({
    idtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    iddetail: { type: String },
    activefrom: { type: Date },
    activeto: { type: Date },
    comments: { type: String }
});

var PatientNOK = new Schema({
    reltypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    patientuid: { type: Schema.ObjectId, ref: 'Patient' },
    nokname: { type: String },
    titleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    notes: { type: String },
    sameaddress: { type: Boolean },
    nationalid: { type: String },
    natidexpirtydate: { type: Date },
    address: PatientDetailAddressSchema,
    contact: PatientDetailContactSchema,
});
var DisabilitySchema = new Schema({
    /** disabtypeuid {ObjectId} -disability type - reference domain code : DISABTYPE  -- disabtype in DISABILITY file*/
    disabtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** datedetect {Date} -date detect -- date_detect in DISABILITY file*/
    datedetect: { type: Date }
});

var PatientAdditionalDetailSchema = new Schema({
    /** patientuid {ObjectId} - reference to the Patient Schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** aliasnames {PatientAliasNameSchema}  - details about multiple names for the patient*/
    aliasnames: [PatientAliasNameSchema],
    /** addlnaddresses{PatientDetailAddressSchema} - details about multiple addresses of the patient */
    addlnaddresses: [PatientDetailAddressSchema],
    /**addlncontacts {PatientDetailContactSchema} - details about multiple phones, emailids of the patient */
    addlncontacts: [PatientDetailContactSchema],
    /** addlnidentifiers {PatientIDDetail} - details about multiple identity documents such as passport, driving license, etc */
    addlnidentifiers: [PatientIDDetail],
    /** nokdetails {PatientNOK} - the next of kin details of the patient */
    nokdetails: [PatientNOK],
    /** DISABILITY {DisabilitySchema} -DISABILITY details of the patient*/
    disability: [DisabilitySchema],

});




PatientAdditionalDetailSchema.plugin(resuable);
module.exports = mongoose.model('PatientAdditionalDetail', PatientAdditionalDetailSchema);



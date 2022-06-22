// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation



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

// define schema
var AmbulanceRequestSchema = new Schema({

    /**isregisteredpatient {Boolean} - whether for registered patient */
    isregisteredpatient: Boolean,
    /** patientuid {ObjectId} - reference to the patient schema - optional*/
    patientuid: { type: Schema.ObjectId, ref: 'Patient' },
    /** patientname {String} -  name of the patient*/
    patientname: String,
    /** patientdetails {String} - to enter gender, age, etc */
    patientdetails: String,
    /** address {PatientAddressSchema} - full address of the patient including the city, state, country, zipcode  */
    address: PatientAddressSchema,
    /** contact {PatientContactSchema}  - phone, mobile and email id of the patient*/
    contact: PatientContactSchema,
    /** requesttype {enum} - Pickup or Drop */
    requesttype: { type: String, enum: ['PICKUP', 'DROP'] },
    /** requesteddate {Date} - requested date and time */
    requesteddate: Date,
    /** neednursing {Boolean} - whether need nursing */
    neednursing: Boolean,
    /** needcareprovider {Boolean} - whether need doctor */
    needcareprovider: Boolean,
    /** needaddtionalequipment {Boolean} - whether need any additional equipment */
    needaddtionalequipment: Boolean,
    /** comments {String} - any other comments */
    comments: String,
    /** isactive {Boolean} - whether the record is active - defaults to true*/
    isactive: Boolean,
    /** isallocated {Boolean} - whether the request is allocated */
    isallocated: Boolean,
    /** ambulancestartdate {Date}  - date and time of Ambulance Start*/
    ambulancestartdate: Date,
    /** iscompleted {Boolean} - whether the request is completed */
    iscompleted: Boolean,
    /** completecomments {String} - comments entered by the referred to department */
    completecomments: String,
    /** allocatedambulance {ObjectId} - reference to the ambulance that is allocated */
    allocatedambulance: { type: Schema.ObjectId, ref: 'Location' },
    /** allocatecomments {String} - comments entered by the referred to department */
    allocatecomments: String,
    /** cancelledby {ObjectId} - user who cancelledit */
    cancelledby: { type: Schema.ObjectId, ref: 'User' },
    /** canceldate {Date}  - date and time of cancel*/
    canceldate: Date,
    /** cancelcomments {String} - comments entered by the referred to department */
    cancelcomments: String
});

AmbulanceRequestSchema.plugin(resuable);

module.exports = mongoose.model('AmbulanceRequest', AmbulanceRequestSchema);
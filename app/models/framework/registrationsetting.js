/**
 * Schema representing settings of mandatoriness for registration.
 * The record stored in this schema will affect the registration screen..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module RegistrationSetting
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;


//  schema is self explanatory. each fields corresponds to the Patient Schema.

var RegistrationSettingSchema = new Schema({
    title: Boolean,
    firstname: Boolean,
    middlename: Boolean,
    lastname: Boolean,
    gender: Boolean,
    dateofbirth: Boolean,
    address: Boolean,
    area: Boolean,
    city: Boolean,
    state: Boolean,
    country: Boolean,
    zipcode: Boolean,
    phone: Boolean,
    mobile: Boolean,
    email: Boolean,
    nationality: Boolean,
    religion: Boolean,
    race: Boolean,
    occupation: Boolean,
    maritalstatus: Boolean,
    nationalid: Boolean,
    typearea: Boolean,
    housetype: Boolean,
    optype: Boolean,


    enablemod11check: Boolean,
    enablemrd: Boolean,
    enablemultipleopdvisits: Boolean,
    revisitcheck: Boolean,
    revisitduration: Number,
    restrictphonedigits: String,
    restrictmobiledigits: String,
    blockduplicatenationalid: Boolean,
    convertopdtoipd: Boolean,
    printvisitslip: Boolean,
    usesinglenamefield: Boolean,
    lockdefaultpayor: Boolean,
    /** defaultmrdstorageuid {ObjectId} - the default mrd storage to use during registration */
    defaultmrdstorageuid: { type: Schema.ObjectId, ref: 'MRDStorage' },
    /** defaultnationalityuid {ObjectId} - the nationality to be defaulted */
    defaultnationalityuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },


});

RegistrationSettingSchema.plugin(resuable);
module.exports = mongoose.model('RegistrationSetting', RegistrationSettingSchema);
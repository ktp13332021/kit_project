/**
 * Schema representing the TPA.
 * The TPA schema stores the all the detail such as code, name, address, contact details, etc.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module TPA
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation


var TPAAddressSchema = new Schema({
    address: String,
    area: String,
    areauid: {
        type: Schema.ObjectId,
        ref: 'Area'
    },
    city: String,
    cityuid: {
        type: Schema.ObjectId,
        ref: 'City'
    },
    state: String,
    stateuid: {
        type: Schema.ObjectId,
        ref: 'State'
    },
    country: String,
    countryuid: {
        type: Schema.ObjectId,
        ref: 'Country'
    },
    zipcode: String,
    zipcodeuid: {
        type: Schema.ObjectId,
        ref: 'Zipcode'
    }
});

var TPAContactSchema = new Schema({
    workphone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String
});

var TPASchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given to the Referring Org*/
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the tpa */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the tpa. Can be null for active tpa. */
    activeto: Date,
    /** contactperson {String} - end date or expiry date for the tpa. Can be null for active tpa. */
    contactperson: String,
    /** arcategoryuid {String} - Reference to ARCATY reference domain value. */
    arcategoryuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** comments {String} - comments field for flexible usage */
    comments: String,
    /** address {EnterpriseAddressSchema} - address of the TPA */
    address: TPAAddressSchema,
    /** contact {EnterpriseContactSchema} - contact details of the TPA such as phone, weburl, etc */
    contact: TPAContactSchema,
    /** debtortypeuid - reference value code 'DEBTYP' */
    debtortypeuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'ReferenceValue'
    },
    /** credittermuid - reference value code 'CRDTRM' */
    credittermuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'ReferenceValue'
    },
    /** creditlimit - number - the credit limit for this payor */
    creditlimit: Number,
    /** isglmandatory - Boolean - GL is mandatory or not */
    isglmandatory: Boolean,
});



TPASchema.plugin(resuable);

module.exports = mongoose.model('TPA', TPASchema);
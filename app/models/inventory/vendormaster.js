/**
 * Schema representing master data for vendors for the inventory purchasing, etc. 
 * See {@tutorial inventory-tutorial} for an overview.
 *
 * @module Vendor
 */

// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;

/** schema for vendor audit log change */
var AuditLog = new Schema({
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: Date,
    /** modifiedby {ObjectId} - the logged in user who made the chagne to the patient */
    modifiedby: { type: Schema.ObjectId, ref: 'User' },
    /** organisationuid {ObjectId} - the organisation of the logged in user who made the chagne to the patient */
    organisationuid: { type: Schema.ObjectId, ref: 'Organisation' },
    /** postaudit {String} - diff from previous to current*/
    postaudit: String
});

var VendorAddressSchema = new Schema({
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

var VendorContactSchema = new Schema({
    workphone: String,
    homephone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String
});

var VendorSchema = new Schema({
    /** Code {string} has to be unique */
    code: {
        type: String,
        required: true,
        index: true
    },
    /** Name {string} defines the  name given to the Vendor*/
    name: {
        type: String,
        required: true,
        index: true
    },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the referring org */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the referring org. Can be null for active referring orgs. */
    activeto: Date,
    /** vendortype {ObjectId} - reference value code : VNDTYP - Manufacturer, Distributor*/
    vendortypeuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** contactpersonname {string} defines the  name given to the person at Vendor*/
    contactpersonname: {
        type: String,
        required: true,
        index: true
    },
    /** credittermuid - reference value code 'CRDTRM' */
    credittermuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** address {VendorAddressSchema} - address of the vendor */
    address: VendorAddressSchema,
    /** contact {VendorContactSchema} - contact details of the vendor */
    contact: VendorContactSchema,
    /** isgstregistered {Boolean} - whether the vendor is tax registered */
    isgstregistered: Boolean,
    /** gstregno {String} - tax registration number */
    gstregno: String,
    /** companyname {String} - company name used for tax registration purposes */
    companyname: String,
    /** auditlog {AuditLog} - details of the audit changes */
    auditlog: [AuditLog]
});

VendorSchema.plugin(resuable);
/** plugin the framework attributes like createdat, createdby, etc. */
module.exports = mongoose.model('Vendor', VendorSchema);
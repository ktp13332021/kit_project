/**
 * Schema representing master data for defining a referring organisation (ex: GP Referring clinics, hotels, news papers, etc) 
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module ReferringOrg
 */

// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;


var ReferralAddressSchema = new Schema({
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

var ReferralContactSchema = new Schema({
    workphone: String,
    homephone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String,

});

var ReferringOrgSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given to the Referring Org*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the referring org */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the referring org. Can be null for active referring orgs. */
    activeto: Date,
    /** reftypeuid {ObjectId} - type of the referring orgs such as news papers, hotels, etc - ref code REFTYP*/
    reftypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** address {EnterpriseAddressSchema} - address of the referring org */
    address: ReferralAddressSchema,
    /** contact {EnterpriseContactSchema} - contact details of the referring org such as phone, weburl, etc */
    contact: ReferralContactSchema,
    /** Organisation Code {string} link to interface government*/
    organisationcode: String

});

ReferringOrgSchema.plugin(resuable);
/** plugin the framework attributes like createdat, createdby, etc. */
module.exports = mongoose.model('ReferringOrg', ReferringOrgSchema);
/**
 * Schema representing the Payor.
 * The Payor schema stores the all the detail such as code, name, address, contact details, etc.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module Payor
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var PayorAddressSchema = new Schema({
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

var PayorContactSchema = new Schema({
    workphone: String,
    mobilephone: String,
    alternatephone: String,
    emailid: String,
    weburl: String,
});

var PayorDocumentSchema = new Schema({
    /** combobox domaincode : DOCTYP */
    doctypeuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'ReferenceValue'
    },
    docname: String,
    ismandatory: Boolean,
    claimformtemplateuid: {
        type: Schema.ObjectId
    }
});

var PayorSchema = new Schema({
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
    /** payortypeuid {ObjectId} - reference to the payor type such as Insurance, Corporate, Self Pay - domaincode : PYRTYP*/
    payortypeuid: {
        type: Schema.ObjectId,
        required: true,
        reference: 'ReferenceValue'
    },
    /** address {EnterpriseAddressSchema} - address of the TPA */
    address: PayorAddressSchema,
    /** contact {EnterpriseContactSchema} - contact details of the TPA such as phone, weburl, etc */
    contact: PayorContactSchema,
    /** associatedtpas {ObjectId} - reference to the list of associated TPAs */
    associatedtpas: [{
        tpauid: {
            type: Schema.ObjectId,
            reference: 'TPA'
        },
        activefrom: Date,
        activeto: Date
    }],
    associatedpayoragreements: [{
        payoragreementuid: {
            type: Schema.ObjectId,
            reference: 'PayorAgreement'
        },
        activefrom: Date,
        activeto: Date
    }],
    payordocuments: [PayorDocumentSchema],
    payoralerts: [{
        alertmessage: String,
        activefrom: Date,
        activeto: Date
    }],
    /** billtemplateuid {ObjectId} - reference to the reporttemplateuid which should be defaulted while settling bill */
    billtemplateuid: {
        type: Schema.ObjectId
    },
    /** receipttemplateuid {ObjectId} - reference to the reporttemplateuid which should be defaulted while settling receipt */
    receipttemplateuid: {
        type: Schema.ObjectId
    },
    /** defaultagreementforopd {ObjectId} - default agreement for opd visits */
    defaultagreementforopd: {
        type: Schema.ObjectId, reference: 'PayorAgreement'
    },
    /** defaultagreementforopd {ObjectId} - default agreement for ip admissions */
    defaultagreementforipd: {
        type: Schema.ObjectId, reference: 'PayorAgreement'
    }
    

});



PayorSchema.plugin(resuable);

module.exports = mongoose.model('Payor', PayorSchema);
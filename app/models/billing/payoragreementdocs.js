/**
 * Schema for storing the Document for the payor agreement
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module PayorAgreementDocs
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var PayorAgreementDocsSchema = new Schema({
    /** userphoto {string} - photograph in a base64 format */
    payoragreementuid: {
        type: Schema.ObjectId,
        required: true,
        index: true,
        reference: 'PayorAgreement'
    },
    document: String,
    docname: String,
    docfiletype: String,
    uploadedby: {
        type: Schema.ObjectId,
        reference: 'User'
    },
    uploadeddate: Date,
    comments: String

});

/** plugin the framework attributes like createdat, createdby, etc. */
PayorAgreementDocsSchema.plugin(resuable);

module.exports = mongoose.model('PayorAgreementDocs', PayorAgreementDocsSchema);
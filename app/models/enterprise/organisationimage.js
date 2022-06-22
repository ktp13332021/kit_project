/**
 * Schema for storing the photograph of the organisation 
 * See {@tutorial enterprise-tutorial} for an overview.
 * @module OrganisationImage
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var OrganisationImageSchema = new Schema({
    /** organisationphoto {string} - photograph in a base64 format */
    organisationphoto: String,
    organisationcode: String,
    comments: String
});

/** plugin the framework attributes like createdat, createdby, etc. */
OrganisationImageSchema.plugin(resuable);

module.exports = mongoose.model('OrganisationImage', OrganisationImageSchema);

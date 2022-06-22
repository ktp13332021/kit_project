/**
 * Schema representing Certificate Template details.
 * The Certificate template contains template that needs to be used for mail merge in EMR.
 * See {@tutorial form-tutorial} for an overview.
 *
 * @module CertificateTemplate
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var CertificateTemplateSchema = new Schema({
  /** Code {string} has to be unique - to be autogenerated using sequence number*/
  code: { type: String, required: true, index: true },
  /** Name {string} defines the  name given for the cert template*/
  name: { type: String, required: true, index: true },
  /** description {string} - comments or text with additional details */
  description: String,
  /** locallangdesc {String} - local language for the cert template*/
  locallangdesc: String,
  /** activefrom {Date} - start date for the form template */
  activefrom: Date,
  /** activeto {Date} - end date or expiry date for the form template. */
  activeto: Date,
  /** versionnumber {Number} - to be auto incremented for each edit */
  versionnumber: Number,
  /** ispublished {Boolean} - whether the form is published to use by other users */
  ispublished: Boolean,

  /** alldepartments {Boolean} - whether open to all departments in the hospital - default true */
  alldepartments: Boolean,
  /** restrictdepartments [{ObjectId}] - uid of departments to be restricted to */
  restrictdepartments: [{
    departmentuid: { type: Schema.ObjectId, ref: 'Department' }
  }],
  /** pagetype{String} - two types supported are A4 and A5 - default A4*/
  pagetype: { type: String, enum: ['A4', 'A5'] },
  /** pageorientation{String} - whether Portrait or Landscape - default Portrait*/
  pageorientation: { type: String, enum: ['Portrait', 'Landscape'] },
  /** templatetext{String} - the html template in string format */
  templatetext: { type: String, required: true },
  /** certtypeuid {ObjectId} - reference domain - CERTTYP */
  certtypeuid: { type: Schema.ObjectId, ref: "ReferenceValue", required: true }
});

CertificateTemplateSchema.plugin(resuable);

module.exports = mongoose.model('CertificateTemplate', CertificateTemplateSchema);

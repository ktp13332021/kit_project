/**
 * Schema representing settings of Report templates.
 * The record stored in this schema will be used to print from other functions
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module ReportTemplate
 */
// import the necessary modules

var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;


var ReportTemplateSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given for the age*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the age */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the age. */
    activeto: Date,
    /** reportgroupuid {ObjectId} - reference value code :  RPTGRP - values OPD, IPD, Cashier, Inventory, etc */
    reportgroupuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** routepath {String} - path to the route method */
    routepath: { type: String, required: true },
    /** paramtype {String} - type of the parameter PATIENTVISIT, INVOICE, RECEIPT, PO, etc */
    paramtype: { type: String, required: true, index: true },
    /** reportid {String} - type of the report for the constructing parameters */
    reportid: { type: String, required: true },
    /** statecode {String} - state for loading parameter screen */
    statecode: String,
    /** isautoprint {Boolean} - whether the report should print automatically or not */
    isautoprint: Boolean,
    /** issecuredreport {Boolean} - whether the report is secured report or not */
    issecuredreport: Boolean,
    /** papersize {String} - type can be A4 or A5 */
    papersize: { type: String, enum: ['A4', 'A5'] },
    /** orientation {String} - type can be PORTRAIT, LANDSCAPE */
    orientation: { type: String, enum: ['PORTRAIT', 'LANDSCAPE'] },
    /** display order of the report */
    displayorder: Number ,
    //** if require  export option in report  */
    isexportavailable :Boolean,
    //**languageuid {Object Id} -reference value code : "Thai ,Arab*/
    languageuid : {type: Schema.ObjectId,ref :'ReferenceValue'}
});

ReportTemplateSchema.plugin(resuable);
module.exports = mongoose.model('ReportTemplate', ReportTemplateSchema);
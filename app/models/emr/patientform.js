/**
 * Schema representing Forms in EMR details.
 * The Forms  contains filled up and completed form template of the patient.
 * See {@tutorial form-tutorial} for an overview.
 *
 * @module PatientForm
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var FormAttributeSchema = new Schema({
    /** attributeuid {ObjectId} - reference to data attribute */
    attributeuid: { type: Schema.ObjectId, required: true },
    /** name given to the section */
    name: { type: String, required: true },
    /** attribute type {String } - enum values - combo box select */
    attributetype: {
        type: String,
        enum: ['LABEL', 'HEADING', 'INPUTFIELD', 'DATEFIELD', 'DATETIMEFIELD', 'CHECKBOX', 'RADIOBUTTON', 'COMBOSELECT', 'IMAGE', 'SWITCH', 'TEXTAREA', 'CHECKLISTTEXT'],
        required: true
    },
    /** refdomaincode {ObjectId} - will be used for ComboSelect */
    refdomainuid: { type: Schema.ObjectId, ref: 'ReferenceDomain' },
    /** imagemasteruid {ObjectId} - will be used in case of Image display */
    imagemasteruid: { type: Schema.ObjectId, ref: 'ImageLibrary' },
    /** displaytext {String} - text to be displayed */
    displaytext: String,
    /** locallanguagetext {String} - local language text */
    locallangtext: String,
    /** ismandatory {Boolean} - whether this attribute is mandatory or not */
    ismandatory: Boolean,
    /** isflexiblewidth {Boolean} - if true then flex class will apply */
    isflexiblewidth: Boolean,
    /** widthpercentage {Number} - field width percentage */
    widthpercentage: Number,
    /** displaytextwidthpercentage {Number} - display text width percentage */
    displaytextwidthpercentage: Number,
    /** scripts {String} - will be used to change the Value & Visibility of the data attribute */
    scripts: String,
    /**datavalue {String} - the data entered by the user. It can be date, boolean or text. All stored as string */
    datavalue: String,
    /** additionalvalue {String} - any additional data can be stored here in comma separated */
    additionalvalue: String
});

var FormSectionSchema = new Schema({
    /** sectionuid {ObjectId} - reference to data section */
    sectionuid: { type: Schema.ObjectId, required: true },
    /** name given to the section */
    name: { type: String, required: true },
    /** sectiontype : {String} - enum values - predefined or dynamic - default value ' dynamic' */
    sectiontype: { type: String, enum: ['DYNAMIC', 'PREDEFINED'], required: true },
    /** layout {String} - enum values row or column  - combo select - default value 'column'*/
    layouttype: { type: String, enum: ['ROW', 'COLUMN'], required: true },
    /** predefinedataset {String} - enum values - 'CCHPI', 'MEDICALHISTORY, etc - combo box select */
    predefineddataset: {
        type: String,
        enum: ['CCHPI', 'MEDICALHISTORY', 'ALLERGIES', 'ALERTS', 'VITALSIGN', 'PATIENTDATA', 'ORDER', null]
    },
    /** attributes - {attributesschema} - array */
    attributes: [FormAttributeSchema]
});

// define schema
var PatientFormSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department from the patient visit */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** careprovideruid {ObjectId} - the reference to the Doctor */
    careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true },
    /** templateuid {ObjectId} - the reference to the Form template */
    templateuid: { type: Schema.ObjectId, ref: 'FormTemplate', required: true },
    /** formdate {Date} - date of the certificate */
    formdate: { type: Date, required: true },
    /** formID {String} - sequence number for the patient form */
    formID: { type: String, required: true },
    /** finalized {Boolean} - status whether the cert is locked or open - defaults true */
    finalized: { type: Boolean },
    /** formtypeuid {ObjectId} - reference domain - FORMTY */
    formtypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue', required: true },
    /** templateversion {Number} - versionnumber of Form template*/
    templateversion: Number,
    /** formtitle {String} - if this is set then the title will be displayed at the top */
    formtitle: String,
    /** font {String} - the font family that needs to be used - need to provide list of 5 font types. */
    font: String,
    /** isconfidential {Boolean} - whether this form is confidential or open to all */
    isconfidential: Boolean,
    /** FormSections  {FormSectionSchema}] - array of form sections. */
    formsections: [FormSectionSchema]
});

PatientFormSchema.plugin(resuable);

module.exports = mongoose.model('PatientForm', PatientFormSchema);
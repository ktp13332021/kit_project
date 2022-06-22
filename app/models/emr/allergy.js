
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var AllergySchema = new Schema({
  /** patientuid {ObjectId} - reference to the patient schema */
  patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
  /** patientvisituid {ObjectId} - reference to the patient visit schema */
  patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
  /** departmentuid {ObjectId} - the department of the logged in user */
  departmentuid: { type: Schema.ObjectId, ref: 'Department' },
  /** noknownallergies {Boolean} - The patient has no known allergies */
  noknownallergies: { type: Boolean },
  /** noknowndrugallergies {Boolean} - The patient has no known drug allergies */
  noknowndrugallergies: { type: Boolean },
  /** drug allergies - links to the drug master */
  drugallergies: [{
    /** reference domain code : ALGTYP  - Generic, Trade Name, Drug Group, Free Text */
    typeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    allergenuid: { type: Schema.ObjectId, ref: 'DrugGroup' }, //Drug master or Drug group ,,,
    allergenname: String,
    druggroupuid: { type: Schema.ObjectId, ref: 'DrugGroup' },
    druggroupname: String,
    tradenameuid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    tradename: String,
    freetext: String,
    isobservedinvisit: Boolean, // default false
    symptoms: { type: String }, //String
    onsetdate: Date,
    closuredate: Date,
    createdon: Date,
    createdby: { type: Schema.ObjectId, ref: 'User' },
    /** TRUE or FALSE */
    isactive: Boolean,
    /** reference code : SEVRTY - mild, moderate, severe**/
    severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** reference code : ALGPRB - definite ADR, probable ADR, possible ADR, doubtful ADR **/
    confirmationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    allergyscoreuid: Number,
    naranjoescores: [{
      /** reference domain code : NARANJ */
      question: String,
      yes: Boolean,
      no: Boolean,
      dontknow: Boolean,
      score: Number
    }],
    comments: String,
    auditlog: [{
      useruid: { type: Schema.ObjectId, ref: 'User' },
      activestatus: Boolean,
      modifiedat: Date,
      comments: String
    }],

    /** informantuid {ObjectId} - informant type - reference domain code : INFORMANT -- informant in DRUGALLERGY file*/
    informantuid: { type: Schema.ObjectId, ref: 'ReferenceValue' }

  }],
  /** food allergies - links to result item */
  foodallergies: [{
    resultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem' }, //resulttype -> NUTRITION
    onsetdate: Date,
    closuredate: Date,
    createdon: Date,
    createdby: { type: Schema.ObjectId, ref: 'User' },
    isactive: Boolean,
    /** reference code : SEVRTY - mild, moderate, severe**/
    severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    comments: String,
    auditlog: [{
      useruid: { type: Schema.ObjectId, ref: 'User' },
      activestatus: Boolean,
      modifiedat: Date,
      comments: String
    }]
  }],
  /** other allergies - links to result item */
  otherallergies: [{
    freetext: String,
    onsetdate: Date,
    closuredate: Date,
    createdon: Date,
    createdby: { type: Schema.ObjectId, ref: 'User' },
    isactive: Boolean,
    /** reference code : SEVRTY - mild, moderate, severe**/
    severityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    comments: String,
    auditlog: [{
      useruid: { type: Schema.ObjectId, ref: 'User' },
      activestatus: Boolean,
      modifiedat: Date,
      comments: String
    }]
  }]
});

AllergySchema.plugin(resuable);

module.exports = mongoose.model('Allergy', AllergySchema);
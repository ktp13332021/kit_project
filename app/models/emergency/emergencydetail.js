
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var EmergencyDetailSchema = new Schema({
  /** patientuid {ObjectId} - reference to the patient schema */
  patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
  /** patientvisituid {ObjectId} - reference to the patient visit schema */
  patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
  /** departmentuid {ObjectId} - the department of the logged in user */
  departmentuid: { type: Schema.ObjectId, ref: 'Department' },
  /** isbroughtdead {Boolean} - whether the patient is brought dead */
  isbroughtdead: Boolean,
  /** isescortnok {Boolean} - whether the patient is brought by next of kin */
  isescornok: Boolean,
  /** escortname {String} - name of the escort */
  escortname: String,
  /** escortmobilenumber {Boolean} - mobile number of the escort */
  escortmobilenumber: String,
  /** escortcomments {String} - comments about the escort  */
  escortcomments: String,
  /** patientcondition {ObjectId} - condition of the patient refvalue code : PERCON*/
  patientcondition: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** incidentdetails {String} - details about the accident */
  incidientdetails: String,
  /** incidentdate {Date} - date and time of the incident */
  incidentdate: Date,

  /** aeplaceuid {ObjectId} - emergency place - refvalue code : AEPLACE -- aeplace in ACCIDENT file*/
  aeplaceuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** typeinaeuid {ObjectId} - type in emergency - refvalue code : TYPEINAE -- typein_ae in ACCIDENT file*/
  typeinaeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** alcoholuid {ObjectId} - alcohol 1.Drink , 2.Not Drink,3.Don't know - refvalue code : ALCOHOL -- alcohol in ACCIDENT file*/
  alcoholuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** nacroticdruguid {ObjectId} - nacrotic drug use - refvalue code : NARCROTICDRUG -- nacrotic_drug in ACCIDENT file*/
  nacroticdruguid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** airwayuid {ObjectId} - check breath of the patient - refvalue code : AIRWAY -- airway in ACCIDENT file*/
  airwayuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** stopbleeduid {ObjectId} - stop bleed before - refvalue code : STOPBLEED -- stopbleed in ACCIDENT file*/
  stopbleeduid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** splintuid {ObjectId} - use splint/ slab before - refvalue code : SPLINT -- splint in ACCIDENT file*/
  splintuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** fluiduid {ObjectId} - take IV fluid before - refvalue code : FLUID -- fluid in ACCIDENT file*/
  fluiduid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** urgencyuid {ObjectId} -urgency level : 1= life threatening, 2= emergency, 3= urgent, 4=acute, 5= non acute, 6 = Not sure - refvalue code : URGENCY -- urgency in ACCIDENT file*/
  urgencyuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

});

EmergencyDetailSchema.plugin(resuable);

module.exports = mongoose.model('EmergencyDetail', EmergencyDetailSchema);

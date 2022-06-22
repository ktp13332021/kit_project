
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var TriageDetailSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department of the logged in user */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** triagedby {ObjectId} - reference to the doctor who triaged */
    triagedby :  { type: Schema.ObjectId, ref: 'User' },
    /** triagedate  {Date} - date and time of triage */
    triagedate : Date,
    /** cchpiuid {ObjectId} - reference to the CCHPI record */
    cchpiuid :  { type: Schema.ObjectId, ref: 'CCHPI' },
    /** observationuid {ObjectId} - reference to the observation record */
    observationuid : { type: Schema.ObjectId, ref: 'Observation' },
    /** triageindexes [{}] - the ESI Triage index values code : EMEESI*/
    triageindexes : [{
                    indexcodeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
                    indexvalueuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    }],
    /** emergencyleveluid {ObjectId} - reference to the emregency level code : EMELVL */
    emergencyleveluid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** gcseyemovementuid {ObjectId} - reference to glascow scale eye movement  code : GCSEYE*/
    gcseyemovementuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** gcsverbaluid {ObjectId} - reference to glascow scale verbal  code : GCSVBL*/
    gcsverbaluid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** gcsmotoruid {ObjectId} - reference to glascow scale motor  coe : GCSMTR*/
    gcsmotoruid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** conciousnessuid {ObjectId} - reference to glascow concsiousness code : CONCSN*/
    conciousnessuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },

  });
  
 TriageDetailSchema.plugin(resuable);
 
 module.exports = mongoose.model('TriageDetail', TriageDetailSchema);

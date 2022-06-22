/**
 * Schema representing Episode of the patient.
 * The PatientEpisode schema stores whether the patient is deceased and details related to it..
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module PatientEpisode
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var PatientEpisodeSchema = new Schema({
        /** patientuid {ObjectId} - reference to the patient schema */
        patientuid : { type: Schema.ObjectId, ref: 'Patient', required:true,index: true },
        /** episodetypeuid {ObjectId} - reference domain code : EPSTYP */
        episodetypeuid  : { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** startdate {Date} - the start date of the episode */
        startdate : {type:Date},
        /** enddate {Date} - the end date of the episode */
        enddate : {type:Date},
        /** isactive {Boolean} - whether the episode is still active */
        isactive : Boolean,
        /** ispatientpregnant {Boolean} - whether the patient is pregnant - defaults false - disabled for Male patients */
        ispatientpregnant : {type : Boolean},
        /** sequencenumber {String} - unique sequence number for the episode */
        sequencenumber : String,
        /** comments {String} - any other comments */
        comments : String
  });
  
 PatientEpisodeSchema.plugin(resuable);
 
 module.exports = mongoose.model('PatientEpisode', PatientEpisodeSchema);

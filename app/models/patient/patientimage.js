/**
 * Schema representing Patient Image.
 * The PatientImage schema stores photograph of the patient.
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module PatientImage
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var PatientImageSchema = new Schema({
    patientphoto: String,
    patientmrn : String,
    comments : String
    
  });
  
 PatientImageSchema.plugin(resuable);
 
 module.exports = mongoose.model('PatientImage', PatientImageSchema);


// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var ScannedDocumentSchema = new Schema({
      /** patientuid {ObjectId} - reference to the patient schema */
      patientuid : { type: Schema.ObjectId, ref: 'Patient', required:true,index: true },
      /** patientvisituid {ObjectId} - reference to the patient visit schema */
      patientvisituid : { type: Schema.ObjectId, ref: 'PatientVisit', required:true,index: true },
      /** departmentuid {ObjectId} - the department of patient visit */
      departmentuid : {type : Schema.ObjectId, ref:'Department'},
      /** uploaddate {Date} - the date in which the file was uplaoded */
      uploaddate : Date,
      /** uploadedby {Schema.ObjectId} - the user who uploaded */
      uploadedby : {type : Schema.ObjectId, ref:'User'},
      /** patientorderuid {ObjectId} - if uploaded as part of the order */
      patientorderuid : {type : Schema.ObjectId, ref:'PatientOrder'},
      /** patientorderitemuid {ObjectId} - if uploaded as part of the order */
      patientorderitemuid : {type : Schema.ObjectId},
      
      /** notetypeuid {ObjectId} - reference domain - FORMTY */
  	  documenttypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** scanneddocument {Buffer} - binary data upto 4 MB maximum size */
      scanneddocument : {type: Buffer},
      /** documentname {string}  */
      documentname : String,
      /** filetype {string}  */
      filetype : String
      
                                     
  });
  
 ScannedDocumentSchema.plugin(resuable);
 
 module.exports = mongoose.model('ScannedDocument', ScannedDocumentSchema);
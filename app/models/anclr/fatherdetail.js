
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation


 var FatherDetailSchema = new Schema({
        /** patientuid {ObjectId} reference to the patient schema */
        patientuid : {type : Schema.ObjectId,ref : 'Patient', required:true, index: true},
        /** patientvisituid {ObjectId} reference to the patient visit schema */
        patientvisituid : {type : Schema.ObjectId,ref : 'PatientVisit', required:true, index: true},
        name: { type: String },
        /** reference value code 'TITLE' */
        titleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        age : Number,
        nationalid: { type: String },
        natidexpirtydate: { type: Date },
        /** reference value code 'OCCUPN' */
        occupationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        consanguinity : String,
        mobilenumber  : String,
        qualification : String,
        /** reference value code 'BLDGRP' */
        bloodgroupuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
         /** reference value code 'RHFACT' */
        rhfactoruid : { type: Schema.ObjectId, ref: 'ReferenceValue' }


     });
  
 FatherDetailSchema.plugin(resuable);
 
 module.exports = mongoose.model('FatherDetail', FatherDetailSchema);

/**
 * Schema representing Vaccine Schedule.
 * The Vaccine schedule has links to the generic drug, duration, dosage number, comments, etc
 * See {@tutorial vaccineschedule-tutorial} for an overview.
 *
 * @module VaccineSchedule
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var VaccineScheduleSchema = new Schema({
     /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
      /** genericdruguid {ObjectId} - reference to the drug master */
      genericdruguid : {type:Schema.ObjectId, ref:'DrugMaster', required:true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** locallangdesc {String} - local language for the cchpi concept*/
      locallangdesc : String,
       /** activefrom {Date} - start date for the cchpi concept */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the cchpi concept. */ 
      activeto : Date,
      /** dosagedetails [] - details of the dosage to be administered */
      dosagedetails : [{
      /** dosagenumber {Number} - first or second or third dose */
      dosagenumber : Number,
      /** minageindays {Number} - minimum age in days*/
      minageindays : Number,
      /** minagetext {String} - minimum age to show in text */
      minageintext : String,
      /** maxageindays {Number} - maximum age in days*/
      maxageindays : Number,
      /** maxagetext {String} - maximum age to show in text */
      maxagetext : String
      }]
      
  });
  
 VaccineScheduleSchema.plugin(resuable);
 
 module.exports = mongoose.model('VaccineSchedule', VaccineScheduleSchema);

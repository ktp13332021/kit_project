
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var FrequencySchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String, required:true, index: true},
      /** Name {string} defines the  name given for the age*/
      name : {type : String, required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** activefrom {Date} - start date for the age */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the age. */ 
      activeto : Date,
      /** locallangdesc {String} - local language for the age*/
      locallangdesc : String,
      /** quantityperday {Number} - local language for the age*/
      quantityperday : Number,
      /** quantityperday {Number} - local language for the age*/
      type : {type : String, enum:['EXACT TIME','REPEAT EVERY','APPROX TIME', 'SPECIFIC DAY OF WEEK', 'STAT', 'PRN', 'CUSTOM', 'HOURS INTERVAL']},
      /** timings {[Date]} - array of timings, this is enabled only for 'EXACT TIME'. array length - quantity per day */
      timings : [Date],
      /** repeatsday {Number} -  this is used to record every 1 day, every 2 days, every 3 days, etc - default value is 1*/
      repeatsday : Number,
       /** hoursinterval {Number} -  this is used to record hours interval, ie evrey 2 hours, 12 hours 36 hours - default value is null*/
      hoursinterval : Number,
      /**   {Number} daysofweek - Sun - 1, Mon - 2, Tue - 3, etc denoting the days in which the slots is recurring*/ 
      daysofweek : [Number],
      /**allordercategories {Boolean} - whether this frequency is available for all order categories */
      allordercategories : Boolean,
      /** allowedordercategories {[ObjectId]} - the list of order categories that are allowed */
      allowedordercategories : [{ type: Schema.ObjectId, ref: 'OrderCategory'}]
  });
  
 FrequencySchema.plugin(resuable);
 
 module.exports = mongoose.model('Frequency', FrequencySchema);
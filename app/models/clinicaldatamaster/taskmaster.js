
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var TaskMasterSchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
       /** Name {string} defines the  name given for the task*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** locallangdesc {String} - local language for the task*/
      locallangdesc : String,
      /** taskcategory {String} - type can be ORDER,ORDERSET, FORM, OBSERVATION, OTHERS*/
      taskcategory : {type : String, enum:['ORDER', 'ORDERSET', 'FORM', 'OBSERVATION','OTHERS']},
      /** tasktypeuid {ObjectId} - reference value code : TSKTYP */
      tasktypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
       /** activefrom {Date} - start date for the task*/ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the task. */ 
      activeto : Date,
      /** isnotifiable {Boolean} - whether the task is notifiable - default false */
      isnotifiable : Boolean,
      /** isrecurring {Boolean} - whether the task is recurring - default false */
      isrecurring : Boolean,
      
  });
  
  TaskMasterSchema.plugin(resuable);
 
 module.exports = mongoose.model('TaskMaster', TaskMasterSchema);

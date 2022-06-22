
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var ImageLibrarySchema = new Schema({
       /** departmentuid {ObjectId} - reference to the Department schema*/
      departmentuid : {type : Schema.ObjectId, ref:'Department'},
       /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
       /** Name {string} defines the  name given for the image library*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** locallangdesc {String} - local language for the image library*/
      locallangdesc : String,
       /** activefrom {Date} - start date for the image library */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the image library. */ 
      activeto : Date,
      /** clinicalimage - content of the image in base64 format */
      clinicalimage: String
      
    
  });
  
 ImageLibrarySchema.plugin(resuable);
 
 module.exports = mongoose.model('ImageLibrary', ImageLibrarySchema);

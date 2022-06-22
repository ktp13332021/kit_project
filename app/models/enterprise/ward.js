/**
 * Schema representing master data for defining a inpatient ward. 
 * The beds are usually attached to a ward
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module Ward
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;

  var WardSchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String, required:true, index: true},
      /** Name {string} defines the  name given to the ward*/
      name : {type : String, required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** activefrom {Date} - start date for the ward */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the ward. Can be null for active wards. */ 
      activeto : Date,
      /** nursingstnuid {ObjectId} - nursing station if any associated with this ward*/
      nursingstnuid : { type: Schema.ObjectId, ref: 'Location' },
       /** displayorder {Number} - denotes the sort order while displaying the list of wards*/
      displayorder : Number,
      /** directions {Number} - comments or directions to reach the ward. Can be printed in patient handouts*/
      directions : String,
      /** phone {String} - phone number or extension number*/
      phone : String,
      /** photourl {String} - web url for displaying the large photo (actual photo) associated with the ward, to be displayed at admission screen*/ 
      photourl : String
     
    
  });
  
   /** plugin the framework attributes like createdat, createdby, etc. */
WardSchema.plugin(resuable);
module.exports =  mongoose.model('Ward', WardSchema);


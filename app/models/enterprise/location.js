
/**
 * Schema representing master data for defining a Location (ex: Building, Clinic, Room, etc) 
 * The department can be defined within the hospital or in a parent hospital across the hospital group
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module Location
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;

 
  var LocationSchema = new Schema({
       /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
      /** Name {string} defines the  name given to the Location*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** activefrom {Date} - start date for the location */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the location. Can be null for active locations. */
      activeto : Date,
      /** loctypuid {ObjectId} - (LOCTYP) type of the location such as building, room, clinic, etc*/
      loctypuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** parentlocuid {ObjectId} - parent of this location such as building, room, clinic, etc*/
      parentlocuid : { type: Schema.ObjectId, ref: 'Location' },
       /** displayorder {Number} - denotes the sort order while displaying the list of locations*/  
      displayorder : Number,
      /** directions {Number} - comments or directions to reach the location hq. Can be printed in patient handouts*/
      directions : String,
       /** phone {String} - phone number or extension number*/	
      phone : String,
       /** phoneurl {String} - url for displaying the photographs*/	
      photourl : String,
      /** owningdeptuid {ObjectId} - department which is owning the location*/ 
      owningdeptuid : { type: Schema.ObjectId, ref: 'Department' }
     
    
  });
  /** plugin the framework attributes like createdat, createdby, etc. */
LocationSchema.plugin(resuable);

module.exports =  mongoose.model('Location', LocationSchema);


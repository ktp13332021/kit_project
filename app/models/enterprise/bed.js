
/**
 * Schema representing master data for defining a inpatient bed. 
 * The bed is usually attached to a ward
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module Bed
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;


/**
 * Schema defining the master data for inpatient bed.
 * 
 */

  var BedSchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String, required:true,index: true},
      /** Name {string} defines the bed number or name given to the bed*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
      /** activefrom {Date} - start date for the bed */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the bed. Can be null for active beds. */ 
      activeto : Date,
     /** bedcategoryuid {ObjectId} - denotes the category of the bed such as standard, shared, deluxe, suite, etc */  
      bedcategoryuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
     /** iscensusbed {Boolean} - denotes this is a permanent bed and to be included in the census reports for bed occupancy */ 
      iscensusbed : Boolean,
     /** warduid {ObjectId} - denotes the ward with which the bed is associated with*/  
      warduid : { type: Schema.ObjectId, ref: 'Ward' },
     /** room {ObjectId} - denotes the room if the bed is located within a room or shared room*/ 
      roomuid : { type: Schema.ObjectId, ref: 'Location' },
      /** displayorder {Number} - sort order to be followed while displaying the bed in the ward view*/  
      displayorder : Number,
      /** directions {Number} - comments or directions to reach the bed / room. Can be printed in patient handouts*/  
      directions : String,
      /** phone {String} - phone number or extension number*/ 
      phone : String,
      /** photourl {String} - web url for displaying the large photo (actual photo) associated with the bed, to be displayed at admission screen*/ 
      photourl : String,
      /** owningdeptuid {ObjectId} - department which is owning the bed*/ 
      owningdeptuid : { type: Schema.ObjectId, ref: 'Department' },
       /** genderuid {ObjectId} -  denotes if the bed has to be restricted to male or female , etc*/ 
      genderuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** agemasteruid {ObjectId} -  denotes if the bed has to be restricted to children or geriatric , etc*/ 
      agemasteruid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** istemporarybed {Boolean} - whether temp bed or basinet */
        istemporarybed : Boolean,
        /** parentbeduid {ObjectId} - parent beduid in case of temporary bed */
        parentbeduid :  { type: Schema.ObjectId, ref: 'Bed'},
        /** isbedundercleaning {Boolean}  - whether the bed is under clearning */
        isbedundercleaning : Boolean,
        /** isbedundermaintenance {Boolean}  - whether the bed is under fumigation or renovation */
        isbedundermaintenance : Boolean
     
    
  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
BedSchema.plugin(resuable);
module.exports =  mongoose.model('Bed', BedSchema);


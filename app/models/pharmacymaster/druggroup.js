/**
 * Schema representing Drug Groups.
 * The DrugGroup schema is used to record the drug groups, major groups , minor and subminor groups.
 * See {@tutorial druggroup-tutorial} for an overview.
 *
 * @module DrugGroup
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var DrugGroupSchema = new Schema({
     /** Code {string} has to be unique */
      code : {type : String,required:true, index: true},
       /** Name {string} defines the  name given for the cchpi concept*/
      name : {type :String,required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** locallangdesc {String} - local language for the cchpi concept*/
      locallangdesc : String,
       /** activefrom {Date} - start date for the cchpi concept */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the cchpi concept. */ 
      activeto : Date,
      /** druggrouptypeuid {ObjectId} - whether drug group or drug subgroup or drug minorsubgroup */
      druggrouptypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** parentgroupuid {ObjectId} - reference to the parent sub group */
      parentgroupuid : { type: Schema.ObjectId, ref: 'DrugGroup' },
      /** isallergen {Boolean} - whether this is a drug group (false) or allergen (true) */
      isallergen : {type : Boolean, required:true},
      /** code type : reference domain code : DCODTY */
      codetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** externalcode {String} - mainly used for MIMS */
      externalcode: String
  });
  
 DrugGroupSchema.plugin(resuable);
 
 module.exports = mongoose.model('DrugGroup', DrugGroupSchema);

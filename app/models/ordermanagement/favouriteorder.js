
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var patientorderitem = require('./patientorderitem');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var FavouriteOrderSchema = new Schema({
       /** careprovideruid {ObjectId} - reference to the Careprovider schema*/
      careprovideruid : {type : Schema.ObjectId, ref:'User'},
       /** Code {string} has to be unique - fill up with careprovider code automatically */
      code : {type : String,required:true, index: true},
       /** Name {string} - fill up with careprovider name automatically*/
      name : {type :String,required:true, index: true},
      /** startintab {Number} - the index of tab to start in */
      startintab : Number,
      /** usedefaultpassword {Boolean} - whether to use default password for ordering */
      usedefaultpassword : Boolean,
       /** patientorderitems [PatientOrderItem] - embedded array for the patient order items */
      patientorderitems : [patientorderitem.PatientOrderItemSchema],
     
  });
  
 FavouriteOrderSchema.plugin(resuable);
 
 module.exports = mongoose.model('FavouriteOrder', FavouriteOrderSchema);

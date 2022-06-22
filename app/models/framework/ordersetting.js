
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var OrderSettingSchema = new Schema({
    
        /** severealertstatus {ObjectId} - Reference value code : PREGNC */
        severealertstatus: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** moderatealertstatus {ObjectId} - Reference value code : PREGNC */
        moderatealertstatus: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** mildalertstatus {ObjectId} - Reference value code : PREGNC */
        mildalertstatus: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** enablemims {Boolean} - to enable or disable MIMS */
        enablemims: Boolean,
        /** mimsurl {String} - the URL for the MIMS interface */
        mimsurl: String,
        /**checkstockatallstores {Boolean} - whether to check stock at all stores */
        checkstockatallstores : Boolean
    
  });
  
  OrderSettingSchema.plugin(resuable);
 
 module.exports = mongoose.model('OrderSetting', OrderSettingSchema);

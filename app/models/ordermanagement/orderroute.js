
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var OrderRouteMapSchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String, required:true, index: true},
      /** isglobalsetting {Boolean} whether this setting is a global setting or a department specific setting */
      isglobalsetting : {type : Boolean, required:true, index: true},
      /** entypeuid {ObjectId} - reference to the encounter type - opd or ipd */
      entypeuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
      /** departmentuid {ObjectId} - reference to the department to which this route is applicable - in case of opd */
      departmentuid : {type: Schema.ObjectId, ref: 'Department'},
     /** warduid {ObjectId} - reference to the ward to which this route is applicable - in case of IPD */
      warduid : {type: Schema.ObjectId, ref: 'Ward'},
      /** activefrom {Date} - start date for the orderitem */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the orderset. */ 
      activeto : Date,
      /** routemap - links to the order map */  
      routemap : [{ 
                                ordercatuid : {type: Schema.ObjectId, ref: 'OrderCategory'},
                                ordersubcatuid : {type: Schema.ObjectId, ref: 'OrderCategory'},
                                priorityuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
                                daysofweek : [Number],
                                holidays : [Date],
                                starttime : Date,
                                endtime : Date,
                                isdefault : Boolean,
                                ordertodeptuid : {type: Schema.ObjectId, ref: 'Department'},
                                storeuid : {type: Schema.ObjectId, ref: 'InventoryStore'},
                                activefrom : Date,
                                activeto : Date
                                }],
                   
  });
  
 OrderRouteMapSchema.plugin(resuable);
 
 module.exports = mongoose.model('OrderRouteMap', OrderRouteMapSchema);
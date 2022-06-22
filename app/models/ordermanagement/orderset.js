// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

  // define schema
  var OrderSetSchema = new Schema({
      /** Code {string} has to be unique */
      code : {type : String, required:true, index: true},
      /** Name {string} defines the  name given for the orderset*/
      name : {type : String, required:true, index: true},
      /** description {string} - comments or text with additional details */
      description : String,
       /** activefrom {Date} - start date for the orderitem */ 
      activefrom : Date,
      /** activeto {Date} - end date or expiry date for the orderset. */ 
      activeto : Date,
      /** locallangdesc {String} - local language for the orderset*/
      locallangdesc : String,
      /** ordercatuid {ObjectId} - reference to the order category*/
      ordercatuid : {type: Schema.ObjectId, ref: 'OrderCategory'},
      /** ordersubcatuid {ObjectId} - reference to the order sub category*/
      ordersubcatuid : {type: Schema.ObjectId, ref: 'OrderSubCategory'},
      /** aliasnames {String} - alternative names for searching. defaults to empty - Chips control*/
      aliasnames : [{type: String}],
      /** restrictencounters {ObjectId} - reference to the encounter type. defaults to empty - Chips control*/
      restrictencounter : {type: Schema.ObjectId, ref: 'ReferenceValue'},
      /** isticksheet {Boolean} - whether to display the order set as a ticksheet */      
      isticksheet : Boolean,
      /** isroomrent {Boolean} - whether to display the order set as a isroomrent */      
      isroomrent : Boolean,
      /** allowduplicateitem {Boolean} - whether to allow the same item to be added more than once */      
      allowduplicateitem : Boolean,
       /** bedcategoryuid {ObjectId} - denotes the category of the bed. Used only for IPD room rent ordersets */  
      bedcategoryuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
      /** packagebilling {Boolean} - whether this orderset is treated as package for billing purposes*/      
      packagebilling : Boolean,
      /** restrictdepartments {ObjectId} - reference to one or more departments - chips control  */     
      restrictdepartments : [{type: Schema.ObjectId, ref: 'Department'}],
      /** isacrossvisits {Boolean} - whether this package cna be ued across visits. visible if packagebilling : true */
      isacrossvisits : Boolean,
      /** maxvvisitperiod {Number} - the maximum validity period (in days) for which the package is open for the patient*/
      maxvvisitperiod : Number,
      /** isflexipackage {Boolean} - whether the package is flexipackage */
      isflexipackage : Boolean,
      /** linkedagreement {ObjectId} - whether hte package itself is linked to payor agreement (flexipackage scenario) */
      linkedagreement : {type:Schema.ObjectId, ref:'PayorAgreement'},
      /** orderitems - links to the order items associated in this orderset */
      orderitems : [{ 
                                orderitemuid : {type: Schema.ObjectId, ref: 'OrderItem'},
                                priorityuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
                                frequencyuid : {type: Schema.ObjectId, ref: 'Frequency'},
                                duration : Number,
                                quantity : Number,
                                dosage : Number,
                                routeuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
                                sortorder : Number,
                                activefrom : Date,
                                activeto : Date,
                                comments : String,
                                overrideprice : Number
                                }],
                   
  });
  
 OrderSetSchema.plugin(resuable);
 
 module.exports = mongoose.model('OrderSet', OrderSetSchema);
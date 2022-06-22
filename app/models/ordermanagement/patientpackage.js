
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;

  // define schema
  var PatientPackageSchema = new Schema({
      /** patientuid {ObjectId} reference to the patient schema */
      patientuid : {type : Schema.ObjectId,ref : 'Patient', required:true, index: true},
      /** paitientvisituid {ObjectId} reference to the patient visit schema */
      patientvisituid : {type : Schema.ObjectId,ref : 'PatientVisit', required:true, index: true},
      /** ordersetuid {ObjectId} - reference to the Order Set */
      ordersetuid : {type:Schema.ObjectId, ref:'OrderSet', required:true},
      /** orderdate{Date} - the datetime  of placing the  order */
      orderdate : {type : Date,required:true},
      /** isactive {Boolean} -  */
      isactive : {type : Boolean},
      /** noofvisits {number} - the number of OPD visits for which this package is active */
      noofvisits : {type:Number},
      /** careprovideruid {ObjectId} - the careprovider who or for whom (on behalf) the order is placed */
      careprovideruid : {type : Schema.ObjectId,ref : 'User'},
      /** ordernumber {String} - unique sequence number generated for the order */
      ordernumber : {type : String,  required:true},
      /** userdepartmentuid {ObjectId} - department of the logged in user */
      userdepartmentuid : {type : Schema.ObjectId,ref : 'Department'},
      /** orderinguseruid {ObjectId} - the logged in user who placed the order */
      orderinguseruid : {type : Schema.ObjectId,ref : 'User'},
      /** packagename {String} - denoormalized here for readability purposes */
      packagename : {type:String},
      /** chargecode {String} - denoormalized here for readability purposes */
      chargecode : {type:String},
      /** tariffuid {ObjectId} - reference to the tariff */
      tariffuid : {type : Schema.ObjectId, required : true },
      /** unitprice {Number} - the unit price based on the tariff */
      unitprice : {type : Number, required: true},
      /** payordiscount {Number} - payor discount based on agreement */
      payordiscount : {type : Number},
      /** specialdiscount {Number} - special discount if any given */
      specialdiscount : {type : Number},
      /** netamount {Number} - the final amount for the row */
      netamount : {type : Number},
      /** overriddenprice {Boolean} - whether the price is overridden by the careprovider - defaults false */
      overriddenprice : {type : Boolean},
      /** visitpayoruid {ObjectId} - reference to the visit payor */
      visitpayoruid : {type: Schema.ObjectId},
      /** isacrossvisits {Boolean} - whether this package cna be ued across visits. visible if packagebilling : true */
      isacrossvisits : Boolean,
      /** closedvisituid {Boolean} -  */
      closedvisituid : {type : Schema.ObjectId,ref : 'PatientVisit'},
      /** closeduseruid {ObjectId} - the logged in user who closed the package */
      closeduseruid : {type : Schema.ObjectId,ref : 'User'},
      /** closeddate{Date} - the datetime  of closing the package */
      closeddate : {type : Date},
      /** orderitems - links to the order items associated in this orderset */
      orderitems : [{ 
                                orderitemuid : {type: Schema.ObjectId, ref: 'OrderItem'},
                                priorityuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
                                frequencyuid : {type: Schema.ObjectId, ref: 'Frequency'},
                                duration : Number,
                                quantity : Number,
                                dosage : Number,
                                sortorder : Number,
                                activefrom : Date,
                                activeto : Date
                                }]
      
  });
  
 PatientPackageSchema.plugin(resuable);
 
 module.exports = mongoose.model('PatientPackage', PatientPackageSchema);
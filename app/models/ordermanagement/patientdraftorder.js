
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;



/** schema for saving the alerts for the order */
var PatientOrderAlertSchema = new Schema({
    /** alertdate {Date} - datetime at which this alert was shown */
    alertdate : {type : Date, required:true},
    /** alerttype {String} - this might be from external library - hence it is given as a string */
    alerttype : String,
    /** alertmessage {String} -  this might be from external library - hence it is given as a string*/
    alertmessage : String,
    /** alertseverity {String} -  this might be from external library - hence it is given as a string */
    alertseverity : String,
    /** useruid {ObjectId} - the logged in user who agreed to the alert */
    useruid : {type : Schema.ObjectId,ref : 'User'},
    /** comments {String} - any comments while accepting the alert*/
    comments : String,
    /** reasonuid {ObjectId} - reference to the reason for overriding the alert */
    reasonuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
    
});
/** schema for patient order item */
var PatientOrderItemSchema = new Schema({
    
    /** orderitemuid {ObjectId} - reference to the order item schema */
    orderitemuid : {type : Schema.ObjectId, ref : 'OrderItem', required:true},
    /** orderitemname {String} - denormallized name used in case of db inspection */
    orderitemname : String,
    /** drugmasteruid {ObjectId} -reference to the drug master schema - used for complex querying purposes */
    drugmasteruid : {type : Schema.ObjectId, ref: 'DrugMaster'},
    /** billingtype {String} - the type for billing - on raising, on order, no charges */
    billingtype : {type : String, enum:['ON RAISING','ON EXECUTION','NO CHARGES']},
    /** startdate {Date} - the start datetime  of  the  order */
    startdate : {type : Date,required:true},
    /** enddate {Date} - the end datetime  of  the  order */
    enddate : {type : Date},
    /** statusuid {ObjectId} - reference to the status of the object ORDSTS */
    statusuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
    /** careprovideruid {ObjectId} - the careprovider - mainly used for DF */
    careprovideruid : {type : Schema.ObjectId,ref : 'User', required:true},
    /** isactive {Boolean} - defaults to true, false for cancel & discontinued order */
    isactive : {type : Boolean},
    /** instructionuid {ObjectId} - reference to the instruction such as Take, Apply */
    instructionuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
    /** frequencyuid {ObjectId} - reference to the frequency of the order item */
    frequencyuid : {type : Schema.ObjectId,ref : 'Frequency' },
    /** quantity {Number} - quantity of the order - can be fractional */
    quantity : Number,
    /** quantityUOM {ObjectId} - reference to the UOM of the quantity - nos, tablets, etc */
    quantityUOM : {type : Schema.ObjectId,ref : 'ReferenceValue' },
    /** routeuid {ObjectId} - reference to the route of the medicine - filled up only for medicine orders */
    routeuid : {type : Schema.ObjectId,ref : 'ReferenceValue' },
    /** formuid {ObjectId} - reference to the form of the medicine - filled up only for medicine orders */
    formuid : {type : Schema.ObjectId,ref : 'ReferenceValue' },
    /** dosage {Number} - dosage of the medicine - filled up only for medicine orders */
    dosage : Number,
     /** quantityUOM {ObjectId} - reference to the UOM of the dosage - ml, tablets, etc */
    dosageUOM : {type : Schema.ObjectId,ref : 'ReferenceValue' },
    /** duration {Number} - duration for the medicine - usually filled up for medicine orders */
    duration : Number,
    /** comments {String} - any comments while entering the order (Onbehalf of ) */
    comments : String,
    /** instructions {ObjectId} - various instructions given during the order */
    instructions : [{ 
                    instructiontypeuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
                    instructionuid : {type: Schema.ObjectId, ref: 'ReferenceValue'},
                    instructiontext : String
                    }],
    /** copiedfromorderuid {ObjectId} - the reference to order if copy / repeat order is used */
    copiedfromorderuid :  {type : Schema.ObjectId,ref : 'PatientOrder' },   
    /** ordersetuid {ObjectId} - if placed as part of the orderset */             
    ordersetuid : {type : Schema.ObjectId,ref : 'OrderSet' },
    
    /** iscontinuousorder {Boolean} - whether this orderitem is a continous order or daily order - default false */
    iscontinuousorder : Boolean,
    /** parentorderuid {ObjectId) - UID of the parent order which is placed as continuous order */
    parentorderuid : {type :Schema.ObjectId},
     /** parentorderitemuid {ObjectId) - UID of the parent order item which is placed as continuous order */
    parentorderitemuid : {type :Schema.ObjectId},
    /** ispermissionreqforresult {Boolean} - whether permission is required to view the result - default false */
    ispermissionreqforresult : Boolean,
    /** permissionforresult {Boolean} - name of the permission for viewing the result */
    permissionnameforresult : String,
    /** istaskgenerationreqd {Boolean} - whether to generate task for this order item for the nurse - default false */
    istaskgenerationreqd : Boolean,
    /** isapprovalrequired {Boolean} - whether approval is required before processing this order item. - default false */
    isapprovalrequired : Boolean,
    /** iscosignrequired {Boolean} - whether co-signing by doctor is required for processing this order item - default false */
    iscosignrequired : Boolean,
    /** ishourlycharge {Boolean} - whether this is an hourly charges item like monitor, etc - default false */
    ishourlycharge : Boolean,
    /** isschedulable {Boolean} - whether the order can be used in scheduling appointments - default false */
      
    /** patientvisitpayoruid {ObjectId} - reference to the patientvisit payor who is covering this item */
    patientvisitpayoruid : {type :Schema.ObjectId},
    /** unitprice {Number} - unit price for the order item based on the payor agreement */
    unitprice : Number,
    /** payordiscount {Number} - discount given based on the agreement */
    payordiscount : Number,
    /** specialdiscount {Number} - discount given specially for this patient */
    specialdiscount : Number,
    /** totalprice {Number} - total price for this order item */
    totalprice : Number,
    /** ispriceoverwritten - is the price overwritten */
    ispriceoverwritten : Boolean,
    /** chargecode {String} - chargecode used by the careprovider */
    chargecode : String,
    /** specimenuid {ObjectId} - specimen associated - used for lab*/
    specimenuid : {type :Schema.ObjectId},
    /** usepreviousspecimen - use previously collected specimen - used for lab */
    usepreviousspecimen : Boolean,
    /** lateralityuid {ObjectId} - laterality associated - used for radiology*/
    lateralityuid : {type :Schema.ObjectId},
    /** noofexposures - Number of Exposures - used for lab */
    noofexposures : Number,
    /** tariffuid {ObjectId} - tariffuid given for traceability purposes */
    tariffuid : {type :Schema.ObjectId},
    /** reference to the alerts shown while ordering */
    patientorderalerts : [PatientOrderAlertSchema]
});


  // define schema
  var PatientDraftOrderSchema = new Schema({
      /** patientuid {ObjectId} reference to the patient schema */
      patientuid : {type : Schema.ObjectId,ref : 'Patient', required:true, index: true},
      /** paitientvisituid {ObjectId} reference to the patient visit schema */
      patientvisituid : {type : Schema.ObjectId,ref : 'PatientVisit', required:true, index: true},
      /** orderdate{Date} - the datetime  of placing the  order */
      orderdate : {type : Date,required:true},
      /** orderdepartment {ObjectId} - the department from which the order is placed - based on patient department*/
      orderdepartmentuid : {type : Schema.ObjectId,ref : 'Department', required:true},
       /** careprovideruid {ObjectId} - the careprovider who or for whom (on behalf) the order is placed */
      careprovideruid : {type : Schema.ObjectId,ref : 'User', required:true},
      /** ordermodeuid {ObjectId}  - mode for the patient order - self, onbehalf, protocol , etc. */
      ordermodeuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
      /** ordercommuid {ObjectId}  - communication mode for the patient order (ORDCOM) in case of onbehalf - verbal, telephonic, written , etc. */
      ordercommuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
      /** userdepartmentuid {ObjectId} - the department logged in by the user while placing the order */
      userdepartmentuid : {type : Schema.ObjectId,ref : 'Department'},
      /** orderinguseruid {ObjectId} - the logged in user who placed the order */
      orderinguseruid : {type : Schema.ObjectId,ref : 'User'},
      
      /** patientorderitems [PatientOrderItem] - embedded array for the patient order items */
      patientorderitems : [PatientOrderItemSchema],
      
      
  });
  
 PatientDraftOrderSchema.plugin(resuable);
 
 module.exports = mongoose.model('PatientDraftOrder', PatientDraftOrderSchema);
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;

/** schema for patient order item */
var PatientOrderLogSchema = new Schema({
    /** modifiedat {Date} - datetime at which this change was made */
    modifiedat: { type: Date, required: true },
    /** useruid {ObjectId} - the logged in user who made the chagne to the order */
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** comments {String} - any comments while changing the order*/
    comments: String,
    /** reasonuid {ObjectId} - reference to the reason why the order was changed */
    reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** statusuid {ObjectId} - reference to the current status */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

/** schema for saving the alerts for the order */
var PatientOrderAlertSchema = new Schema({
    /** alertdate {Date} - datetime at which this alert was shown */
    alertdate: { type: Date, required: true },
    /** alerttype {String} - this might be from external library - hence it is given as a string */
    alerttype: String,
    /** alertmessage {String} -  this might be from external library - hence it is given as a string*/
    alertmessage: String,
    /** alertseverity {String} -  this might be from external library - hence it is given as a string */
    alertseverity: String,
    /** useruid {ObjectId} - the logged in user who agreed to the alert */
    useruid: { type: Schema.ObjectId, ref: 'User' },
    /** comments {String} - any comments while accepting the alert*/
    comments: String,
    /** reasonuid {ObjectId} - reference to the reason for overriding the alert */
    reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** interactingdruguid {ObjectId} - reference to the intracting drug */
    interactingdruguid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    /** problemuid {ObjectId} - reference to the problem master */
    problemuid: { type: Schema.ObjectId, ref: 'Problem' },
    /** allergenid {ObjectId} - reference to the DrugGroup */
    allergenid: { type: Schema.ObjectId, ref: 'DrugGroup' },
    /** tradenameuid {ObjectId} - reference to the DrugMaster */
    tradenameuid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    /** druggroupuid {ObjectId} - reference to the DrugGroup */
    druggroupuid: { type: Schema.ObjectId, ref: 'DrugGroup' },
    /** allergen {String} - drug name or message*/
    allergen: String,
    /** pharmacyuseruid {ObjectId} - the logged in user who agreed to the alert */
    pharmacyuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** pharmacycomments {String} - any comments while accepting the alert*/
    pharmacycomments: String,
    /** pharmacyreasonuid {ObjectId} - reference to the reason for overriding the alert */
    pharmacyreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});
/** schema for patient order item */
var PatientOrderItemSchema = new Schema({

    /** orderitemuid {ObjectId} - reference to the order item schema */
    orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem', required: true },
    /** orderitemname {String} - denormallized name used in case of db inspection */
    orderitemname: String,
    /** drugmasteruid {ObjectId} -reference to the drug master schema - used for complex querying purposes */
    drugmasteruid: { type: Schema.ObjectId, ref: 'DrugMaster' },
    /** billingtype {String} - the type for billing - on raising, on order, no charges */
    billingtype: { type: String, enum: ['ON RAISING', 'ON EXECUTION', 'NO CHARGES'] },
    /** startdate {Date} - the start datetime  of  the  order */
    startdate: { type: Date, required: true },
    /** enddate {Date} - the end datetime  of  the  order */
    enddate: { type: Date },
    /** closeby {ObjectId} - the reference to order if close */
    closeby: { type: Schema.ObjectId, ref: 'User' },
    /** statusuid {ObjectId} - reference to the status of the object ORDSTS */
    statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue', required: true },
    /** careprovideruid {ObjectId} - the careprovider - mainly used for DF */
    careprovideruid: { type: Schema.ObjectId, ref: 'User'},
    /** isactive {Boolean} - defaults to true, false for cancel & discontinued order */
    isactive: { type: Boolean },
    /** instructionuid {ObjectId} - reference to the instruction such as Take, Apply */
    instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** frequencyuid {ObjectId} - reference to the frequency of the order item */
    frequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
    /** quantity {Number} - quantity of the order - can be fractional */
    quantity: Number,
    /** quantityUOM {ObjectId} - reference to the UOM of the quantity - nos, tablets, etc */
    quantityUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** routeuid {ObjectId} - reference to the route of the medicine - filled up only for medicine orders */
    routeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** formuid {ObjectId} - reference to the form of the medicine - filled up only for medicine orders */
    formuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** dosage {Number} - dosage of the medicine - filled up only for medicine orders */
    dosage: Number,
    /** quantityUOM {ObjectId} - reference to the UOM of the dosage - ml, tablets, etc */
    dosageUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** duration {Number} - duration for the medicine - usually filled up for medicine orders */
    duration: Number,
    /** comments {String} - any comments while entering the order (Onbehalf of ) */
    comments: String,
    /** instructions {ObjectId} - various instructions given during the order */
    instructions: [{
        instructiontypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        instructiontext: String
    }],
    /** broughtfromoutside {Boolean} - Is it brought from outside order */
    broughtfromoutside: Boolean,
    /** infusionrate {Number} - enabled if isiv. rate of infusion */
    infusionrate: Number,
    /** infusionduration {Number} - infusion duration in minutes */
    infusionduration: Number,
    /** infusionrateuom {Object} - UOM of infusion rate*/
    infusionrateuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** infusionduration {Object} - UOM of infusion duration */
    infusiondurationuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** istaperingdose {Boolean} - whether it is tapering dosage */
    istaperingdose: Boolean,
    /** taperingdetails [{}] - details about the tapering */
    taperingdetails: [{
        dosenumber: Number,
        frequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
        frequencyname: String,
        dosage: Number,
        dosageUOM: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        startdate: { type: Date },
        enddate: { type: Date },
        duration: Number,
        quantity: Number

    }],
    /** isslidingscale {Boolean} - whether this drug uses sliding scale for dosage calculation - defaults to false */
    isslidingscale: Boolean,
    /** slidingscale definition - separate tab*/
    slidingscaledetails: {
        resultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem' },
        rangedetails: [{
            agegroupuid: { type: Schema.ObjectId, ref: 'AgeMaster' },
            genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            fromvalue: Number,
            tovalue: Number,
            dosage: Number
        }]
    },
    /** isipfillallowed {Boolean} - whether IP Fill is allowed or not for this drug */
    isipfillallowed : Boolean,
    /** numberofrefills {Number} - no of refills to be allowed for OPD */
    numberofrefills : Number,
    /** refillorderuid {ObjectId} - the parentuid of the refill order */
    refillorderuid : { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** refillnumber {Number} - the number of refill */
    refillnumber : Number,
    /** copiedfromorderuid {ObjectId} - the reference to order if copy / repeat order is used */
    copiedfromorderuid: { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** ordersetuid {ObjectId} - if placed as part of the orderset */
    ordersetuid: { type: Schema.ObjectId, ref: 'OrderSet' },
    /** patientpackageuid {ObjectId} - if placed as part of the package */
    patientpackageuid: { type: Schema.ObjectId, ref: 'PatientPackage' },
    /** patientpackageitemuid {ObjectId} - if placed as part of the package */
    patientpackageitemuid: { type: Schema.ObjectId },
    /** patientfutureorderuid {ObjectId} - reference to the future object */
    patientfutureorderuid: { type: Schema.ObjectId },
    /** iscontinuousorder {Boolean} - whether this orderitem is a continous order or daily order - default false */
    iscontinuousorder: Boolean,
    /** parentorderuid {ObjectId) - UID of the parent order which is placed as continuous order */
    parentorderuid: { type: Schema.ObjectId },
    /** parentorderitemuid {ObjectId) - UID of the parent order item which is placed as continuous order */
    parentorderitemuid: { type: Schema.ObjectId },
    /** ishourlycharge {Boolean} - whether this is an hourly charges item like monitor, etc - default false */
    ishourlycharge: Boolean,
    /** isapprovalrequired {Boolean} - whether approval is required before processing this order item. - default false */
    isapprovalrequired: Boolean,
    /** iscosignrequired {Boolean} - whether co-signing by doctor is required for processing this order item - default false */
    iscosignrequired: Boolean,

    /** patientvisitpayoruid {ObjectId} - reference to the patientvisit payor who is covering this item */
    patientvisitpayoruid: { type: Schema.ObjectId },
    /** unitprice {Number} - unit price for the order item based on the payor agreement */
    unitprice: Number,
    /** payordiscount {Number} - discount given based on the agreement */
    payordiscount: Number,
    /** specialdiscount {Number} - discount given specially for this patient */
    specialdiscount: Number,
    /** totalprice {Number} - total price for this order item */
    totalprice: Number,
    /** ispriceoverwritten - is the price overwritten */
    ispriceoverwritten: Boolean,
    /** chargecode {String} - chargecode used by the careprovider */
    chargecode: String,
    /** specimenuid {ObjectId} - specimen associated - used for lab*/
    specimenuid: { type: Schema.ObjectId, ref: 'Specimen' },
    /** usepreviousspecimen - use previously collected specimen - used for lab */
    usepreviousspecimen: Boolean,
    /** lateralityuid {ObjectId} - laterality associated - used for radiology*/
    lateralityuid: { type: Schema.ObjectId },
    /** noofexposures - Number of Exposures - used for lab */
    noofexposures: Number,
    /** tariffuid {ObjectId} - tariffuid given for traceability purposes */
    tariffuid: { type: Schema.ObjectId },
    /** iscosigned - is the cosigned by careprovider */
    iscosigned: Boolean,
    /** checklists {ObjectId} - One or more checklist that need to be captured*/
    checklists: [{ type: Schema.ObjectId, ref: 'PatientForm' }],
    /** reference to the patient order item status chagne log */
    patientorderlogs: [PatientOrderLogSchema],

    /** reference to the alerts shown while ordering */
    patientorderalerts: [PatientOrderAlertSchema],
    /** linkedapptuid : used for future order links to appointment  */
    linkedapptuid: { type: Schema.ObjectId },
    /** ordertype {String} - whther ORDER or ORDERSET - used for future orders */
    ordertype: String,
    ordercattype: String,
    /** orderinguseruid {ObjectId} - the logged in user who placed the future order */
    orderinguseruid: { type: Schema.ObjectId, ref: 'User' },
    /** orderdate{Date} - the datetime  of placing the  future order */
    orderdate: { type: Date },
    /** priorityuid {ObjectId}  - priority for the patient order - routine , stat , etc. */
    priorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** assignquantity - String - allocated quantity from the store */
    assignquantity: String,
    /** isnokdiet {Boolean} - whether the order is for the patient next of kin */
    isnokdiet: Boolean,
    /** administrationinstruction - String */
    administrationinstruction: String,
    /** accessionnumber - String */
    accessionnumber: String,
    /** todaysdosages [Date] - used for timing of the todays dosage for continuous order */
    todaysdosages : [Date],
    /** quantityperdose {Number} - quantity for per dosages */
    quantityperdose : Number
});

module.exports.PatientOrderItemSchema = PatientOrderItemSchema;
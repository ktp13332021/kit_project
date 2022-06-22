
/**
 * Schema representing data for the bed transfer workflow. 
 * The bedtransfer details contains details for ward, bed transfers.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module bedtransfer
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the bedtransfer.
 * 
 */
var BedTransferSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** sourcewarduid {ObjectId} - the current ward of the patient */
    sourcewarduid : {type : Schema.ObjectId, ref : 'Ward'},
    /** sourcebeduid {ObjectId} - the current bed of the patient */
    sourcebeduid : {type : Schema.ObjectId, ref : 'Bed'},
    /** sourcebedcatuid {ObjectId} - the current bed category of the patient */
    sourcebedcatuid : {type : Schema.ObjectId, ref : 'ReferenceValue'},
    /** destwarduid {ObjectId} - the desired ward of the patient */
    destwarduid : {type : Schema.ObjectId, ref : 'Ward'},
    /** destbeduid {ObjectId} - the desired bed of the patient */
    destbeduid : {type : Schema.ObjectId, ref : 'Bed'},
    /** destbedcatuid {ObjectId} - the desired bed category of the patient */
    destbedcatuid : {type : Schema.ObjectId, ref : 'ReferenceValue'},
    /** destbedpackageuid {ObjectId} - the desired bed charge orderset of the patient */
    destbedpackageuid : {type : Schema.ObjectId, ref : 'OrderSet'},
     /** bookedby {ObjectId} - user who reserved */
    bookedby : { type: Schema.ObjectId, ref: 'User'},
    /** bookingat{Date} - date and time of booking*/
    bookedat : Date,
    /** commnets {String} - comments and remarks */
    comments : String,
    /** retaincurrentbed {Boolean} - retain the existing bed as well */
    retaincurrentbed : Boolean,
    /** statusuid {ObjectId} - REference value code : TRFSTS */
    statusuid : {type : Schema.ObjectId, ref: 'ReferenceValue'},
    /** isactive {Boolean} - whether the record is active - defaults to true*/
    isactive : Boolean,
    /** islodgerbed {Boolean} - whether the bed is used by patient or by nok */
    islodgerbed: Boolean,
    /** isolationrequired {Boolean} - whether the bed is used by patient or by nok */
    isolationrequired: Boolean,
    /** cancelledby {ObjectId} - user who cancelledit */
    cancelledby : {type : Schema.ObjectId, ref:'User'}, 
    /** canceldate {Date}  - date and time of cancel*/
    canceldate : Date,
    /** auditlogs [] - the audit history of the record. */
    auditlogs : [{
       /** modifiedat {Date} - datetime at which this change was made */
        modifiedat : {type : Date, required:true},
        /** useruid {ObjectId} - the logged in user who made the chagne to the order */
        useruid : {type : Schema.ObjectId,ref : 'User'},
        /** comments {String} - any comments while changing the details*/
        comments : String,
        /** statusuid {ObjectId} - reference to the current status */
        statusuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
         
    }]

  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
BedTransferSchema.plugin(resuable);
module.exports =  mongoose.model('BedTransfer', BedTransferSchema);


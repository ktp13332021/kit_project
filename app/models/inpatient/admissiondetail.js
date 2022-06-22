
/**
 * Schema representing data for the Admission Details of the patient. 
 * The admission details schema contains the additional details to patientvisit.
 * See {@tutorial adt-tutorial} for an overview.
 *
 * @module admissiondetail
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the AdmissionDetail.
 * 
 */
var AdmissionDetailSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** expectedlos {number} - expected length of stay */
    expectedlos: Number,
    /** bedbookinguid {ObjectId} - reference to the bed booking */
    bedbookinguid : {type : Schema.ObjectId},
    /** admissionrequestuid {ObjectId} -reference to the admissino request */
    admissionrequest : {type : Schema.ObjectId, ref : 'AdmissionRequest'},
    /** patientnok {String} - name of the patient attender */
    patientnok : String,
    /** patientnokcontact {String} - phone number of the nok */
    patientnokcontact : String,
    /** isolationrequired { Boolean}  - whether the patient needs isolation*/
    isolationrequired : Boolean,
    /** ismedicolegalcase {Boolean} - whether the admission is related to medico legal case */
    ismedicolegalcase : Boolean,
    /** complaintnumber {String} - the legal complaint number */
    complaintnumber : String,
    /** incidentdetails {String} - details about the incident */
    incidentdetails : String

  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
AdmissionDetailSchema.plugin(resuable);
module.exports =  mongoose.model('AdmissionDetail', AdmissionDetailSchema);


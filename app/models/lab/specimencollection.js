
/**
 * Schema representing master data for defining specimen collection. 
 * The specimen is asociated with the lab order and a report
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module TestSpecimen
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the specimen collection.
 * 
 */
var SpecimenCollectionSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** patientorderuid  {ObjectId} - reference to the patient order */
    patientorderuid :  { type: Schema.ObjectId, ref: 'PatientOrder' },
    /** specimendetails [{}] - array containing the details of the specimen */
    specimendetail : [{
                    /** specimenuid {ObjectId} - reference to the specimen */
                    specimenuid : { type: Schema.ObjectId, ref: 'Specimen' },
                    /** specimennumber {String} - sequence Id for the specimen collected */
                    specimennumber : String,
                    /** volumecollected {Number} - the actual volume collected */
                    volume : Number,
                    /** specimendate {Date} - the datetime  of collecting the  specimen */
                    specimendate: { type: Date, required: true },
                    /** userdepartmentuid {ObjectId} - the department logged in by the user while collecting the specimen */
                    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
                    /** observinguseruid {ObjectId} - the logged in user who collecting the specimen */
                    observinguseruid: { type: Schema.ObjectId, ref: 'User' },
                    /** statusuid {ObjectId} - status whether collected, accepted, rejected , etc. Referencevalue Code : SPMSTS  */
                    statusuid : { type: Schema.ObjectId, ref: 'Referencevalue' },
                    /** patientorderitemuids [{ObjectId}] - referene to the patient order item. */
                    patientorderitemuids : [{ type: Schema.ObjectId}],
                    /** auditlog [{}] - audit log of the status changes */
                    auditlogs : [{
                        /** modifiedat {Date} - datetime at which this change was made */
                        modifiedat : {type : Date, required:true},
                        /** useruid {ObjectId} - the logged in user who made the chagne to the order */
                        useruid : {type : Schema.ObjectId,ref : 'User'},
                        /** comments {String} - any comments while changing the specimen*/
                        comments : String,
                        /** reasonuid {ObjectId} - reference to the reason why the specimen was changed */
                        reasonuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
                        /** statusuid {ObjectId} - reference to the current status */
                        statusuid : {type : Schema.ObjectId,ref : 'ReferenceValue'},
                    }]

    }]
  });
  
/** plugin the framework attributes like createdat, createdby, etc. */
SpecimenCollectionSchema.plugin(resuable);
module.exports =  mongoose.model('SpecimenCollection', SpecimenCollectionSchema);


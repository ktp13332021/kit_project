/**
 * Schema representing master data for MRD Folder. 
 * The MRD folder represents the physical case note of the patient.
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module mrdfolder
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the MRD Folder.
 * 
 */
var MRDFolderSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', index: true },
    /** folderid {String} - the mrn of hte patient or the admission number */
    folderid: String,
    /** foldertypeuid {ObjectId} - referencevalue code : FOLDTY - values : OP CHART, IP CHART, Dental Chart, Cathlab Chart, X-Ray*/
    foldertypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** isactive {Boolean} - whether the folder is active or not. */
    isactive: Boolean,
    /** creationdate {Date} - the date time of creation of the folder */
    foldercreatedat: Date,
    /** createdby {ObjectId} - the user who created the file */
    foldercreatedby: { type: Schema.ObjectId, ref: 'User' },
    /** owningdepartmentuid {ObjectId} - the mrd storage at which it is created */
    owningdepartmentuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /** owningmrdstorage {ObjectId} - the mrd storage at which it is created */
    owningmrdstorage: { type: Schema.ObjectId, ref: 'MRDStorage', required: true },
    /** currentdeptuid {ObjectId} - the current department holding this Folder */
    currentdeptuid: { type: Schema.ObjectId, ref: 'Department',required: true },
    /** comments {String} - any comments */
    comments: String,
    /** folderautocreated  {Boolean} - whether the folder is created manually or automatically */
    folderautocreated: Boolean,
    /** auditlogs [] - the movement history of the folder. */
    auditlog: [{
        fromdeptuid: { type: Schema.ObjectId, ref: 'Department' },
        issuinguseruid: { type: Schema.ObjectId, ref: 'User' },
        todeptuid: { type: Schema.ObjectId, ref: 'Department' },
        transtype : String,
        auditdate : Date,
        comments : String
    }]
});

/** plugin the framework attributes like createdat, createdby, etc. */
MRDFolderSchema.plugin(resuable);
module.exports = mongoose.model('MRDFolder', MRDFolderSchema);


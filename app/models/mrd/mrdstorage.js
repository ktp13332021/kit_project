
/**
 * Schema representing master data for MRD Storage Location. 
 * The Storage location is the center for storing and managing the physical files.
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module mrdstorage
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the MRD Storage Location.
 * 
 */
var MRDStorageSchema = new Schema({
  /** Code {string} has to be unique */
  code: { type: String, required: true, index: true },
  /** Name {string} defines the  name given to the Location*/
  name: { type: String, required: true, index: true },
  /** description {string} - comments or text with additional details */
  description: String,
  /** activefrom {Date} - start date for the location */
  activefrom: Date,
  /** activeto {Date} - end date or expiry date for the location. Can be null for active locations. */
  activeto: Date,
  /** locationuid {ObjectId} - reference to the Location object*/
  locationuid: { type: Schema.ObjectId, ref: 'Location' },
  /** departmentuid {ObjectId} - reference to the department object */
  departmentuid: { type: Schema.ObjectId, ref: 'Department', required: true, index: true  },
  /** activerecordperiod {Number} - in years, the records of patients who visited to be maintain */
  activerecordperiod: Number,
  /** archiveperiod {Number} - the period after which to archive the record */
  archiveperiod: Number,
  /** filetypeduration [] - the outstanding duration to receive the files back at MRD based on filetype */
  filetypeduration: [{
    /** filetypeuid {ObjectId} - referencevalue code : FOLDTY - values : OP CHART, IP CHART, Dental Chart, Cathlab Chart, X-Ray*/
    filetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** duration in days for oustanding */
    duration: Number
  }],
  /** requestvalidityduration {Number} - the validity period for the request */
  requestvalidityduration : Number

});

/** plugin the framework attributes like createdat, createdby, etc. */
MRDStorageSchema.plugin(resuable);
module.exports = mongoose.model('MRDStorage', MRDStorageSchema);


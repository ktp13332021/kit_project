/**
 * Schema representing master data for LIS Interface result for the Lab Analyzer. 
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module TestSpecimen
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the master data for lab specimen.
 * 
 */
var LISRawResultSchema = new Schema({

  /** analyzeruid {ObjectId} - reference to the order item  - autocomplete - code: LABANL*/
  analyzeruid: { type: Schema.ObjectId, ref: 'ReferenceValue', required: true, index : true },  
  /** description {String}  - description or comments */
  receiveddate : Date,
  isapproved : Boolean,
  approvedby : { type: Schema.ObjectId, ref: 'User' },
  approvedate : Date,
  resultdetails : [{
          machinecode : String,
          testcode : String,
          parametercode : String,
          ordernumber : String,
          resultvalue : String,
          ismanual : String,
          isqc : String,
          refrange : String,
          ishln : String,
          remarks : String
          
  }]
 
});

/** plugin the framework attributes like createdat, createdby, etc. */
//LISRawResultSchema.plugin(resuable);
module.exports = mongoose.model('LISRawResult', LISRawResultSchema);


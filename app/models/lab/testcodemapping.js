/**
 * Schema representing master data for test code mapping for the LIS Module. 
 * The test code maps a result item to analyzer test code for an equipment.
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
var TestCodeMappingSchema = new Schema({

  /** analyzeruid {ObjectId} - reference to the order item  - autocomplete - code: LABANL*/
  analyzeruid: { type: Schema.ObjectId, ref: 'ReferenceValue', required: true, index : true },  
  /** description {String}  - description or comments */
  description : String,
  activefrom : Date,
  activeto : Date,
  mappingdetails : [{
        /** orderresultitemuid {ObjectId} - reference to the order item  - autocomplete*/
        orderresultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem' },
        /** listestcode  {String} - testcode from the list*/
        listestcode : String
  }]
  
});

/** plugin the framework attributes like createdat, createdby, etc. */
TestCodeMappingSchema.plugin(resuable);
module.exports = mongoose.model('TestCodeMapping', TestCodeMappingSchema);


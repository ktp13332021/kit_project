
/**
 * Schema representing master data for defining a test (orderitem) and specimen association. 
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
 * Schema defining the master data for lab specimen.
 * 
 */
var TestSpecimenSchema = new Schema({

  /** orderitemuid {ObjectId} - reference to the order item  - autocomplete*/
  orderitemuid: { type: Schema.ObjectId, reference: 'OrderItem' },
  /** method {String} - the method of testing to be printed in the report - input control */
  method: String,
  /** footermsg {String} - the message to be printed in the footer if any - input control */
  footermsg: String,
  /** printgroupuid {ObjectId} - the print group / header to group and print the report - comboselect control*/
  printgroupuid: { type: Schema.ObjectId, reference: 'OrderCategory' },
  /** printorder {Number} - the order in which to print - - input control*/
  printorder: Number,
  /** printseparate {Boolean} - whether to print in separate paper - switch control*/
  printseparate: Boolean,
  /** processduration {Number} - the time for processing in minutes - input control*/
  processduration: Number,
  /** associatedspecimens - [] array of specimen associated with this test - table with add delete buttons*/
  specimeninstructions: [{
    /** specimenuid {ObjectId} - referene to the specimen  */
    specimenuid: { type: Schema.ObjectId, ref: 'Specimen' },
    /** isdefault {Boolean} - whether this is to be defaulted in case of many specimen */
    isdefault: Boolean,
    /** activefrom {Date} - start date for the association */
    activefrom: Date,
    /** activeto {Date} - end date. Can be null for active records. */
    activeto: Date,
  }],
  /** labtestuid {ObjectId} - reference domain code: LABTEST */
  labtestuid: { type: Schema.ObjectId, ref: 'ReferenceValue' }

});

/** plugin the framework attributes like createdat, createdby, etc. */
TestSpecimenSchema.plugin(resuable);
module.exports = mongoose.model('TestSpecimen', TestSpecimenSchema);


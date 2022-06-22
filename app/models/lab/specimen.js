
/**
 * Schema representing master data for defining a lab specimen. 
 * The specimen is asociated with the lab order and a report
 * See {@tutorial lab-tutorial} for an overview.
 *
 * @module Specimen
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;
/**
 * Schema defining the master data for lab specimen.
 * 
 */
var SpecimenSchema = new Schema({
  /** Code {string} has to be unique */
  code: { type: String, required: true, index: true },
  /** Name {string} defines the bed number or name given to the bed*/
  name: { type: String, required: true, index: true },
  /** description {string} - comments or text with additional details */
  description: String,
  /** activefrom {Date} - start date for the specimen */
  activefrom: Date,
  /** activeto {Date} - end date or expiry date for the specimen. Can be null for active specimen. */
  activeto: Date,
  /** specimentypeuid {ObjectId} - reference value to specimen type such as Blood, Urine, etc  code : SPCMTY */
  specimentypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** volume {Number} - volume to collect */
  volume: Number,
  /** volumeuom {ObjectId} - volume uom - reference code : INVUOM*/
  volumeuom: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** containertypeuid {ObjectId} - reference to the container type code : CONTYP*/
  containertypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** bodysiteuid {ObjectId} - reference to the body site code : BODYSI*/
  bodysiteuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** collectionmethoduid {ObjectId} - reference to the collection method code : COLMTD */
  collectionmethoduid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
  /** specimeninstructions {ObjectId} - specimen instructions which has to be shown while collecting specimen*/
  specimeninstructions: [{
    instructiontypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    instructiontext: String
  }],
  /** canconsolidate {Boolean} - whether the specimen can be consolidate for all requests - switch control*/
  canconsolidate: Boolean,
  /** istimedcollection {Boolean} - whether the specimen needs to be collected at different times - eg: GTT - switch control*/
  istimedcollection: Boolean,
  /** nooftimes {Number} - number of times to collect , defaults to 1. set in case of istimedcollection = true */
  nooftimes: Number,
  /** stabilityperiod {Number} - duration fields to set disposable time of specimen*/
  stabilityperiod: Number


});

/** plugin the framework attributes like createdat, createdby, etc. */
SpecimenSchema.plugin(resuable);
module.exports = mongoose.model('Specimen', SpecimenSchema);


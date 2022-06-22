/**
 * Schema representing Clinical Noting template details.
 * The Clinical Note template contains template that needs to be used in examination, surgery notes, etc.
 * See {@tutorial form-tutorial} for an overview.
 *
 * @module ClinicalNoteTemplate
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var NoteTemplateSchema = new Schema({
  /** Code {string} has to be unique */
  code: { type: String, required: true, index: true },
  /** Name {string} defines the  name given for the note template*/
  name: { type: String, required: true, index: true },
  /** description {string} - comments or text with additional details */
  description: String,
  /** locallangdesc {String} - local language for the note template*/
  locallangdesc: String,
  /** activefrom {Date} - start date for the note template */
  activefrom: Date,
  /** activeto {Date} - end date or expiry date for the note template. */
  activeto: Date,
  /** alldepartments {Boolean} - whether open to all departments in the hospital - default true */
  alldepartments: Boolean,
  /** restrictdepartments [{ObjectId}] - uid of departments to be restricted to */
  restrictdepartments: [{
    departmentuid: { type: Schema.ObjectId, ref: 'Department' }
  }],
  /** notetypeuid {ObjectId} - reference domain - FORMTY */
  notetypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue', required:true },
  /** templatetext{String} - the note template in string format */
  templatetext: { type: String, required: true }
});

NoteTemplateSchema.plugin(resuable);

module.exports = mongoose.model('NoteTemplate', NoteTemplateSchema);

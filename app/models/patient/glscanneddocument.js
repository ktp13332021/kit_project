/**
 * Schema representing consult guarantee letter for the patient issued by the payor.
 * See {@tutorial patient-tutorial} for an overview.
 *
 * @module payorguaranteeletter
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var GlScannedDocumentSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit' },
    /** tpauid  */
    tpauid: { type: Schema.ObjectId, ref: 'TPA' },
    gldetailsuid: { type: Schema.ObjectId, ref: 'PayorGuaranteeLetter' },
    /** scanneddocument {Buffer} - binary data upto 4 MB maximum size */
    scanneddocument: { type: Buffer },
    /** scanneddocfiletype {string} - file type  */
    scanneddocfiletype: String,
});

GlScannedDocumentSchema.plugin(resuable);

module.exports = mongoose.model('GlScannedDocument', GlScannedDocumentSchema);
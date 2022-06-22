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
var PayorGuaranteeLetterSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit' },
    /** tpauid  */
    tpauid: { type: Schema.ObjectId, ref: 'TPA' },
    /** glrefnumber {String} - the GL reference Number */
    glrefnumber: String,
    /** activefrom {Date} - start date for the gl */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the gl. */
    activeto: Date,
    /** primaryname {String} - In case the primary person is not the paitnet, but NOK */
    primaryname: String,
    /** relationshipuid {ObjectID} - relationship / nok detail - NOKTYP */
    relationshipuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** maxcoveragelimit {Number} - the credit limit amount */
    maxcoveragelimit: Number,
    /** noofipdays   - number of inpatient days allowed*/
    noofipdays: Number,
    /** maxopvisits - maximum opd visits allowed */
    maxnoofvisits: Number,
    /** specialitiescovered  */
    specialitiescovered: [{
        departmentuid: { type: Schema.ObjectId, ref: 'Department' },
        careprovideruid: { type: Schema.ObjectId, ref: 'User' }
    }],
    /** scanneddocument {Buffer} - binary data upto 4 MB maximum size */
    scanneddocument: { type: Buffer },
    /** scanneddocfiletype {string} - file type  */
    scanneddocfiletype: String,
    /** comments {string}  */
    comments: String,

});

PayorGuaranteeLetterSchema.plugin(resuable);

module.exports = mongoose.model('PayorGuaranteeLetter', PayorGuaranteeLetterSchema);
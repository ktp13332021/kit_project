// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');


var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var APGARScoreChema = new Schema({
    /** activityuid {ObjectId} - A of the Apgar - activity or muscle tone - reference value 'APGARA*/
    activityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** pulseuid {ObjectId} - P of the Apgar - pulse - reference value 'APGARP*/
    pulseuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** grimaceuid {ObjectId} - G of the Apgar - grimace reflect irritability - reference value 'APGARG*/
    grimaceuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** appearanceuid {ObjectId} - A of the Apgar - appearance or Colour - reference value 'APGARC*/
    appearanceuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** respirationuid {ObjectId} - R of the Apgar - respiration - reference value 'APGARR*/
    respirationuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** apgarscore {Number} - score 7-10 excellent, 4-6 moderately depressed,0-3 severly depressed */
    apgarscore: Number
});

var NewBornDetailSchema = new Schema({

    /** patientuid {ObjectId} reference to the mother patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} reference to the mother patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** babynumber {Number}  - the baby number 1, 2, 3, etc. */
    babynumber: Number,
    /** genderuid {ObjectId} - reference domain code : GENDER */
    genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** babypatientuid {ObjectId} - reference the new born baby patient */
    babypatientuid: { type: Schema.ObjectId, ref: 'Patient' },
    /** birthdatetime {Date} - the date of bith of the new born. To be copied to the Patient record */
    birthdatetime: Date,
    /** weight {Number} - the weight in kgs */
    weight: Number,
    /** length {Number} - the length in cms */
    length: Number,
    /** headcircumference {Number} - the circumference of the head in cms */
    headcircumference: Number,
    /** chestcircumference {Number} - the circumference of the chest in cms */
    chestcircumference: Number,
    /** btlr {string}  */
    btlr: String,
    /** btnsy {String} */
    btnsy: String,
    /** modeofdeliveryuid {ObjectId} - reference value code 'DLVYMD' */
    modeofdeliveryuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** birthoutcomeuid {ObjectId} - reference value code 'BRTOCM' */
    birthoutcomeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** apgarscore1min {} - apgarscore at 1 min */
    apgarscore1min: APGARScoreChema,
    /** apgarscore5min {} - apgarscore at 5 min */
    apgarscore5min: APGARScoreChema,
    /** apgarscore10min {} - apgarscore at 10 min */
    apgarscore10min: APGARScoreChema,
    /** comments {String} - anyother remarks */
    comments: String,
    /** labourdetail {ObjectId} - reference to the labour details */
    labourdetailuid: { type: Schema.ObjectId, ref: 'LabourDetail' },
    /** shoulderwidth {Number} - the width in cms */
    shoulderwidth: Number,
    /** patencyofanusuid {ObjectId} - reference value code 'PTCYANUS' */
    patencyofanusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** umbilicalcordcutbyuid {ObjectId} - reference value code 'UMBILBY' */
    umbilicalcordcutbyuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** congenitalanomaliesuid [{ObjectId}] - reference value code 'CGNTANM' - checkboxes, multiselect */
    congenitalanomaliesuid: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** birthtraumauid {ObjectId} - reference value code 'BRTTRMA' */
    birthtraumauid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** ogtubeuid {String} */
    ogtube: String,
    /** isogtube {Boolean} */
    isogtube: Boolean,
    /** bondinguid {String} */
    bonding: String,
    /** isbonding {Boolean} */
    isbonding: Boolean,
    /** trachialsuction {String} */
    trachialsuction: String,
    /** istrachialsuction {Boolean} */
    istrachialsuction: Boolean,
    /** oxygen {String} */
    oxygen: String,
    /** isoxygen {Boolean} */
    isoxygen: Boolean,
    /** ppvncpap {String} */
    ppvncpap: String,
    /** isppvncpap {Boolean} */
    isppvncpap: Boolean,
    /** retainedettube {String} */
    retainedettube: String,
    /** isretainedettube {Boolean} */
    isretainedettube: Boolean,
    /** chestcompression {String} */
    chestcompression: String,
    /** ischestcompression {Boolean} */
    ischestcompression: Boolean,
    /** mednewborntemplateuid {ObjectId} - reference to the patient dynamic form */
    mednewbornformuid: { type: Schema.ObjectId, ref: 'PatientForm' },
});

NewBornDetailSchema.plugin(resuable);

module.exports = mongoose.model('NewBornDetail', NewBornDetailSchema);
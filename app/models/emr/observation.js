// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;


var ObservationValueSchema = new Schema({
    /** orderresultitemuid {ObjectId} - reference to the order item schema */
    orderresultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem', required: true },
    /** Name {string} defines the  name given for the result*/
    name: { type: String, required: true, index: true },
    /** shorttext {String} - short code result*/
    shorttext: String,
    /** resulttype {String} - Predefined type for the result. Mostly numeric */
    resulttype: { type: String, enum: ['NUMERIC', 'TEXTUAL', 'REFERENCEVALUE', 'ORGANISM', 'ANTIBIOTIC', 'NUTRITION'] },
    /** uomuid {ObjectId} - UOM for the result. Enabled only for resulttype = NUMERIC */
    uomuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** resultvalue {String} - value of the observation */
    resultvalue: String,
    /** HLN {String} - High, low or normal values */
    HLN: String,
    /** normal range {String} - normal range during the time of entry */
    normalrange: String,
    /** displayorder {Number} - display resultitem from setup in orderitem */
    displayorder: { type: Number }
});

// define schema
var ObservationSchema = new Schema({
    /** patientuid {ObjectId} reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** paitientvisituid {ObjectId} reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** observationdate{Date} - the datetime  of recording the  observation */
    observationdate: { type: Date, required: true },
    /** userdepartmentuid {ObjectId} - the department logged in by the user while placing the order */
    userdepartmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** observinguseruid {ObjectId} - the logged in user who placed the order */
    observinguseruid: { type: Schema.ObjectId, ref: 'User' },
    /** careprovideruid {ObjectId} - the doctor who observed*/
    careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /** orderitemuid {ObjectId} - reference to the order item schema */
    orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem', required: true },
    /** isreusedfromothermodules {Boolean} - is this reused from other modules - default to false */
    isreusedfromothermodules: Boolean,
    /** observationvalues [ObservationValueSchema] - embedded array for the patient order items */
    observationvalues: [ObservationValueSchema]
});

ObservationSchema.plugin(resuable);

module.exports = mongoose.model('Observation', ObservationSchema);
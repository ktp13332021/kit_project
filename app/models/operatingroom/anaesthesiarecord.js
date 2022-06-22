// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// var AgentsUsedSchema = new Schema({
//     /** orderitemuid {ObjectId} - reference to the order item schema */
//     orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem', required: true },
//     /** quantity {Number} - quantity administerd */
//     quantity: Number,
//     /** administereddate{Date} - the datetime  of recording the  administration */
//     administereddate: { type: Date, required: true },
// });
// var FluidsIOSchema = new Schema({
//     /** orderitemuid {ObjectId} - reference to the order item schema */
//     orderitemuid: { type: Schema.ObjectId, ref: 'OrderItem', required: true },
//     /** quantity {Number} - quantity administerd */
//     quantity: Number,
//     /** administereddate{Date} - the datetime  of recording the  administration */
//     administereddate: { type: Date, required: true },
// });

var AirwaySchema = new Schema({
    /** airwaymanagement {ObjectId} - reference value code  : AIRMGM  - easy, difficult - radio buttons - single select*/
    managementuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** airway {ObjectId} -  reference value code : ANTSAIRWAY - oral, nasal, undermask - radio buttons - single select*/
    airwayuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** intubationett {ObjectId} - reference value code : INTETT - oral, nasal, Others - radio buttons - single select*/
    intubationettuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** specialtube {ObjectId} - reference value code : SPLTUB - RAE, Bronchocath, flexible, others - single select*/
    specialtubeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** tubesize {Number} - tube size in cm */
    tubesize: Number,
    /** cuffuid {ObjectId} - reference value code : YESNO - - radio buttons */
    cuffuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** methoduid {ObjectId} - reference value code : METHOD - Direct, Blind, FOB- radio buttons - single select*/
    methoduid: { type: Schema.ObjectId, ref: 'ReferenceValue' }
});


// define schema
var AnaesthesiaRecordSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /**   {ObjectId} orscheduleslotuid - Unique ID of the or schedule - slots */
    orscheduleslotuid: { type: Schema.ObjectId, ref: 'ORSchedule.slots' },
    /** operatingroomuid {ObjectId} - the operating room in which the surgery was performed */
    operatingroomuid: { type: Schema.ObjectId, ref: 'Location' },
    /** preopchecklistuid {ObjectId} - reference to the patient dynamic form */
    preopchecklist: { type: Schema.ObjectId, ref: 'PatientForm' },
    /** surgeons {ObjectId} - the careprovider to who is to perform the surgery  */
    surgeons: [{
        roleuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        careprovideruid: { type: Schema.ObjectId, ref: 'User' }
    }],
    /** anaesthesiatypeuid {ObjectId} - reference domain ANESTY*/
    anaesthesiatypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** anaesthetist {ObjectId} - the careprovider who is the anaesthetist for the suergery */
    anaesthetist: [{ type: Schema.ObjectId, ref: 'User' }],
    /** anaesthesiastartdate {Date} - start date and time */
    anaesthesiastartdate: Date,
    /** preanestheticstateuid {ObjectId} - reference value code : PRESTA - checkboxes, multiselect */
    preanestheticstateuid: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** patientsafetyuid {ObjectId} - reference value code : PATSFT - checkboxes, multiselect */
    patientsafetyuid: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** prerequisitesuid {ObjectId} - reference value code : PREREQ - checkboxes, multiselect */
    prerequisitesuid: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** initialcomments {String}  - initial comments if any */
    initialcomments: String,
    /** agentsrecord [{ObjectId}]  - record of agents used*/
    agentsrecord: [{ type: Schema.ObjectId, ref: 'Observation' }],//[AgentsUsedSchema],
    /** observationrecord [{ObjectId}] - record of observations */
    observationsrecord: [{ type: Schema.ObjectId, ref: 'Observation' }],
    /** fluidsrecord [{ObjectId}]  - record of fluids intake and outtake used*/
    fluidsrecord: [{ type: Schema.ObjectId, ref: 'Observation' }],//[FluidsIOSchema],
    /** monitorsused {ObjectId} - reference value code : MONITR - checkboxes, multiselect */
    monitorsused: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** positions {ObjectId} - reference value code : POSITN - checkboxes, multiselect */
    positions: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** techniques {ObjectId} - reference value code : TECHNQ - checkboxes, multiselect */
    techniques: [{ type: Schema.ObjectId, ref: 'ReferenceValue' }],
    /** airway {AirwaySchema} - details about airway */
    airway: AirwaySchema,
    /** complications {String} - complications if any */
    complications: String,
    /** anaesthesianotes {String } - any other details / comments */
    anaesthesianotes: String,


    /** post operation details come here */

    /** postopobservations [{ObjectId}] - record of observations */
    postopobservations: [{ type: Schema.ObjectId, ref: 'Observation' }],
    /** postoprecoveryscores - post anaesthesia recovery score - during in time*/
    postoprecoveryscoresin: [{
        /** ANPARS -- Activity, Respiration, Circulation, Consciousness, Oxynation */
        /** evalitemuid {ObjectId} - reference value code - ANPARS -  list control - label & radio buttons */
        evalitemuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** valueuid {ObjectId} - reference value - depends  on related value of ANPARS line item */
        valueuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** score {Number}  */
        score: Number
    }],
    /** postoprecoveryscores - post anaesthesia recovery score - during discharge from recovery*/
    postoprecoveryscoresdc: [{
        /** ANPARS -- Activity, Respiration, Circulation, Consciousness, Oxynation */
        /** evalitemuid {ObjectId} - reference value code - ANPARS -  list control - label & radio buttons */
        evalitemuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** valueuid {ObjectId} - reference value - depends  on related value of ANPARS line item */
        valueuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** score {Number}  */
        score: Number
    }],
    /** postopfluidsrecord [{ObjectId}]  - record of fluids intake and outtake used*/
    postopfluidsrecord: [{ type: Schema.ObjectId, ref: 'Observation' }],//[FluidsIOSchema], 
    /** dischargedat {Date} - date time of discharge from RR */
    postopdischargedat: Date,
    /** consciousnessuid {ObjectId} - reference value code : CONSCS - radiobutton, singleselect */
    consciousnessuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** vitalstabilityuid {ObjectId} - reference value code : VTLSTB - radiobutton, singleselect */
    vitalstabilityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** postopnotes {String } - any other details / comments */
    postopnotes: String

});

AnaesthesiaRecordSchema.plugin(resuable);

module.exports = mongoose.model('AnaesthesiaRecord', AnaesthesiaRecordSchema);
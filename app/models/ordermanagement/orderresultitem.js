// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var OrderResultItemSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given for the result*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the result */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the result. */
    activeto: Date,
    /** locallangdesc {String} - local language for the result*/
    locallangdesc: String,
    /** shorttext {String} - short code result*/
    shorttext: String,
    /** resulttype {String} - Predefined type for the result. Mostly numeric */
    resulttype: { type: String, enum: ['NUMERIC', 'TEXTUAL', 'REFERENCEVALUE', 'ORGANISM', 'ANTIBIOTIC', 'NUTRITION', 'FREETEXT', 'ATTACHMENT'] },
    /** uomuid {ObjectId} - UOM for the result. Enabled only for resulttype = NUMERIC */
    uomuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** symboluid {ObjectId} - SYMBOL for the result.*/
    symboluid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** precision {Number} - Number of decimal digits. Enabled only for resulttype = NUMERIC */
    precision: Number,
    /** valueexpression {String} - expression for calculating values. Enabled only for resulttype = NUMERIC */
    valueexpression: String,
    /** documenttemplates {ObjectId} - references to the document templates - enabled only for resulttype = TEXTUAL */
    documenttemplates: [{ type: Schema.ObjectId, ref: 'DocumentTemplate' }],
    /** charttype {String} - Number of decimal digits. Enabled only for resulttype = NUMERIC */
    charttype: { type: String, enum: ['TPR', 'CHARTING', 'GROWTHCHART'] },
    /** chartparameter {String} - set for TPR & Growth Chart  */
    chartparameter: { type: String, enum: ['T', 'P', 'R', 'S', 'D', 'L', 'W', 'HC'] },
    /** displayorder {Number} - display order to be used in the tabular chart */
    displayorder: Number,
    valueranges: [{
        agemasteruid: { type: Schema.ObjectId, ref: 'AgeMaster' },
        genderuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        normalrangestart: Number,
        normalrangeend: Number,
        panicrangestart: Number,
        panicrangeend: Number
    }],
    /** refdomainuid {ObjectId} - Enabled only for resulttype = REFERRENCEVALUE */
    refdomainuid: { type: Schema.ObjectId, ref: 'ReferenceDomain' },
    /** notetemplates {ObjectId} - references to the note template - enabled only for resulttype = TEXTUAL */
    notetemplates: [{ type: Schema.ObjectId, ref: 'NoteTemplate' }],
    /** resultgroupuid {ObjectId} - code : RESGRP, values like INTAKE, OUTPUT */
    resultgroupuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

OrderResultItemSchema.plugin(resuable);

module.exports = mongoose.model('OrderResultItem', OrderResultItemSchema);
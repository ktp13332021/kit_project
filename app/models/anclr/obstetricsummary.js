var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObstetricSummary = new Schema({
    /** total number of pregnancies so far */
    totalpregnancies: Number,
    /** number of babies born alive */
    livebirths: Number,
    /** no of miscarriages less than 12 weeks */
    miscarriagelessthan: Number,
    /** no of miscarriages greater than 12 weeks */
    miscarriagegreaterthan: Number,
    /** no of babies born still */
    stillborn: Number,
    /** number of terminations */
    terminations: Number,
    /** number of deaths at neonatal age */
    neonataldeaths: Number,
    /** number of caesarean births */
    caesarean: Number,
    /** number of babies with weight less than 2.5 kg */
    birthweightless: Number,
    /** number of deliveries with gestation less than 37 weeks */
    gestationless: Number,
    /** para - Number */
    para: Number,
    /** fullterm - Number */
    fullterm: Number,
    /** premature - Number */
    premature: Number,
    /** stillbirth - Number */
    stillbirth: Number,
    /** postdeliverylast - Number */
    postdeliverylast: Number,
    /** reference value code  : LBRTYP */
    labourtype: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** heightbeforepregnant - Number */
    heightbeforepregnant: Number,
    /** weightbeforepregnant - Number */
    weightbeforepregnant: Number,
    /** bmibeforepregnant - Number */
    bmibeforepregnant: Number,
    /** pelvicassessment - String */
    pelvicassessment: String,
    /** reference value code  : NPLASM */
    nippleassessment: { type: Schema.ObjectId, ref: 'ReferenceValue' },
});

module.exports.ObstetricSummary = ObstetricSummary;
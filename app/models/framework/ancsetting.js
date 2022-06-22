var mongoose = require('mongoose');
var resuable = require('./reusableobjects');
var frameworkenum = require('./frameworkenum');

var Schema = mongoose.Schema;

var ANCSettingSchema = new Schema({
    /** examinationpaneluid {ObjectId} - reference to the Order Item object */
    examinationpaneluid: { type: Schema.ObjectId, ref: 'OrderItem' },
    /** outsidelabpaneluid {ObjectId} - reference to the Order Item object */
    outsidelabpaneluid: { type: Schema.ObjectId, ref: 'OrderItem' },
    /** fatherlabpaneluid {ObjectId} - reference to the Order Item object */
    fatherlabpaneluid: { type: Schema.ObjectId, ref: 'OrderItem' },
    /** medicalhistorytype {enum} */
    medicalhistorytype: {
        type: String,
        enum: [
            frameworkenum.medicalHistoryType.pastHistory,
            frameworkenum.medicalHistoryType.familyHistory,
            frameworkenum.medicalHistoryType.personalHistory
        ]
    },
    /** historyformtemplateuid {ObjectId} - reference to the Order Item object */
    historyformtemplateuid: { type: Schema.ObjectId, ref: 'FormTemplate' },
    /** edcduration {String} - The estimated due date from lmp */
    edcduration: String,
    /** mednewborntemplateuid {ObjectId} - reference to the  dynamic form  template - autocomplete*/
    mednewborntemplateuid: { type: Schema.ObjectId, ref: 'FormTemplate' }
});

ANCSettingSchema.plugin(resuable);
module.exports = mongoose.model('ANCSetting', ANCSettingSchema);
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation




// define schema
var AnaesthesiaSettingSchema = new Schema({

    /** preoptemplateuid {ObjectId} - reference to the  dynamic form  template - autocomplete*/
    preoptemplateuid: { type: Schema.ObjectId, ref: 'FormTemplate' },

    /** observationstemplateuid {ObjectId} - reference to the  observations template - autocomplete */
    observationstemplateuid: { type: Schema.ObjectId, ref: 'OrderItem' },

    /** agentstemplateuid {ObjectId} - reference to the  agents template - autocomplete*/
    agentstemplateuid: { type: Schema.ObjectId, ref: 'OrderItem' },

    /** fluidstemplate {ObjectId} - reference to the  fluids template - autocomplete*/
    fluidstemplateuid: { type: Schema.ObjectId, ref: 'OrderItem' }

});

AnaesthesiaSettingSchema.plugin(resuable);

module.exports = mongoose.model('AnaesthesiaSetting', AnaesthesiaSettingSchema);
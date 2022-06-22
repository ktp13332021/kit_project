var mongoose = require('mongoose');
var resuable = require('./reusableobjects');

var Schema = mongoose.Schema;

var MedicalDictionarySchema = new Schema({
    name: { type: String, required: true },
    description: String
});

MedicalDictionarySchema.plugin(resuable);
module.exports = mongoose.model('MedicalDictionary', MedicalDictionarySchema);


/**
 * Schema representing settings at organization level.
 * See {@tutorial enterprise-tutorial} for an overview.
 *
 * @module OrgSetting
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    /** tasktypeuid {ObjectId} - reference value code : TSKTYP */
    tasktypeuid : { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** taskname {String} - description or comments about the task  */
    taskname : String,
    /** taskdescription {String} - description or comments about the task  */
    taskdescription : String,
});

/** plugin the framework attributes like createdat, createdby, etc. */
TaskSchema.plugin(resuable);
module.exports = mongoose.model('Task', TaskSchema);
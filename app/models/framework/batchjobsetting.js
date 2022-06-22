/**
 * Schema representing settings of doctor workbench.
 *
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('./reusableobjects');
var frameworkenum = require('./frameworkenum');

var Schema = mongoose.Schema;

//  schema is self explanatory. each fields corresponds to the Patient Schema.

var BatchJobSettingSchema = new Schema({
    /** batchuseruid {ObjectId} - the user id to store during batch job*/
    batchuseruid: { type: Schema.ObjectId, ref: 'User' },
    /** job details */
    jobdetails: [{
        /** jobname - name of the batch jobs */
        jobname: {
            type: String,
            enum: [frameworkenum.batchjobs.closeOpdVisits,
                frameworkenum.batchjobs.closeEpisodes,
                frameworkenum.batchjobs.closeAppointments,
                frameworkenum.batchjobs.generateBedCharges,
                frameworkenum.batchjobs.dailyBedOccupancy,
            ],
            required: true
        },
        /** runtype - running type example daily, weekly */
        runtype: { type: String, enum: [frameworkenum.jobruntypes.daily, frameworkenum.jobruntypes.weekly], required: true },
        /** runtime - time to run */
        runtime: { type: Date, required: true },
        /** dayofweek - day of the week */
        dayofweek: { type: String, enum: ['0', '1', '2', '3', '4', '5', '6', null] },
    }],
});

BatchJobSettingSchema.plugin(resuable);
module.exports = mongoose.model('BatchJobSetting', BatchJobSettingSchema);


// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;



/**
* Embedded inner schema representing the audit log of schedules which are opened for use.
* The  administrator will open the schedule every month for the next month.
* This process can be automated as well. This schema contains the logs of such schedule generation activity.
* @module models.enterprise.AppointmentSchedule
*/
var RadiologyScheduleSchema = new Schema({
    /**   {ObjectId} radiologysessionuid - Unique ID of the careprovider */
    radiologysessionuid: { type: Schema.ObjectId, ref: 'RadiologySession' },
    /**   {ObjectId} radiologyslotdetailsuid - Unique ID of the radiology session - slotdetails */
    radiologyslotdetailsuid: { type: Schema.ObjectId, ref: 'RadiologySession.slotdetails' },
    /**   {Date} radiologydate - start of the schedule generation */
    radiologydate: Date,
    /**   {ObjectId} generatedby - unique ID of the user who generated. */
    generatedby: { type: Schema.ObjectId, ref: 'User' },
    /**   {String} comments - comments if entered during schedule generation*/
    comments: String,
    // /** {ObjectId} departmentuid - unique ID of the department in which the document is going to consult */
    // departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** {ObjectId} resourceuid - unique ID of the resource  in which the document is going to consult */
    resourceuid: { type: Schema.ObjectId, ref: 'Location' },
    // /**   {ObjectId} careprovideruid - Unique ID of the careprovider */
    // careprovideruid: { type: Schema.ObjectId, ref: 'User' },
    /**   {schema} timings - Inner array capturing the start time (eg: 9:00 AM ) to end time (13:00 PM) of the radiology slots
       * duration - the time to be allocated for each radiology (eg: 15 mins). This is enabled if isslotbased = false;
       * noofslots - to define n slots on first come first save basis (eg: 5 slots between 10:00 AM to 11:00 AM)
       * */
    timings: [{
        starttime: Date,
        endtime: Date,
        isslotbased: Boolean,
        duration: Number,
        noofslots: Number
    }],
    /**  {Boolean} iscancelled - is the schedule cancelled.*/
    iscancelled: Boolean,
    /**   {ObjectId} cancelledby - unique ID of the user who generated. */
    cancelledby: { type: Schema.ObjectId, ref: 'User' },
    /**   {Date} cancelleddate - unique ID of the user who generated. */
    cancelleddate: Date,
    cancelcomments: String,
    cancelreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    slots: [{
        start: Date,
        end: Date,
        allDay: Boolean,
        title: String,
        description: String,
        backgroundcolor: String,
        rendering: String,
        patientuid: { type: Schema.ObjectId, ref: 'Patient' },
        priorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        smstextuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        isactive: Boolean,
        comments: String,
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        statusreason: String,
        isoverbooking: Boolean,
        radiologynumber: String,
        auditlog: [{
            useruid: { type: Schema.ObjectId, ref: 'User' },
            statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            modifiedat: Date,
            reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
            comments: String
        }]

    }]

});


/** plugin the framework attributes like createdat, createdby, etc. */
RadiologyScheduleSchema.plugin(resuable);
module.exports = mongoose.model('RadiologySchedule', RadiologyScheduleSchema);

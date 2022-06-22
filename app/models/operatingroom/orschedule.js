

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
var ORScheduleSchema = new Schema({
    /**   {ObjectId} orsessionuid - Unique ID of the or session */
    orsessionuid: { type: Schema.ObjectId, ref: 'ORSession' },
    /**   {ObjectId} orslotdetailsuid - Unique ID of the or session - slotdetails */
    orslotdetailsuid: { type: Schema.ObjectId, ref: 'ORSession.slotdetails' },
    /**   {Date} scheduledate - start of the schedule generation */
    scheduledate: Date,
    /**   {ObjectId} generatedby - unique ID of the user who generated. */
    generatedby: { type: Schema.ObjectId, ref: 'User' },
    /**   {String} comments - comments if entered during schedule generation*/
    comments: String,
    /** {ObjectId} resourceuid - unique ID of the resource  in which the document is going to consult */
    resourceuid: { type: Schema.ObjectId, ref: 'Location' },
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
    /** cancelreasonuid {ObjectId} - reference domain ORCNRN */
    cancelreasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** reschedulereasonuid {ObjectId} - reference domain ORCNRN */
    reschedulereasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    reschedulecomments: String,
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
        isactive: Boolean,
        comments: String,
        statusuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        reasonuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        statusreason: String,
        bookingnumber: String,
        /** planningtypeuid {ObjectId} - reference domain SRGTYP */
        planningtypeuid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** criticalityuid {ObjectId} - reference domain CRITCL */
        criticalityuid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
        /** anaesthesiauid {ObjectId} - reference domain ANESTY*/
        anaesthesiauid :  { type: Schema.ObjectId, ref: 'ReferenceValue' },
         /** proceduredetails {ObjectID} - details about the procedure */
        proceduredetails : [{type:Schema.ObjectId, ref:'Procedure'}],
        /** surgeons {ObjectId} - the careprovider to who is to perform the surgery  */
        surgeons : [{
            /** roleuid {ObjectId} - reference domain SGRTYP*/
            roleuid :{ type: Schema.ObjectId, ref: 'ReferenceValue' }, 
            careprovideruid : {type : Schema.ObjectId, ref:'User'}
        }],  
        /** anaesthetist {ObjectId} - the careprovider who is the anaesthetist for the suergery */
        anaesthetist : {type : Schema.ObjectId, ref:'User'},  
        /** surgeryrequestuid {ObjectId} - the Surgery Request reference uid if any */
        surgeryrequestuid : {type : Schema.ObjectId, ref:'SurgeryRequest'},  
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
ORScheduleSchema.plugin(resuable);
module.exports = mongoose.model('ORSchedule', ORScheduleSchema);

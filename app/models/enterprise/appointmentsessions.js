// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var Schema = mongoose.Schema;


/**
 * Embedded inner schema representing the time slot details for the appointment sessions.
 * @inner
 */
var SlotDetailsSchema = new Schema({
    /** {ObjectId} departmentuid - unique ID of the department in which the careprovider is going to consult */
    departmentuid: { type: Schema.ObjectId, ref: 'Department', required: true },
    /**   {ObjectId} clinicuid - unique ID of the clinic location in which the careprovider is going to see patients */
    clinicuid: { type: Schema.ObjectId, ref: 'Location' },
    /**   {String} comments - unique ID of the department in which the careprovider is going to consult */
    comments: String,
    /**   {Number} daysofweek - Sun - 1, Mon - 2, Tue - 3, etc denoting the days in which the slots is recurring*/
    daysofweek: [Number],
    /**   {schema} timings - Inner array capturing the start time (eg: 9:00 AM ) to end time (13:00 PM) of the appointment slots
     * */
    timings: [{
        starttime: Date,
        endtime: Date,
        isslotbased: Boolean,
        /** duration - the time to be allocated for each appointment (eg: 15 mins). This is enabled if isslotbased = false; */
        duration: Number,
        /** noofslots - to define n slots on first come first save basis (eg: 5 slots between 10:00 AM to 11:00 AM) */
        noofslots: Number,
        /** maxappointments - defines the maximum number of appointments that can be made in a session. Default is NULL. */
        maxappointments: Number
    }],
    /**   {Boolean} repeats - indicates whether the slot recurs every week, every 2 weeks, etc*/
    repeatseveryweek: Boolean,
    /**   {Number} repeatsevery - the slot recurs every 1 week, every 2 weeks, etc*/
    repeatsfrequency: Number,
    /**  {Boolean} isordermandatory - defines whether future order is mandatory. Useful for radiology, vaccine scenarios.*/
    isordermandatory: Boolean,
    /**   {Boolean} isallowoverbooking - defines whether overbooking is allowed, ie, book multiple patients in one slot*/
    isallowoverbooking: Boolean,
    /**   {Boolean} isportalbookingallowed - defines whether booking is allowed from patient portal for this doctor*/
    isportalbookingallowed: Boolean,
    /**   {Boolean} allowduplicatebooking - defines whether duplicate booking can be allowed for this doctor*/
    allowduplicatebooking: Boolean,
    /**   {Boolean} isrestrictgender - defines whether to restrict only male or female patients while booking. Prevents user error*/
    restrictgender: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /**   {Boolean} isrestrictage - defines whether to restrict only to paediatric or geriatric patients, etc. Prevents user error*/
    restrictage: { type: Schema.ObjectId, ref: 'AgeMaster' }

});



/**
 * Schema defining the master data for appointment sessions.
 * The appointment session can be defined based on careprovider or the clinic (location)
 * See {@tutorial enterprise-tutorial} for an overview.
 *  @module models.enterprise.AppointmentSession
 */
var AppointmentSessionSchema = new Schema({
    /**  {string} Code -  has to be unique */
    code: { type: String, required: true, index: true },
    /**   {string} Name - for easy identification while searching. Usually the careprovider name. */
    name: { type: String, required: true, index: true },
    /**   {string} description -  used to add any comments */
    description: String,
    /**   {Date} activefrom - effective date for this master data */
    activefrom: Date,
    /**   {Date} activeto - expiry date for this master data. Can be null for active data. */
    activeto: Date,
    /**   {ObjectId} careprovideruid - Unique ID of the careprovider */
    careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true },
    /**  {SlotDetailsSchema} slotdetails - array of objects defining the time. Inner Schema */
    slotdetails: [SlotDetailsSchema],
    /**  {Boolean} whether to allow new registration or not */
    allownewregistration: Boolean,
});



/** plugin the framework attributes like createdat, createdby, etc. */
AppointmentSessionSchema.plugin(resuable);
module.exports = mongoose.model('AppointmentSession', AppointmentSessionSchema);
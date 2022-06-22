/**
 * Schema representing the Write Off Discount.
 * The WriteOff schema is populated during the AR Process when discount is provided.
 * See {@tutorial billing-tutorial} for an overview.
 *
 * @module WriteOff
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

var PatientBillDetailsSchema = new Schema({
    /** patientbilluid {ObjectId} - reference to PatientBill for which write off was provided*/
    patientbilluid: { type: Schema.ObjectId, ref: 'PatientBill' },
    /** writeoffamount {Number} - partial amount that has been write off for this particular bill from total write off*/
    writeoffamount: Number
});

// define schema
var WriteOffSchema = new Schema({
    /** sequencenumber - sequence number uniquely generated for the AR*/
    sequencenumber: String,
    /** writeoffdate {Date} - date which the write off was provided */
    writeoffdate: {
        type: Date,
        required: true
    },
    /** discountcodeuid {ObjectId} - reference to Discount code which was used for write off*/
    discountcodeuid: {
        type: Schema.ObjectId,
        ref: 'DiscountCode'
    },
    /** tpauid {ObjectId} - reference to the TPA for whom write off was made */
    tpauid: {
        type: Schema.ObjectId,
        ref: 'TPA'
    },
    /**useruid {ObjectId} - reference to the user who provided write off*/
    useruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** userdepartmentuid {ObjectId} - reference to the user logged in department who provided write off*/
    userdepartmentuid: {
        type: Schema.ObjectId,
        ref: 'Department'
    },
    /** internalcomments - comments to be shown in the screen to users */
    internalcomments: String,
    /** comments - comments to be printed in the receipt */
    comments: String,
    /** iscancelled {Boolean} - whether this entry is cancelled */
    iscancelled: Boolean,
    /** canceldate {Date} - date which the write off was cancelled */
    canceldate: {
        type: Date
    },
    /** cancelledbyuseruid {ObjectId} - reference to the user who cancelled it */
    cancelledbyuseruid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    /** cancelreasonuid {ObjectId} - reference domain code : BILRFD */
    cancelreasonuid: {
        type: Schema.ObjectId,
        ref: 'ReferenceValue'
    },
    /** cancelcomments - cancel comments to be printed in the receipt */
    cancelcomments: String,
    /** patientbilldetails [{}] - composite schema containing the list of bill details */
    patientbilldetails: [PatientBillDetailsSchema],
    /** isindividualbill {Boolean} - whether this write off was created for individual bills or not*/
    isindividualbill: Boolean,
    /** totalwriteoffamount {Number} - total amount that was discounted*/
    totalwriteoffamount: Number
});

WriteOffSchema.plugin(resuable);

module.exports = mongoose.model('WriteOff', WriteOffSchema);
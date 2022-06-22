// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');
var orderEnums = require('./orderenums');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var OrderCategorySchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given for the ordercategory*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the ordercategory */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the ordercategory. */
    activeto: Date,
    /** locallangdesc {String} - local language for the ordercategory*/
    locallangdesc: String,
    /** ordercattype {String} - type can be LAB, RADIOLOGY, MEDICINE, SUPPLY, DENTAL, DF, DIET, ROOMRENT, OTHERS */
    ordercattype: {
        type: String,
        enum: [
            orderEnums.categoryTypes.lab,
            orderEnums.categoryTypes.radialogy,
            orderEnums.categoryTypes.medicine,
            orderEnums.categoryTypes.supply,
            orderEnums.categoryTypes.diet,
            orderEnums.categoryTypes.dental,
            orderEnums.categoryTypes.doctorFee,
            orderEnums.categoryTypes.roomRent,
            orderEnums.categoryTypes.equipment,
            orderEnums.categoryTypes.others
        ]
    },
    /** billingtype {String} - the type for billing - on raising, on order, no charges */
    billingtype: {
        type: String,
        enum: [
            orderEnums.billingTypes.onRaising,
            orderEnums.billingTypes.onExecution,
            orderEnums.billingTypes.noCharges
        ]
    },
    /** issubcategory{boolean} - Indicates whether the ordercategory is sub category */
    issubcategory: Boolean,
    /** parentcategory{ObjectId} - records the linked parent order category */
    parentcategoryuid: { type: Schema.ObjectId, ref: 'OrderCategory' },
    /** isdiagnosismandatory{Boolean} - whether diagnosis is mandatory before placing this order - default false */
    isdiagnosismandatory: Boolean,
    /** isdiagnosislinkingmandatory{Boolean} - whether diagnosis should mandatorily be linked to this order - default false*/
    isdiagnosislinkingmandatory: Boolean,
    /** iscareprovidermandatory{Boolean} - whether careprovider should be mandatorily linked to this order - default false*/
    iscareprovidermandatory: Boolean,
    /** showpopupduringentry{Boolean} - whether popup should be shown during order entry - default false*/
    showpopupduringentry: Boolean,
    /** allowcancelorder{Boolean} - whether the order can be cancelled - default true*/
    allowcancelorder: Boolean,
    /** allowdiscontinueorder{Boolean} - whether the order can be discontinued - default true*/
    allowdiscontinueorder: Boolean,
    /** allowmultiplequantity{Boolean} - whether the quantity can be change to multiple - default false*/
    allowmultiplequantity: Boolean,
    /** printorder {Number} - the order in which to print - - input control*/
    printorder: Number,
    /** indicate whether if this sub category is Pathology type will impact for display in EMR screen base on configuration in App setting*/
    ispathologycategory: Boolean,
    /** indicate whether if this sub category is Microbiology type will impact for display in EMR screen base on configuration in App setting*/
    ismicrobiologycategory: Boolean,
    /** While ordering, the system is checking for duplicate orders based on this flag. If this flag it set to False, there is no need to check for duplicates.*/
    alertforduplicate: Boolean

});

OrderCategorySchema.plugin(resuable);

module.exports = mongoose.model('OrderCategory', OrderCategorySchema);
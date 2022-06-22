// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var OrderItemSchema = new Schema({
    /** Code {string} has to be unique */
    code: { type: String, required: true, index: true },
    /** Name {string} defines the  name given for the orderitem*/
    name: { type: String, required: true, index: true },
    /** description {string} - comments or text with additional details */
    description: String,
    /** activefrom {Date} - start date for the orderitem */
    activefrom: Date,
    /** activeto {Date} - end date or expiry date for the orderitem. */
    activeto: Date,
    /** locallangdesc {String} - local language for the orderitem*/
    locallangdesc: String,
    /** ordercatuid {ObjectId} - reference to the order category*/
    ordercatuid: { type: Schema.ObjectId, ref: 'OrderCategory' },
    /** ordersubcatuid {ObjectId} - reference to the order sub category*/
    ordersubcatuid: { type: Schema.ObjectId, ref: 'OrderSubCategory' },
    /** ispermissionreqforresult {Boolean} - whether permission is required to view the result - default false */
    ispermissionreqforresult: Boolean,
    /** permissionforresult {Boolean} - name of the permission for viewing the result */
    permissionnameforresult: String,
    /** isobservationpanel {Boolean} - whether this order item is a vitals panel - default false */
    isobservationpanel: Boolean,
    /** istaskgenerationreqd {Boolean} - whether to generate task for this order item for the nurse - default false */
    istaskgenerationreqd: Boolean,
    /** isapprovalrequired {Boolean} - whether approval is required before processing this order item. - default false */
    isapprovalrequired: Boolean,
    /** iscosignrequired {Boolean} - whether co-signing by doctor is required for processing this order item - default false */
    iscosignrequired: Boolean,
    /** ishourlycharge {Boolean} - whether this is an hourly charges item like monitor, etc - default false */
    ishourlycharge: Boolean,
    /** isschedulable {Boolean} - whether the order can be used in scheduling appointments - default false */
    isschedulable: Boolean,
    /** isdoctorshareitem {Boolean} - whether should be included in the doctor share item report - default false */
    isdoctorshareitem: Boolean,
    /** minqty {Number} - mininum quantity for ordering - defaults to 1 */
    minqty: Number,
    /** maxqty {Number} - maximum quantity for ordering - defaults to 1 */
    maxqty: Number,
    /** defaultqty {Number} - default quantity for ordering - defaults to 1 */
    defaultqty: Number,
    /** duplicatealertduration {Number} - duration in which the duplicate alert is shown - defaults to 1 day*/
    duplicatealertduration: Number,
    /** defaultpriorityuid {ObjectId} - reference to the default value for priority - defaults to Normal or Routine*/
    defaultpriorityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** aliasnames {String} - alternative names for searching. defaults to empty - Chips control*/
    aliasnames: [{ type: String }],
    /** restrictencounter {ObjectId} - reference to the encounter type. defaults to empty - combo select control*/
    restrictencounter: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** frequenciesallowed {ObjectId} - reference to the frequency. defaults to empty - chips control*/
    restrictfrequencies: [{ type: Schema.ObjectId, ref: 'Frequency' }],
    /** restrictgender {ObjectId} - reference to the ReferenceValue (GENDER). defaults to empty - combo box control*/
    restrictgender: { type: Schema.ObjectId, ref: 'ReferenceValue' },

    /** restrictagegroup {ObjectId} - reference to the AgeMaster. defaults to empty - combo box control*/
    restrictagegroup: { type: Schema.ObjectId, ref: 'AgeMaster' },
    /** defaultfrequencyuid {ObjectId} - default frequency during order item for ordering */
    defaultfrequencyuid: { type: Schema.ObjectId, ref: 'Frequency' },
    /** resultitems {ObjectId} - links to order result items - Chips control*/
    resultitems: [{
        resultitemuid: { type: Schema.ObjectId, ref: 'OrderResultItem' },
        displayorder: Number,
        excludefromprint: Boolean
    }],
    /** linkedorderitems {ObjectId} - links to other order items which has to be prompted during ordering - Chips control*/
    linkedorderitems: [{ type: Schema.ObjectId, ref: 'OrderItem' }],
    /** orderiteminstructions {ObjectId} - order item instructions which has to be shown while ordering*/
    orderiteminstructions: [{
        instructiontypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        instructionuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        instructiontext: String
    }],
    /** checklists {ObjectId} - One or more checklist that need to be captured - Chips control*/
    checklists: [{ type: Schema.ObjectId, ref: 'FormTemplate' }],
    /** displayorder {Number} - display order to be used in the tabular chart */
    displayorder: Number,
    /** calculatedailytotal {Boolean} - only for observation panel. whether to callculate daily total for items */
    calculatedailytotal: Boolean,
    /** orderitemcodes - the order item code information from the external order item database */
    orderitemcodes: [{
        /** code type : reference domain code : ORDCODTYP */
        orderitemcodetypeuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
        code: String
    }],
    /** defaultmodalityuid {ObjectId} - reference value - Modality code : MODLTY */
    defaultmodalityuid: { type: Schema.ObjectId, ref: 'ReferenceValue' },
    /** colorcode {String} - colour code to be used */
    colorcode : String,
    /** allowpriceoverride {Boolean} - whether price override needs to be allowed or not - default false */
    allowpriceoverride: Boolean,
});

OrderItemSchema.plugin(resuable);

module.exports = mongoose.model('OrderItem', OrderItemSchema);
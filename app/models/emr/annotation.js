/**
 * Schema representing image Annotation in EMR details.
 * The Image annotation contains the image with annotation in binary format..
 * See {@tutorial form-tutorial} for an overview.
 *
 * @module ImageAnnotation
 */
// import the necessary modules
var mongoose = require('mongoose');
var resuable = require('../framework/reusableobjects');

var Schema = mongoose.Schema;
// create an export function to encapsulate the model creation

// define schema
var ImageAnnotationSchema = new Schema({
    /** patientuid {ObjectId} - reference to the patient schema */
    patientuid: { type: Schema.ObjectId, ref: 'Patient', required: true, index: true },
    /** patientvisituid {ObjectId} - reference to the patient visit schema */
    patientvisituid: { type: Schema.ObjectId, ref: 'PatientVisit', required: true, index: true },
    /** departmentuid {ObjectId} - the department from the patient visit */
    departmentuid: { type: Schema.ObjectId, ref: 'Department' },
    /** careprovideruid {ObjectId} - the reference to the Doctor */
    careprovideruid: { type: Schema.ObjectId, ref: 'User', required: true },
    /** annotatedimages {Object} - multiple image details stored in one annotation */
    annotatedimages: [{
        /** imagelibraryuid {ObjectId} - the reference to the ImageMaster */
        imagelibraryuid: { type: Schema.ObjectId, ref: 'ImageLibrary' },
        /** imagename {String} - image name to be copied from the image library */
        imagename: String,
        /** comments {String} - comments can be given by the careprovider */
        comments: String,
        /** annotatedimage - content of the image in base64 format */
        annotatedimage: String
    }]

});

ImageAnnotationSchema.plugin(resuable);

module.exports = mongoose.model('ImageAnnotation', ImageAnnotationSchema);
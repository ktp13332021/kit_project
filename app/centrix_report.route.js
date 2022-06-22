var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var md5 = require('md5');
var dbpath = require('../config/db').dbpath;
var Patient = require('./models/patient/patient.js');
var OrderItem = require('./models/ordermanagement/orderitem.js');
var Observation = require('./models/emr/observation.js');
var orderresultitem = require('./models/ordermanagement/orderresultitem.js');
var ReferenceValue = require('./models/framework/referencevalue.js');
var ReferenceDomain = require('./models/framework/referencedomain.js');
var _ = require('underscore');

exports.getvisitbyptuid = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    statusflag: 'A',
                    orguid: mongoose.Types.ObjectId(req.body.orguid),
                    patientuid: mongoose.Types.ObjectId(req.body.patientuid)
                }
            },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patientvisits: docs
            });
            db.close();
        });
    });
}
exports.get_diag = function (req, res) {
    var mongoose = require('mongoose')
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    statusflag: 'A',
                    orguid: mongoose.Types.ObjectId(req.body.orguid),
                    _id: mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "diagnosis"
                }
            },
            {
                $unwind: {
                    path: '$diagnosis',
                    preserveNullAndEmptyArrays: true
                }
            },
            
            {
                "$match": {
                    "diagnosis.diagnosis": {
                        $gt: []
                    }
                }
            },
            
            {
                $unwind: {
                    path: '$diagnosis.diagnosis',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnosis.diagnosis.problemuid",
                    "as": "diagnosis.diagnosis.problemuid"
                }
            },
            {
                $unwind: {
                    path: '$diagnosis.diagnosis.problemuid',
                    preserveNullAndEmptyArrays: true
                }
            },
            
            {
                "$project": {
                    "_id": 0,
                    "code": "$diagnosis.diagnosis.problemuid.code",
                    "name": "$diagnosis.diagnosis.problemuid.name",
                    "description": "$diagnosis.diagnosis.problemuid.description",
                    "diagnosistext": "$diagnosis.diagnosistext",
                    "isprimary": "$diagnosis.diagnosis.isprimary",
            
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_allergy = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("allergies").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "patientuid": mongoose.Types.ObjectId(req.body.patientuid)
                }
            },
            { $unwind: { path: "$drugallergies", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "referencevalues", localField: "drugallergies.typeuid", foreignField: "_id", as: "drugtype" } },
            { $unwind: { path: "$drugtype", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "typecode": "$drugtype.valuecode",
                    "allergenname": "$drugallergies.allergenname",
                    "druggroupname": "$drugallergies.druggroupname",
                    "tradename": "$drugallergies.tradename",
                    "freetext": "$drugallergies.freetext",
                    "symptoms": "$drugallergies.symptoms",
                    "comments": "$drugallergies.comments",
                  "noknowndrugallergies": "$noknowndrugallergies"
                }
            },
			{ $limit : 6 }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_cchpi = function (req, res) {

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("cchpis").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            { $limit: 2 },
            {
                $project: {
                    "cchpis": { $arrayElemAt: ["$cchpis", 0] },
           			 "presentillness": 1
                }
            }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_pasthx = function (req, res) {

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("medicalhistories").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "isreusedfromothermodules": false,
                    "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            { $limit: 1 },
            { $unwind: { path: "$pasthistories", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "problems", localField: "pasthistories.problemuid", foreignField: "_id", as: "pasthistoriesproblem" } },
            { $unwind: { path: "$pasthistoriesproblem", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "_id": 1,
                    "pasthistories": {
                        "problem": "$pasthistoriesproblem.name",
                        "durationinyear": 1,
                        "durationinmonth": 1,
                        "comments": 1
                    },
                    "pasthistorytext": 1
                }
            },
            {
                $group: {
                    "_id": { "_id": "$_id" },
                    "pasthistories": { "$push": "$pasthistories" },
                    "pasthistorytext": { "$first": "$pasthistorytext" }
                }
            }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_diag = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("diagnoses").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            { $unwind: { path: "$diagnosis", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "problems", localField: "diagnosis.problemuid", foreignField: "_id", as: "problems" } },
            { $unwind: { path: "$problems", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "_id": 1,
                    "diagnosistext": 1,
                    "diagnosis": {
                        "problemname": "$problems.name",
                        "isprimary": "$diagnosis.isprimary"
                    }
                }
            },
            {
                $group: {
                    "_id": { "_id": "$_id" },
                    "diagnosistext": { "$first": "$diagnosistext" },
                    "diagnosis": { "$push": "$diagnosis" }
                }
            },
            { $limit: 1},
            { $unwind: { path: "$diagnosis", preserveNullAndEmptyArrays: true } },
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_exam = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("examinations").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "isreusedfromothermodules": false,
                    "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            { $limit: 1 },
            {
                $project: {
                    "examinationtext": 1
                }
            }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_ix = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            { $match: { "$or":[ {"ordercattype": "LAB"}, {"ordercattype": "RADIOLOGY"}] } },
            { $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true } },
            // { $limit: 6 },
            {
                $project: {
                    "itemname": "$patientorderitems.orderitemname"
                }
            }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_med = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "ordercattype": "MEDICINE",
                    "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid)
                }
            },
            { $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "referencevalues", localField: "patientorderitems.quantityUOM", foreignField: "_id", as: "quantityuom" } },
            { $unwind: { path: "$quantityuom", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "referencevalues", localField: "patientorderitems.statusuid", foreignField: "_id", as: "status" } },
            { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
            // { $limit: 6 },
            {
                $project: {
                    "itemname": "$patientorderitems.orderitemname",
                    "quantity": "$patientorderitems.quantity",
                    "quantityuom": "$quantityuom.valuedescription",
                    "status": "$status.valuedescription"
                }
        
            },
        
            { $match: { "status": "Dispensed" } },
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment = function (req, res) {
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                }
            },
            { $unwind: { path: "$slots" } },
			{ 
                $match: { 
                    "slots.patientuid":  mongoose.Types.ObjectId(req.body.patientuid),
                    "slots.isactive":true,
                    "slots.start": { "$gte": new Date(todate)  } 
                } 
            },
            { $lookup: { from: "departments", localField: "departmentuid", foreignField: "_id", as: "department" } },
            { $unwind: { path: "$department", preserveNullAndEmptyArrays: true  } },
            { $lookup: { from: "users", localField: "careprovideruid", foreignField: "_id", as: "careprovider" } },
            { $unwind: { path: "$careprovider" , preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "department.name": 1,
                    "careprovider.name": 1,
                    "slots.start": 1
                }
            },
            // { $limit: 4 }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_futureorder = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "patientuid": mongoose.Types.ObjectId(req.body.patientuid)
                }
            },
            { $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "orderitems", localField: "patientorderitems.orderitemuid", foreignField: "_id", as: "orderitem" } },
            { $unwind: { path: "$orderitem", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "_id": 1,
                    "patientuid": 1,
                    "patientorderitems": {
                        "orderitemname": "$orderitem.name"
                    }
                }
            },
            {
                $group: {
                    "_id": { "_id": "$_id" },
                    "patientorderitems": { "$push": "$patientorderitems" }
                }
            }
        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
// ---------------------------------------------

exports.emr_subnode_allergy = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var HN = req.body.HN;
    // var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "_id":ObjectId("5a200aa99318c8bc1eb3e389")
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "mrn": HN
                    // "startdate": { $gte: ISODate("2018-09-09T00:00:00.000Z"), $lte: ISODate("2018-09-09T23:59:59.000Z") }
                    // "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                }
            },

            {
                "$lookup": {
                    "from": "allergies",
                    "localField": "_id",
                    "foreignField": "patientuid",
                    "as": "allergies"
                }
            },
            {
                "$lookup": {
                    "from": "medicalhistories",
                    "localField": "_id",
                    "foreignField": "patientuid",
                    "as": "medicalhistories"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patient: docs
            });
            db.close();
        });
    });
}
exports.emr_eye = function (req, res) {
    var patientuid = req.body.patientuid;
    // var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)

                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5c77565693186b0d84239e17"),

                    // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5a200ac89318c8bc1eb458c6")
                    // "startdate": { $gte: ISODate("2018-09-09T00:00:00.000Z"), $lte: ISODate("2018-09-09T23:59:59.000Z") }
                    // "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnoses.diagnosis.problemuid",
                    "as": "diagnoses.diagnosis.problemuid"
                }
            },

            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            // {
            //     $unwind: {
            //         path: '$patientprocedures',
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                $lookup: {
                    "from": "examinations",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "examinations"
                }
            },

            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "imageannotations",
                    "localField": "examinations.annotationuid",
                    "foreignField": "_id",
                    "as": "imageannotations"
                }
            },
            {
                "$lookup": {
                    "from": "examinations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "examinations"
                }
            },
            {
                "$lookup": {
                    "from": "vitalsingdatas",
                    "localField": "visitid",
                    "foreignField": "visitid",
                    "as": "vitalsingdatas"
                }
            },
            {
                "$lookup": {
                    "from": "medicalhistories",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "medicalhistories"
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "visitcareproviders.visittypeuid",
                    "foreignField": "_id",
                    "as": "visitcareproviders.visittypeuid"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_getmed_today = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                }
            },
            {
                $unwind: {
                    path: "$patientorderitems",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "patientorderitems.ordercattype": {
                        "$in": ["MEDICINE"]
                    }
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.statusuid",
                    foreignField: "_id",
                    as: "patientorderitems.statusuid"
                }
            },
            {
                $unwind: "$patientorderitems.statusuid"
            },
            {
                $match: {
                    'patientorderitems.statusuid.valuedescription': {
                        $nin: ["Cancelled"]
                    }
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.quantityUOM",
                    foreignField: "_id",
                    as: "patientorderitems.quantityUOM"
                }
            },
            {
                $unwind: "$patientorderitems.quantityUOM"
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.dosageUOM",
                    foreignField: "_id",
                    as: "patientorderitems.dosageUOM"
                }
            },
            {
                $unwind: "$patientorderitems.dosageUOM"
            },
            {
                $lookup: {
                    from: "frequencies",
                    localField: "patientorderitems.frequencyuid",
                    foreignField: "_id",
                    as: "patientorderitems.frequencyuid"
                }
            },
            {
                $unwind: "$patientorderitems.frequencyuid"
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.routeuid",
                    foreignField: "_id",
                    as: "routeuid"
                }
            },
            {
                $unwind: "$routeuid"
            },
            {
                $project: {

                    // ordernumber: "$ordernumber",
                    orderitemname: "$patientorderitems.orderitemname",
                    quantity: "$patientorderitems.quantity",
                    quantityperdose: "$patientorderitems.quantityperdose",
                    dosageUOM: "$patientorderitems.dosageUOM.valuedescription",
                    frequencyuid: "$patientorderitems.frequencyuid.locallangdesc",
                    careprovideruid: "$patientorderitems.careprovideruid",
                    routeuid: "$routeuid.valuecode",
                    startdate: "$patientorderitems.startdate",
                    // patientorderitems: 1,
                    // routeuid:1,
                }
            },
            {
                "$group": {
                    "_id": {
                        orderitemname: "$orderitemname"
                    },
                    "routeuid": {
                        "$first": "$routeuid"
                    },
                    "quantityperdose": {
                        "$first": "$quantityperdose"
                    },
                    "dosageUOM": {
                        "$first": "$dosageUOM"
                    },
                    "frequencyuid": {
                        "$first": "$frequencyuid"
                    },
                    "careprovideruid": {
                        "$first": "$careprovideruid"
                    },
                    "startdate": {
                        "$first": "$startdate"
                    },
                    "quantity": {
                        "$sum": "$quantity"
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "careprovideruid",
                    foreignField: "_id",
                    as: "careprovider"
                }
            },
            {
                $unwind: {
                    path: "$careprovider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$sort": {
                    "routeuid": -1,
                    "_id.orderitemname": 1
                }
            },
        ]).toArray((err, docs) => {
            console.log(1142,docs);
            res.status(200).json({
                patientorder: docs
            });
            db.close();
        });
    });
}
exports.find_getother_today = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                }
            },
            {
                $unwind: {
                    path: "$patientorderitems",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "patientorderitems.ordercattype": {
                        "$nin": ["MEDICINE"]
                    }
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.statusuid",
                    foreignField: "_id",
                    as: "patientorderitems.statusuid"
                }
            },
            {
                $unwind: "$patientorderitems.statusuid"
            },
            {
                $match: {
                    'patientorderitems.statusuid.valuedescription': {
                        $nin: ["Cancelled"]
                    }
                }
            },
            
            {
                $project: {
            
                    ordernumber: "$ordernumber",
                    orderitemname: "$patientorderitems.orderitemname",
                    statusuid: "$patientorderitems.statusuid.valuedescription",
                    quantity: "$patientorderitems.quantity",
                }
            },
            
        ]).toArray((err, docs) => {
            console.log(1142,docs);
            res.status(200).json({
                patientorder: docs
            });
            db.close();
        });
    });
}
exports.findxray_byPTVUID = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    // "patientvisituid": ObjectId("60fa61557c0cbc0014188dc3"),
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    "patientorderitems": {
                        $elemMatch: {
                            ordercattype: {
                                "$in": ["RADIOLOGY"]
                            }
                        }
                    },
                    "statusflag": "A",
                }
            },
            {
                $unwind: {
                    path: "$patientorderitems",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.statusuid",
                    foreignField: "_id",
                    as: "patientorderitems.statusuid"
                }
            },
            {
                $unwind: "$patientorderitems.statusuid"
            },
            {
                $match: {
                    "patientorderitems.statusuid.valuedescription": {
                        $nin: ["Cancelled"]
                    },
                }
            },
            {
                $project: {
                    "_id": 0,
                    "orderdate": 1,
                    "patientorderitemuid": "$patientorderitems._id",
                    "orderitemname": "$patientorderitems.orderitemname",
                    "status": "$patientorderitems.statusuid.valuedescription",

                }
            },
            {
                $lookup: {
                    from: "radiologyresults",
                    localField: "patientorderitemuid",
                    foreignField: "result",
                    as: "result",
                },
            },
            {
                $unwind: {
                    path: "$result",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs,
            });
            db.close();
        });
    });
}
exports.findxray_byPTVUID1 = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    // var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo
            .collection("patientvisits")
            .aggregate([{
                    $match: {
                        _id: mongoose.Types.ObjectId(patientvisituid),
                        "statusflag": "A",
                        // orguid: mongoose.Types.ObjectId(orguid),
                    },
                },
                {
                    $lookup: {
                        from: "patientorders",
                        localField: "_id",
                        foreignField: "patientvisituid",
                        as: "patientorders",
                    },
                },
                {
                    $unwind: {
                        path: "$patientorders",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$patientorders.patientorderitems",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        "patientorders.patientorderitems.ordercattype": {
                            $in: ["RADIOLOGY"],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "radiologyresults",
                        localField: "patientorders.patientorderitems._id",
                        foreignField: "patientorderitemuid",
                        as: "radiologyresults",
                    },
                },
                {
                    $unwind: {
                        path: "$radiologyresults",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        "radiologyresults.statusflag": "A",
                    },
                },
                // {
                //     $project: {
                //         patientvisituid: '$_id',
                //         EN: '$visitid',
                //         ordernumber: "$patientorders.ordernumber",
                //         ordercattype: "$patientorders.patientorderitems.ordercattype",
                //         orderitemname: "$patientorders.patientorderitems.orderitemname",
                //         orderitemuid: "$patientorders.patientorderitems.orderitemuid"
                //     }
                // }
            ])
            .toArray((err, docs) => {
                console.log(docs);
                res.status(200).json({
                    data: docs,
                });
                db.close();
            });
    });
}
exports.findlab_byvisitID = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    // var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("labresults").aggregate([{
                $match: {
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    "statusflag": "A",
                    // "orguid": mongoose.Types.ObjectId(orguid),
                }
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderitemuid",
                    foreignField: "_id",
                    as: "orderitemuid"
                }
            },
            {
                $unwind: {
                    path: "$orderitemuid",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
// exports.get_ICD10_allvisit = function (req, res) {
//     var patientvisituid = req.body.patientvisituid;
//     var orguid = req.body.orguid;
//     MongoClient.connect(dbpath, (connectErr, db) => {
//         var dbo = db;
//         dbo.collection("diagnoses").aggregate([{
//             $match: {
//                 "orguid": mongoose.Types.ObjectId(orguid),
//                 "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
//                 // "orguid": ObjectId("5faa3d95f71034497f38a208"),
//                 // "patientvisituid": ObjectId("60f947d47c0cbc0014184a6c"),
//             }
//         },
//         { $unwind: { path: '$diagnosis', preserveNullAndEmptyArrays: true } },
//         { $lookup: { "from": "users", "foreignField": "_id", "localField": "diagnosis.careprovideruid", "as": "careprovideruid" } },
//         { $unwind: '$careprovideruid' },
//         { $lookup: { "from": "problems", "foreignField": "_id", "localField": "diagnosis.problemuid", "as": "problemuid" } },
//         { $unwind: { path: "$problemuid", preserveNullAndEmptyArrays: true } },
//         { $lookup: { "from": "departments", "foreignField": "_id", "localField": "departmentuid", "as": "department" } },
//         { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
//         {
//             $project: {
//                 "date": "$diagnosis.onsetdate",
//                 "ICD10code": "$problemuid.code",
//                 "ICD10name": "$problemuid.name",
//                 "ICD10desc": "$problemuid.description",
//                 "department": "$department.name",
//                 "primary": "$diagnosis.isprimary",
//                 "careprovider": "$careprovideruid.name",
//             }
//         },
//         ]).toArray((err, docs) => {
//             console.log(docs);
//             res.status(200).json({
//                 data: docs
//             });
//             db.close();
//         });
//     });
// }
exports.emr_eye_bymd = function (req, res) {
    var mdname = req.body.mdname;
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5c77565693186b0d84239e17"),
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },
            {
                "$unwind": {
                    path: "$careprovider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnoses.diagnosis.problemuid",
                    "as": "problemuid"
                }
            },
            // { $unwind: { path: '$problemuid', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            {
                $lookup: {
                    "from": "examinations",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "examinations"
                }
            },

            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "imageannotations",
                    "localField": "examinations.annotationuid",
                    "foreignField": "_id",
                    "as": "imageannotations"
                }
            },
            {
                "$lookup": {
                    "from": "examinations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "examinations"
                }
            },
            {
                "$lookup": {
                    "from": "vitalsingdatas",
                    "localField": "visitid",
                    "foreignField": "visitid",
                    "as": "vitalsingdatas"
                }
            },
            {
                $match: {
                    "careprovider.name": mdname,
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.emr_eye_bydepartment = function (req, res) {
    var department = req.body.department;
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5c77565693186b0d84239e17"),
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },

            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$unwind": {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnoses.diagnosis.problemuid",
                    "as": "problemuid"
                }
            },
            // { $unwind: { path: '$problemuid', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            {
                $lookup: {
                    "from": "examinations",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "examinations"
                }
            },

            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "imageannotations",
                    "localField": "examinations.annotationuid",
                    "foreignField": "_id",
                    "as": "imageannotations"
                }
            },
            {
                "$lookup": {
                    "from": "examinations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "examinations"
                }
            },
            {
                "$lookup": {
                    "from": "vitalsingdatas",
                    "localField": "visitid",
                    "foreignField": "visitid",
                    "as": "vitalsingdatas"
                }
            },
            {
                $match: {
                    "department.name": department,
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_user_all = function (req, res) {
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([{
                $match: {
                    "activeto": null,
                    'iscareprovider': true,
                    "statusflag": "A",
                    // "orguid": mongoose.Types.ObjectId(orguid),
                }
            },

            {
                $lookup: {
                    from: "referencevalues",
                    localField: "titleuid",
                    foreignField: "_id",
                    as: "titleuid"
                }
            },
            {
                $unwind: {
                    path: "$titleuid",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}
exports.find_icduse = function (req, res) {
    var orguid = req.body.orguid;
    var careprovideruid = req.body.careprovideruid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("diagnoses").aggregate([

            {
                $match: {
                    "careprovideruid": mongoose.Types.ObjectId(careprovideruid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                    // "createdat": { $gte: ISODate("2020-01-01T00:00:00.000Z"), $lte: ISODate("2021-11-01T23:59:59.000Z") }
                    // "createdat": { $gte: new Date(fromdate), $lte: new Date(todate) }
                    // "orguid": mongoose.Types.ObjectId(orguid),
                }
            },

            {
                "$lookup": {
                    "from": "departments",
                    "localField": "departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnosis.problemuid",
                    "as": "problemuid"
                }
            },
            {
                $unwind: "$problemuid"
            },
            {
                $project: {

                    code: "$problemuid.code",
                    name: "$problemuid.name",
                }
            },
            {
                $group: {
                    _id: {
                        code: '$code'
                    },
                    "count": {
                        $sum: 1
                    },
                    "code": {
                        $first: "$code"
                    },
                    "name": {
                        $first: "$name"
                    },
                }
            },
            {
                $sort: {
                    "count": -1
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.findlabcumu_bypatientuid = function (req, res) {
    var mongoose = require('mongoose')
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    var labcode = req.body.labcode;
    labcode = labcode.replace(/'/g, '"');
    labcode = JSON.parse(labcode);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("labresults").aggregate([{
                $match: {
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid),
                    "statusflag": "A",
                    //  "patientuid": ObjectId("5a2009b99318c8bc1eb0741b"),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537")
                }
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderitemuid",
                    foreignField: "_id",
                    as: "orderitemuid"
                }
            },
            {
                $unwind: {
                    path: "$orderitemuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "orderitemuid.code": {
                        $in: labcode
                    }
                }
            },
            {
                $unwind: {
                    path: "$resultvalues",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    resultname: "$resultvalues.name",
                    resultvalues: "$resultvalues.resultvalue",
                    normalrange: "$resultvalues.normalrange",
                    resultdate: "$resultdate",
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.opd_bymd = function (req, res) {
    var mdcode = req.body.userid;
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {


                    // "createdat": { $gte: ISODate("2020-01-01T00:00:00.000Z"), $lte: ISODate("2021-11-01T23:59:59.000Z") }
                    "createdat": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "patientuid",
                    as: "patientuid"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },
            {
                "$unwind": {
                    path: "$careprovider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            {
                $match: {

                    "careprovider._id": mongoose.Types.ObjectId(mdcode),


                }
            },
            {
                $lookup: {
                    from: "patientorders",
                    localField: "_id",
                    foreignField: "patientvisituid",
                    as: "patientorders"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.emr_findvisit_by_date = function (req, res) {
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    // var selectdate = req.body.selectdate || moment().utc().toISOString();
    var fromdate = moment(req.body.selectdate).utc().startOf('day').toISOString();
    var todate = moment(req.body.selectdate).utc().endOf('day').toISOString();
    console.log(req.body.selectdate);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            $match: {
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
                "patientuid": mongoose.Types.ObjectId(patientuid),
                // "startdate": { $lte: new Date(selectdate) },
                // "enddate": { $gte: new Date(selectdate) },
                // "startdate": { $gte: ISODate("2020-01-01T00:00:00.000Z"), $lte: ISODate("2021-11-01T23:59:59.000Z") }
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                },
            }
        }, ]).toArray((err, docs) => {
            console.log(docs);



            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_clinicalnote = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("clinicalnotes").aggregate([{
                $match: {
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                }
            },
            {
                $lookup: {
                    from: "patientforms",
                    localField: "formuid",
                    foreignField: "_id",
                    as: "patientforms"
                }
            },
            {
                $unwind: {
                    path: "$patientforms",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "formtemplates",
                    localField: "patientforms.templateuid",
                    foreignField: "_id",
                    as: "templateuid"
                }
            },
            {
                $unwind: {
                    path: "$templateuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdby",
                    foreignField: "_id",
                    as: "createdby"
                }
            },
            {
                $unwind: {
                    path: "$createdby",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "careprovideruid",
                    foreignField: "_id",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "departmentuid",
                    foreignField: "_id",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "department": "$departmentuid.name",
                    "careprovider": "$careprovideruid.name",
                    "user": "$createdby.name",
                    "screentype": 1,
                    "name": 1,
                    "patientforms": 1,
                    "createdat": 1,
                    "templateuid": 1,
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patientorder: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_dr = function (req, res) {
    var {
        fromdate,
        todate,
        orguid,
        careprovideruid
    } = req.body;
    console.log(todate);
    if (todate == undefined) {
        var fromdate = moment(fromdate).startOf('day').toISOString();
        if (careprovideruid == '') {
            var matchcondition = {
                // "appointmentdate": { $gte: ISODate("2021-08-01T00:00:00.000Z") },
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                // "careprovideruid": ObjectId("60335543d7856600017452da"),
                //    "careprovideruid": mongoose.Types.ObjectId(careprovideruid),
                "orguid": mongoose.Types.ObjectId(orguid),
                "iscancelled": false,
                "statusflag": "A",
                "slots": {
                    $ne: []
                },
                "appointmentdate": {
                    $gte: new Date(fromdate)
                }
            }
        } else {
            var matchcondition = {
                // "appointmentdate": { $gte: ISODate("2021-08-01T00:00:00.000Z") },
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                // "careprovideruid": ObjectId("60335543d7856600017452da"),
                "careprovideruid": mongoose.Types.ObjectId(careprovideruid),
                "orguid": mongoose.Types.ObjectId(orguid),
                "iscancelled": false,
                "statusflag": "A",
                "slots": {
                    $ne: []
                },
                "appointmentdate": {
                    $gte: new Date(fromdate)
                }
            }
        }

    } else {
        var fromdate = moment(fromdate).startOf('day').toISOString();
        var todate = moment(todate).endOf('day').toISOString();
        if (careprovideruid == '') {
            var matchcondition = {
                "orguid": mongoose.Types.ObjectId(orguid),
                "iscancelled": false,
                "statusflag": "A",
                "slots": {
                    $ne: []
                },
                "appointmentdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        } else {
            var matchcondition = {
                "careprovideruid": mongoose.Types.ObjectId(careprovideruid),
                "orguid": mongoose.Types.ObjectId(orguid),
                "iscancelled": false,
                "statusflag": "A",
                "slots": {
                    $ne: []
                },
                "appointmentdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        }

    };

    console.log(matchcondition);

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([{
                $match: matchcondition
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "careprovideruid",
                    foreignField: "_id",
                    as: "careprovider"
                }
            },
            {
                $unwind: {
                    path: "$careprovider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "departmentuid",
                    foreignField: "_id",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "appointmentdate": 1,
                    "careprovider": "$careprovider.name",
                    // "careprovideruid": "$careprovideruid",
                    "slots": 1,
                    "patientuid": "$slots.patientuid",
                    "orderdetails": "$slots.orderdetails",
                    "appointmentnumber": "$slots.appointmentnumber",
                    "title": "$slots.comments",
                    "department": "$departmentuid.name",
                    "isactive": "$slots.isactive",
                }
            },
            {
                "$match": {
                    "isactive": true,
                }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patientuid",
                    foreignField: "_id",
                    as: "patient"
                }
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'referencevalues',
                    localField: 'patient.titleuid',
                    foreignField: '_id',
                    as: 'patienttitle'
                }
            },
            {
                $unwind: {
                    path: '$patienttitle',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patientadditionaldetails",
                    localField: "_id",
                    foreignField: "patientuid",
                    as: "phone"
                }
            },
            {
                $unwind: {
                    path: "$phone",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    name: {
                        $concat: [{
                                $ifNull: ['$patienttitle.valuedescription', '']
                            },
                            {
                                $ifNull: ['$patient.firstname', '']
                            }, ' ',
                            {
                                $ifNull: ['$patient.lastname', '']
                            }
                        ]
                    },
                    hn: "$patient.mrn",
                    phone: "$patient.contact.mobilephone",
                    mobilephone: "$phone.addlncontacts.mobilephone",
                    careprovider: "$careprovider",
                    orderdetails: "$orderdetails",
                    appointmentnumber: "$appointmentnumber",
                    title: "$title",
                    appointmentdate: "$appointmentdate",
                    department: "$department",
                    start: "$slots.start",
                    //  slots: 1,

                }
            },
            {
                "$sort": {
                    "start": -1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_orschedule = function (req, res) {
    var mongoose = require('mongoose')
    var {
        fromdate,
        todate,
        orguid,
        careprovideruid
    } = req.body;
    console.log(todate);
    if (careprovideruid == '') {
        var matchcondition = {

        }
    } else {
        var matchcondition = {
            "careprovideruid": mongoose.Types.ObjectId(careprovideruid),
        }
    }
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("orschedules").aggregate([{
                $match: {
                    "statusflag": "A",
                    //   "iscancelled" : true,
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "scheduledate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },
                    // "scheduledate": { $gte: ISODate("2021-08-01T00:00:00.000+07:00"), $lte: ISODate("2021-08-31T23:59:59.000+07:00") },
                    // "orguid": ObjectId("569794170946a3d0d588efe6"),
                    "slots": {
                        $ne: []
                    }
                }
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "slots.statusuid",
                    foreignField: "_id",
                    as: "statusuid"
                }
            },
            {
                $unwind: {
                    path: "$statusuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "orsessions",
                    localField: "orsessionuid",
                    foreignField: "_id",
                    as: "orsessions"
                }
            },
            {
                $unwind: {
                    path: "$orsessions",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$match": {
                    "statusuid.valuedescription": {
                        $nin: ['Cancelled', 'Rescheduled']
                    }
                }
            },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'slots.patientuid',
                    foreignField: '_id',
                    as: 'patient'
                }
            },
            {
                $unwind: {
                    path: '$patient',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "slots.surgeons.careprovideruid",
                    foreignField: "_id",
                    as: "careprovider"
                }
            },
            {
                $unwind: {
                    path: "$careprovider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    appointmentdate: "$slots.start",
                    operating_room: {
                        $ifNull: ['$orsessions.name', '']
                    },
                    statusuid: {
                        $ifNull: ['$statusuid.valuedescription', '']
                    },
                    name: {
                        $concat: [{
                                $ifNull: ['$patienttitle.valuedescription', '']
                            },
                            {
                                $ifNull: ['$patient.firstname', '']
                            }, ' ',
                            {
                                $ifNull: ['$patient.lastname', '']
                            }
                        ]
                    },
                    hn: "$patient.mrn",
                    operation: "$slots.comments",
                    careprovider: "$careprovider.name",
                    careprovideruid: "$careprovider._id",
                }
            },
            {
                $match: matchcondition
            },
            // {
            //     "$match": {
            //         // "careprovideruid": ObjectId("60487dcd65f50e00013985cd"),
            //         "careprovideruid": mongoose.Types.ObjectId(careprovideruid),
            //     }
            // },
            {
                "$sort": {
                    "appointmentdate": -1.0
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.getCareprovider = function (req, res) {
    var {
        searchText,
        orguid
    } = req.body;

    // if (!searchText) return res.status(200).json([]);

    mongoose.connection.collection('users').find({
        statusflag: 'A',
        orguid: ObjectId(orguid),
        "iscareprovider": true,
        $or: [{
                activeto: null
            },
            {
                activeto: {
                    $gte: new Date()
                }
            }
        ],
        name: {
            '$regex': new RegExp(searchText.toLowerCase(), 'i')
        }
    }, {
        projection: {
            name: 1
        }
    }).sort({
        name: 1
    }).toArray((err, docs) => {
        if (err) return res.status(500).json({
            error: 'Query Error!',
            technicalError: err
        });
        res.status(200).json({
            data: docs
        });
    });
}
exports.getnotCareprovider = function (req, res) {
    var {
        useruid,
        orguid
    } = req.body;

    // if (!searchText) return res.status(200).json([]);

    mongoose.connection.collection('users').find({
        statusflag: 'A',
        iscareprovider: true,
        orguid: ObjectId(orguid),
        _id: ObjectId(useruid),
        $or: [{
                activeto: null
            },
            {
                activeto: {
                    $gte: new Date()
                }
            }
        ],

    }, {
        projection: {
            name: 1
        }
    }).sort({
        name: 1
    }).toArray((err, docs) => {
        if (err) return res.status(500).json({
            error: 'Query Error!',
            technicalError: err
        });
        res.status(200).json({
            data: docs
        });
    });
}
exports.find_annotation = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("imageannotations").aggregate([{
                $match: {
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    // "patientvisituid": ObjectId("60878e189d735a0012984948"),
                    // "orguid": ObjectId("569794170946a3d0d588efe6"),
                    "statusflag": "A",
                }
            },
            {
                "$unwind": {
                    path: "$annotatedimages",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "annotatedimages": "$annotatedimages._id",
                    "imagename": "$annotatedimages.imagename",
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.getexistingHN = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var centrixHN = req.body.centrixHN;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    "mrn": centrixHN,
                    "orguid": mongoose.Types.ObjectId(orguid),
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "patientexisthn": 1,
                }
            },
        ]).toArray((err, docs) => {
            console.log('docs',docs);
            console.log('dbpath',dbpath);
            console.log('centrixHN',centrixHN);
            console.log('orguid',orguid);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
//---------------------------

exports.find_getmed_byPTVUID = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var mPTVUID = req.body.PTVUID;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "entypeuid": mongoose.Types.ObjectId("59f2dd8ac4a1788835afd8c7"),
                    "statusflag": "A",
                    "orderdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },
                    "patientvisituid": mongoose.Types.ObjectId(mPTVUID)
                }
            },
            {
                $unwind: {
                    path: "$patientorderitems",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "patientorderitems.ordercattype": {
                        "$in": ["MEDICINE"]
                    }
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.statusuid",
                    foreignField: "_id",
                    as: "patientorderitems.statusuid"
                }
            },
            {
                $unwind: "$patientorderitems.statusuid"
            },
            // {
            //     $lookup: { from: "patientvisits", localField: "patientvisituid", foreignField: "_id", as: "patientvisituid" }
            // },
            // {
            //     $unwind: "$patientvisituid"
            // },
            // {
            //     $match: {
            //         "patientvisituid.entypeuid": mongoose.Types.ObjectId("59f2dd8ac4a1788835afd8c7")
            //     }
            // },
            {
                $project: {
                    patientvisituid: "$patientvisituid",
                    entypeuid: "$entypeuid",
                    ordernumber: "$ordernumber",
                    ordercattype: "$patientorderitems.ordercattype",
                    orderitemname: "$patientorderitems.orderitemname",
                    status: "$patientorderitems.statusuid.valuedescription"
                }
            },
            {
                $match: {
                    status: {
                        $nin: ["Dispensed", "Cancelled"]
                    }
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patientorder: docs
            });
            db.close();
        });
    });
}
exports.findxray_byEN = function (req, res) {
    var mongoose = require('mongoose')
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var EN = req.body.EN;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo
            .collection("patientvisits")
            .aggregate([{
                    $match: {
                        visitid: EN,
                        "statusflag": "A",
                    },
                },
                {
                    $lookup: {
                        from: "patientorders",
                        localField: "_id",
                        foreignField: "patientvisituid",
                        as: "patientorders",
                    },
                },
                {
                    $unwind: {
                        path: "$patientorders",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $unwind: {
                        path: "$patientorders.patientorderitems",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        "patientorders.patientorderitems.ordercattype": {
                            $in: ["RADIOLOGY"],
                        },
                    },
                },
                {
                    $lookup: {
                        from: "radiologyresults",
                        localField: "patientorders.patientorderitems._id",
                        foreignField: "patientorderitemuid",
                        as: "radiologyresults",
                    },
                },
                {
                    $unwind: {
                        path: "$radiologyresults",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $match: {
                        "radiologyresults.statusflag": "A",
                    },
                },
                // {
                //     $project: {
                //         patientvisituid: '$_id',
                //         EN: '$visitid',
                //         ordernumber: "$patientorders.ordernumber",
                //         ordercattype: "$patientorders.patientorderitems.ordercattype",
                //         orderitemname: "$patientorders.patientorderitems.orderitemname",
                //         orderitemuid: "$patientorders.patientorderitems.orderitemuid"
                //     }
                // }
            ])
            .toArray((err, docs) => {
                console.log(docs);
                res.status(200).json({
                    data: docs,
                });
                db.close();
            });
    });
}

exports.singleID_ptvuid = function (req, res) {
    var mongoose = require('mongoose')
    var patientuid = req.body.patientuid;
    var visitid = req.body.visitid
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnoses.diagnosis.problemuid",
                    "as": "problemuid"
                }
            },
            // { $unwind: { path: '$problemuid', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            {
                $lookup: {
                    "from": "examinations",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "examinations"
                }
            },

            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "imageannotations",
                    "localField": "examinations.annotationuid",
                    "foreignField": "_id",
                    "as": "imageannotations"
                }
            },
            {
                "$lookup": {
                    "from": "examinations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "examinations"
                }
            },
            {
                $match: {
                    "visitid": visitid
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.singleID_allergy = function (req, res) {
    var mongoose = require('mongoose')
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "mrn": HN
                }
            },

            {
                "$lookup": {
                    "from": "allergies",
                    "localField": "_id",
                    "foreignField": "patientuid",
                    "as": "allergies"
                }
            },
            {
                "$lookup": {
                    "from": "medicalhistories",
                    "localField": "_id",
                    "foreignField": "patientuid",
                    "as": "medicalhistories"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                allergy: docs
            });
            db.close();
        });
    });
}
exports.find_user = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    // "orderdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "activeto": null,
                    "loginid": req.body.loginid,
                    "statusflag": "A",
                }
            },

            {
                $lookup: {
                    from: "referencevalues",
                    localField: "titleuid",
                    foreignField: "_id",
                    as: "titleuid"
                }
            },
            {
                $unwind: {
                    path: "$titleuid",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}
exports.login = function (req, res) {
    var password = md5(req.body.password);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([{
            $match: {
                "activeto": null,
                "loginid": req.body.loginid,
                "password": password,
                "statusflag": "A",
            }
        }, ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}
exports.find_user_byuid = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var ID = req.body.useruid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "activeto": null,
                    "_id": mongoose.Types.ObjectId(ID),
                }
            },

            {
                $lookup: {
                    from: "referencevalues",
                    localField: "titleuid",
                    foreignField: "_id",
                    as: "titleuid"
                }
            },
            {
                $unwind: {
                    path: "$titleuid",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}
exports.singleID_ptuid = function (req, res) {
    var mongoose = require('mongoose')
    var nationalid = req.body.nationalid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    nationalid: nationalid,
                    "statusflag": "A",
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "titleuid",
                    as: "titleuid"
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "genderuid",
                    as: "genderuid"
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "religionuid",
                    as: "religionuid"
                }
            },
            {
                $lookup: {
                    from: "organisations",
                    foreignField: "_id",
                    localField: "orguid",
                    as: "orguid"
                }
            },
            {
                $lookup: {
                    from: "patientimages",
                    foreignField: "_id",
                    localField: "patientimageuid",
                    as: "patientimageuid"
                }
            },
            {
                $lookup: {
                    from: "patientvisits",
                    foreignField: "patientuid",
                    localField: "_id",
                    as: "patientvisits"
                }
            },
            {
                "$unwind": {
                    path: "$patientvisits",
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     "$unwind": { path: "$patientimageuid", preserveNullAndEmptyArrays: true }
            // },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patient: docs
            });
            db.close();
        });
    });
}
exports.find_careprovider = function (req, res) {
    var mongoose = require('mongoose')
    var licensenunber = req.body.licensenunber;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    "activeto": null,
                    'iscareprovider': true,
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "licensenunber": licensenunber
                }
            },

            {
                $lookup: {
                    from: "referencevalues",
                    localField: "titleuid",
                    foreignField: "_id",
                    as: "titleuid"
                }
            },
            {
                $unwind: {
                    path: "$titleuid",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}

exports.find_procedure_byPTVUID = function (req, res) {
    var mongoose = require('mongoose')
    // var orguid = req.body.orguid;
    var patientvisituid = req.body.patientvisituid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientprocedures").aggregate([{
                $match: {
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid)
                }
            },
            {
                "$unwind": {
                    path: "$procedures",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                "$lookup": {
                    "from": "procedures",
                    "localField": "procedures.procedureuid",
                    "foreignField": "_id",
                    "as": "icd9"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs.length);
            res.status(200).json({
                procedure: docs
            });
            db.close();
        });
    });
}

exports.labcumu = function (req, res) {
    var mongoose = require('mongoose')
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    var labcode = req.body.labcode;
    labcode = labcode.replace(/'/g, '"');
    labcode = JSON.parse(labcode);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("labresults").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                    //  "patientuid": ObjectId("5a2009b99318c8bc1eb0741b"),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537")
                }
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "orderitemuid",
                    foreignField: "_id",
                    as: "orderitemuid"
                }
            },
            {
                $unwind: {
                    path: "$orderitemuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "orderitemuid.code": {
                        $in: labcode
                    }
                }
            },
            {
                $unwind: {
                    path: "$resultvalues",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    resultname: "$resultvalues.name",
                    resultvalues: "$resultvalues.resultvalue",
                    normalrange: "$resultvalues.normalrange",
                    resultdate: "$resultdate",
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.labcumu_PTUID_labname = function (req, res) {
    var mongoose = require('mongoose')
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    var labname = req.body.labname;
    labname = labname.replace(/'/g, '"');
    labname = JSON.parse(labname);
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("labresults").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                    //  "patientuid": ObjectId("5a2009b99318c8bc1eb0741b"),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537")
                }
            },

            {
                $unwind: {
                    path: "$resultvalues",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "resultvalues.name": {
                        $in: labname
                    }
                }
            },
            {
                $project: {
                    resultname: "$resultvalues.name",
                    resultvalues: "$resultvalues.resultvalue",
                    normalrange: "$resultvalues.normalrange",
                    resultdate: "$resultdate",
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
//-------vaccine
exports.listvaccine = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    // var mPTVUID = req.body.PTVUID;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("drugmasters").find({
            "isvaccine": true,
            "statusflag": "A",
            "activeto": null,
            "orguid": mongoose.Types.ObjectId(orguid),
        }).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                drugmasters: docs
            });
            db.close();
        });
    });
}
exports.find_vaccine_byPTUID = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var patientuid = req.body.patientuid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    // "entypeuid":ObjectId("59f2dd8ac4a1788835afd8c7"),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "orderdate": { $gte: ISODate("2018-10-06T00:00:00.000Z"), $lte: ISODate("2018-10-06T23:59:59.000Z") }
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid),
                    "statusflag": 'A'
                }
            },
            {
                $unwind: {
                    path: '$patientorderitems',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    ordercattype: "MEDICINE",
                }
            },
            {
                $lookup: {
                    from: "drugmasters",
                    foreignField: "orderitemuid",
                    localField: "patientorderitems.orderitemuid",
                    as: "orderitemuid"
                }
            },

            {
                $match: {
                    "orderitemuid.isvaccine": true,
                    "patientorderitems.isactive": true,
                    "patientorderitems.statusuid": {
                        $ne: ObjectId("579b0bcbf3fd3fa90b83e32f")
                    } //Cancelled
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "patientorderitems.careprovideruid",
                    as: "careprovideruid"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patientorder: docs
            });
            db.close();
        });
    });
}

exports.find_appointment = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([

            {
                $match: {
                    "appointmentdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "departmentuid": mongoose.Types.ObjectId(req.body.departmentuid),
                    "careprovideruid": mongoose.Types.ObjectId(req.body.careprovideruid),
                    "statusflag": 'A'
                }
            },
            // {
            //     $match: {
            //         // "appointmentdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
            //         // "orguid": mongoose.Types.ObjectId(orguid),
            //         "orguid": ObjectId("5d09fb1b80256a7b271319a9"),
            //         "appointmentdate": { $gte: ISODate("2019-11-08T00:00:00Z"), $lte: ISODate("2019-11-08T23:59:59Z") },
            //         "departmentuid": ObjectId("5d771bbed5aef6dc263cb64c"),
            //         "careprovideruid": ObjectId("5d81f0d44a1c00f5bd1915cf")
            //     }
            // },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "slots.patientuid",
                    as: "patientuid"
                }
            },
            // {
            //     $project: {
            //         timtings: "$timtings",
            //         appointmentdate: "$appointmentdate",
            //         careprovideruid: "$careprovideruid._id",
            //         careprovidercode: "$careprovideruid.code",
            //         careprovidername: "$careprovideruid.name",
            //         departmentuid: "$departmentuid._id",
            //         departmentname: "$departmentuid.name",
            //         note: "$slots.comments",
            //         patientuid: "$slots.patientuid",
            //     }
            // },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_bypt = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([

            {
                $match: {
                    "appointmentdate": {
                        $gte: new Date(fromdate)
                    },
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    // "departmentuid": mongoose.Types.ObjectId(req.body.departmentuid),
                    "careprovideruid": mongoose.Types.ObjectId(req.body.careprovideruid),
                    "statusflag": 'A'
                }
            },

            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    timtings: "$timtings",
                    appointmentdate: "$appointmentdate",
                    careprovideruid: "$careprovideruid._id",
                    careprovidercode: "$careprovideruid.code",
                    careprovidername: "$careprovideruid.name",
                    departmentuid: "$departmentuid._id",
                    departmentname: "$departmentuid.name",
                    note: "$slots.comments",
                    patientuid: "$slots.patientuid",
                }
            },
            {
                $match: {
                    "patientuid": mongoose.Types.ObjectId(req.body.patientuid),
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_bydep = function (req, res) {

    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([

            {
                $match: {
                    "appointmentdate": {
                        $gte: new Date(fromdate)
                    },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "departmentuid": mongoose.Types.ObjectId(req.body.departmentuid),
                    "statusflag": 'A'
                }
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "slots.patientuid",
                    as: "patientuid"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_bydate = function (req, res) {

    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([{
                $match: {

                    "appointmentdate": {
                        $gte: new Date(fromdate)
                    },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": 'A'
                }
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "slots.patientuid",
                    as: "patientuid"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_bythisdate = function (req, res) {

    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([{
                $match: {

                    "appointmentdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": 'A'
                }
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "slots.patientuid",
                    as: "patientuid"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_bydr = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([

            {
                $match: {
                    "appointmentdate": {
                        $gte: new Date(fromdate)
                    },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "careprovideruid": mongoose.Types.ObjectId(req.body.careprovideruid),
                    "statusflag": 'A'
                }
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "slots.patientuid",
                    as: "patientuid"
                }
            },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_appointment_bydepdate = function (req, res) {

    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("appointmentschedules").aggregate([

            {
                $match: {
                    "appointmentdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "departmentuid": mongoose.Types.ObjectId(req.body.departmentuid),
                    "careprovideruid": mongoose.Types.ObjectId(req.body.careprovideruid),
                    "statusflag": 'A'
                }
            },
            {
                $unwind: {
                    path: "$slots",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "careprovideruid",
                    as: "careprovideruid"
                }
            },
            {
                $unwind: {
                    path: "$careprovideruid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    foreignField: "_id",
                    localField: "departmentuid",
                    as: "departmentuid"
                }
            },
            {
                $unwind: {
                    path: "$departmentuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patients",
                    foreignField: "_id",
                    localField: "slots.patientuid",
                    as: "patientuid"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.list_department = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("departments").aggregate([

            {
                $match: {
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "activeto": null,
                    "isregistrationallowed": true,
                    "statusflag": 'A'
                }
            },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                department: docs
            });
            db.close();
        });
    });
}
//-------------------DM
exports.getdetailbyHN_org = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    "mrn": HN,
                    "orguid": mongoose.Types.ObjectId(orguid),
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "titleuid",
                    as: "titleuid"
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "genderuid",
                    as: "genderuid"
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "religionuid",
                    as: "religionuid"
                }
            },
            {
                $lookup: {
                    from: "organisations",
                    foreignField: "_id",
                    localField: "orguid",
                    as: "orguid"
                }
            },
            {
                $lookup: {
                    from: "patientimages",
                    foreignField: "_id",
                    localField: "patientimageuid",
                    as: "patientimageuid"
                }
            },

            {
                $project: {
                    "_id": 1,
                    "firstname": 1,
                    "lastname": 1,
                    "patientexisthn": 1,
                    "titleuid": 1,
                    "genderuid": 1,
                    "dateofbirth": 1,
                    "religionuid": 1,
                    "contact": 1,
                    "mrn": 1,
                    "createdat": 1,
                    "orguid": 1,
                    "statusflag": 1,
                    "patientimageuid": 1,
                    "address": 1
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patient: docs
            });
            db.close();
        });
    });
}
// exports.emr_subnode_allergy = function (req, res) {
//     var mongoose = require('mongoose')
//     // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
//     // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
//     var HN = req.body.HN;
//     var orguid = req.body.orguid;
//     MongoClient.connect(dbpath, (connectErr, db) => {
//         var dbo = db;
//         dbo.collection("patients").aggregate([{
//                 $match: {
//                     "statusflag": "A",
//                     // "entypeuid": mongoose.Types.ObjectId(entypeuid),
//                     // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
//                     // "_id":ObjectId("5a200aa99318c8bc1eb3e389")
//                     "orguid": mongoose.Types.ObjectId(orguid),
//                     "mrn": HN
//                     // "startdate": { $gte: ISODate("2018-09-09T00:00:00.000Z"), $lte: ISODate("2018-09-09T23:59:59.000Z") }
//                     // "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
//                 }
//             },

//             {
//                 "$lookup": {
//                     "from": "allergies",
//                     "localField": "_id",
//                     "foreignField": "patientuid",
//                     "as": "allergies"
//                 }
//             },
//             {
//                 "$lookup": {
//                     "from": "medicalhistories",
//                     "localField": "_id",
//                     "foreignField": "patientuid",
//                     "as": "medicalhistories"
//                 }
//             },
//         ]).toArray((err, docs) => {
//             console.log(docs);
//             res.status(200).json({
//                 patient: docs
//             });
//             db.close();
//         });
//     });
// }
exports.emr_sub = function (req, res) {
    var mongoose = require('mongoose')
    var patientuid = req.body.uid;
    var orguid = req.body.orguid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                    // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5a200ac89318c8bc1eb458c6")
                    // "startdate": { $gte: ISODate("2018-09-09T00:00:00.000Z"), $lte: ISODate("2018-09-09T23:59:59.000Z") }
                    // "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                }
            },

            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                $lookup: {
                    from: "problems",
                    foreignField: "_id",
                    localField: "diagnoses.diagnosis.problemuid",
                    as: "problemuid"
                }
            },
            {
                $unwind: {
                    path: '$problemuid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            {
                $lookup: {
                    from: "examinations",
                    foreignField: "patientvisituid",
                    localField: "_id",
                    as: "examinations"
                }
            },
            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } }, 
            {
                $group: {
                    "_id": "$_id",
                    // "patientvisit": { $first: "$$ROOT" }, 
                    "patientuid": {
                        $first: "$patientuid"
                    },
                    "visitid": {
                        $first: "$visitid"
                    },
                    "entypeuid": {
                        $first: "$entypeuid"
                    },
                    "startdate": {
                        $first: "$startdate"
                    },
                    "visitpayors": {
                        $first: "$visitpayors"
                    },
                    "department": {
                        $first: "$department"
                    },
                    "observations": {
                        $first: "$observations"
                    },
                    "cchpis": {
                        $first: "$cchpis"
                    },
                    "diagnoses": {
                        $first: "$diagnoses"
                    },
                    "problemuid": {
                        $first: "$problemuid"
                    },
                    "patientprocedures": {
                        $first: "$patientprocedures"
                    },
                    "examinations": {
                        $first: "$examinations"
                    }
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                patientvisits: docs
            });
            db.close();
        });
    });
}
//-------------------------form

exports.getdetail_visitid = function (req, res) {
    var mongoose = require('mongoose')
    // var patientuid = req.body.patientuid;
    var visitid = req.body.visitid
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "visitid": visitid
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnoses.diagnosis.problemuid",
                    "as": "problemuid"
                }
            },
            // { $unwind: { path: '$problemuid', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            {
                $lookup: {
                    "from": "examinations",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "examinations"
                }
            },

            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "imageannotations",
                    "localField": "examinations.annotationuid",
                    "foreignField": "_id",
                    "as": "imageannotations"
                }
            },
            {
                "$lookup": {
                    "from": "examinations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "examinations"
                }
            },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.get_vitalsign = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    // var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("observations").aggregate([{
                $match: {
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                    // "orderitemuid": new mongoose.Types.ObjectId(orderitemuid),
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    // "orguid": ObjectId("5d09fb1b80256a7b271319a9"),
                    // "statusflag": "A",
                    // "orderitemuid": new mongoose.Types.ObjectId(orderitemuid),
                    // "patientvisituid": ObjectId("5df6e60dbee9a4e5d38ddbbf")
                }
            },
            {
                $unwind: "$observationvalues"
            },
            {
                $match: {
                    "observationvalues.resultvalue": {
                        $ne: null
                    },
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    foreignField: "_id",
                    localField: "observationvalues.uomuid",
                    as: "observationvalues.uomuid"
                }
            },
            {
                $unwind: "$observationvalues.uomuid"
            },
            {
                $sort: {
                    "observationdate": -1
                }
            },
            {
                $group: {
                    _id: "$observationvalues.orderresultitemuid",
                    "observationvalues": {
                        $push: {
                            name: "$observationvalues.name",
                            resultvalue: "$observationvalues.resultvalue",
                            displayorder: "$observationvalues.displayorder",
                            observationdate: "$observationdate",
                            uomuid: "$observationvalues.uomuid.valuedescription",
                            HLN: "$observationvalues.HLN",
                            normalrange: "$observationvalues.normalrange"
                        }
                    }
                }
            },
            {
                $project: {
                    observationvalue: {
                        $arrayElemAt: ["$observationvalues", 0]
                    }
                }
            },
            {
                $sort: {
                    "observationvalue.displayorder": 1
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}

exports.emr_diagnosis = function (req, res) {
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "_id": mongoose.Types.ObjectId(patientvisituid)

                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "diagnosis"
                }
            },
            {
                "$unwind": "$diagnosis"
            },
            {
                "$match": {
                    $or: [{
                            "diagnosis.diagnosistext": {
                                $ne: null
                            }
                        },
                        {
                            "diagnosis.diagnosis": {
                                $gt: []
                            }
                        },
                    ]
                }
            },
            {
                $unwind: {
                    path: '$diagnosis.diagnosis',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnosis.diagnosis.problemuid",
                    "as": "diagnosis.diagnosis.problemuid"
                }
            },
            {
                $unwind: {
                    path: '$diagnosis.diagnosis.problemuid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "foreignField": "_id",
                    "localField": "diagnosis.diagnosis.careprovideruid",
                    "as": "diagnosis.diagnosis.careprovideruid"
                }
            },
            {
                $unwind: {
                    path: '$diagnosis.diagnosis.careprovideruid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "code": "$diagnosis.diagnosis.problemuid.code",
                    "name": "$diagnosis.diagnosis.problemuid.name",
                    "description": "$diagnosis.diagnosis.problemuid.description",
                    "isprimary": "$diagnosis.diagnosis.isprimary",
                    "diagnosistext": "$diagnosis.diagnosistext",
                    "careprovider": "$diagnosis.diagnosis.careprovideruid.name",
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.emr_findvisit_byHNdate = function (req, res) {
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid),
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    },

                }
            },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}

exports.patientonward_byorg = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    var ID = req.body.ID;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                "$match": {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "_id": mongoose.Types.ObjectId(ID)
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$unwind": "$bedoccupancy"
            },
            {
                "$lookup": {
                    "from": "wards",
                    "localField": "bedoccupancy.warduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.warduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.warduid"
            },

            {
                "$lookup": {
                    "from": "beds",
                    "localField": "bedoccupancy.beduid",
                    "foreignField": "_id",
                    "as": "bedoccupancy.beduid"
                }
            },
            {
                "$unwind": "$bedoccupancy.beduid"
            },
            {
                "$lookup": {
                    "from": "patients",
                    "localField": "patientuid",
                    "foreignField": "_id",
                    "as": "patientuid"
                }
            },
            {
                "$unwind": "$patientuid"
            },
            {
                $lookup: {
                    from: "patientimages",
                    foreignField: "_id",
                    localField: "patientuid.patientimageuid",
                    as: "patientuid.patientimageuid"
                }
            },
            {
                "$match": {
                    "statusflag": "A",
                    "bedoccupancy.isactive": true,
                    "bedoccupancy.enddate": null,
                    "encounter.valuecode": "ENTYPE2",
                    "enddate": null
                }
            }

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });


    });
}
exports.med_byPTVUID = function (req, res) {

    var fromdate = req.body.fromdate;
    var patientvisituid = req.body.patientvisituid;
    var beduid = req.body.beduid;
    var orguid = req.body.orguid;
    var entypeuid = req.body.entypeuid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{

                $match: {
                    "statusflag": "A",
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                    "orguid": mongoose.Types.ObjectId(orguid),
                    // "beduid": mongoose.Types.ObjectId(beduid),
                    "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    "patientorderitems.enddate": null,
                    // "patientorderitems.enddate": { $gte: new Date(fromdate) },
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid)
                }
            },
            {
                $unwind: {
                    path: "$patientorderitems",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "patientorderitems.ordercattype": {
                        "$in": ["MEDICINE"]
                    }
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.dosageUOM",
                    foreignField: "_id",
                    as: "patientorderitems.dosageUOM"
                }
            },
            {
                $unwind: "$patientorderitems.dosageUOM"
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "patientorderitems.statusuid",
                    foreignField: "_id",
                    as: "patientorderitems.statusuid"
                }
            },
            {
                $unwind: "$patientorderitems.statusuid"
            },
            {
                "$lookup": {
                    "from": "beds",
                    "localField": "beduid",
                    "foreignField": "_id",
                    "as": "beduid"
                }
            },
            {
                $unwind: "$beduid"
            },
            {
                $match: {
                    'patientorderitems.statusuid.valuedescription': {
                        $in: ["Ordered"]
                    },
                    //   'patientorderitems.statusuid.valuedescription': { $nin: ["Cancelled"] },
                }
            },
            {
                "$lookup": {
                    "from": "patients",
                    "localField": "patientuid",
                    "foreignField": "_id",
                    "as": "patientuid"
                }
            },
            {
                $unwind: "$patientuid"
            },
            {
                $lookup: {
                    from: "frequencies",
                    localField: "patientorderitems.frequencyuid",
                    foreignField: "_id",
                    as: "patientorderitems.frequencyuid"
                }
            },

            // {
            //     $project: {
            //         EN: "$patientvisituid.visitid",
            //         entypeuid: "$entypeuid",
            //         ordernumber: "$ordernumber",
            //         ordercattype: "$patientorderitems.ordercattype",
            //         orderitemname: "$patientorderitems.orderitemname",
            //         status: "$patientorderitems.statusuid.valuedescription"
            //     }
            // },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.get_va = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    // var orguid = req.body.orguid;
    var orderitemuid = req.body.orderitemuid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("observations").aggregate([{
                $match: {
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "statusflag": "A",
                    // "orderitemuid": new mongoose.Types.ObjectId(orderitemuid),
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                    // "orguid": ObjectId("5d09fb1b80256a7b271319a9"),
                    // "statusflag": "A",
                    // "orderitemuid": new mongoose.Types.ObjectId(orderitemuid),
                    // "patientvisituid": ObjectId("5df6e60dbee9a4e5d38ddbbf")

                    "orderitemuid": mongoose.Types.ObjectId(orderitemuid),
                }
            },
            {
                $unwind: "$observationvalues"
            },
            // {
            //     $match: {
            //         "observationvalues.resultvalue": {
            //             $ne: null
            //         },
            //     }
            // },
            // {
            //     $lookup: {
            //         from: "referencevalues",
            //         foreignField: "_id",
            //         localField: "observationvalues.uomuid",
            //         as: "observationvalues.uomuid"
            //     }
            // },
            // {
            //     $unwind: "$observationvalues.uomuid"
            // },
            // {
            //     $sort: {
            //         "observationdate": -1
            //     }
            // },
            {
                $group: {
                    _id: "$observationvalues.orderresultitemuid",
                    "observationvalues": {
                        $push: {
                            name: "$observationvalues.name",
                            resultvalue: "$observationvalues.resultvalue",
                            displayorder: "$observationvalues.displayorder",
                            observationdate: "$observationdate",

                        }
                    }
                }
            },
            {
                $project: {
                    observationvalue: {
                        $arrayElemAt: ["$observationvalues", 0]
                    }
                }
            },
            {
                $sort: {
                    "observationvalue.displayorder": 1
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_icd9 = function (req, res) {
    var mongoose = require('mongoose')
    var ID = req.body.ID;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("procedures").aggregate([{
            $match: {
                "statusflag": "A",
                "_id": mongoose.Types.ObjectId(ID),
            }
        }, ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
//-------------edoc
exports.emr_edoc = function (req, res) {
    var patientuid = req.body.patientuid;
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "_id": mongoose.Types.ObjectId(patientvisituid)

                }
            },
            {
                "$lookup": {
                    "from": "allergies",
                    "localField": "patientuid",
                    "foreignField": "patientuid",
                    "as": "allergies"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovider"
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitcareproviders.departmentuid",
                    "foreignField": "_id",
                    "as": "department"
                }
            },
            {
                "$lookup": {
                    "from": "observations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "observations"
                }
            },
            // { 
            // "$unwind": { path: "$observations", preserveNullAndEmptyArrays: true } 
            // }, 
            {
                "$lookup": {
                    "from": "cchpis",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "cchpis"
                }
            },
            {
                "$lookup": {
                    "from": "diagnoses",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "diagnoses"
                }
            },
            {
                "$lookup": {
                    "from": "problems",
                    "foreignField": "_id",
                    "localField": "diagnoses.diagnosis.problemuid",
                    "as": "problemuid"
                }
            },

            {
                "$lookup": {
                    "from": "patientprocedures",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "patientprocedures"
                }
            },
            {
                $unwind: {
                    path: '$patientprocedures',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    "from": "examinations",
                    "foreignField": "patientvisituid",
                    "localField": "_id",
                    "as": "examinations"
                }
            },

            // { $unwind: { path: '$examinations', preserveNullAndEmptyArrays: true } },
            {
                "$lookup": {
                    "from": "imageannotations",
                    "localField": "examinations.annotationuid",
                    "foreignField": "_id",
                    "as": "imageannotations"
                }
            },
            {
                "$lookup": {
                    "from": "examinations",
                    "localField": "_id",
                    "foreignField": "patientvisituid",
                    "as": "examinations"
                }
            },
            {
                "$lookup": {
                    "from": "vitalsingdatas",
                    "localField": "visitid",
                    "foreignField": "visitid",
                    "as": "vitalsingdatas"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.find_procedure_byPTUID = function (req, res) {
    var mongoose = require('mongoose')
    // var orguid = req.body.orguid;
    var patientuid = req.body.patientuid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientprocedures").aggregate([{
                $match: {
                    "statusflag": "A",
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)
                }
            },
            {
                "$unwind": {
                    path: "$procedures",
                    preserveNullAndEmptyArrays: true
                }
            }, {
                "$lookup": {
                    "from": "procedures",
                    "localField": "procedures.procedureuid",
                    "foreignField": "_id",
                    "as": "icd9"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs.length);
            res.status(200).json({
                procedure: docs
            });
            db.close();
        });
    });
}
exports.emr_medhx = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("medicalhistories").aggregate([{
                $match: {
                    "statusflag": "A",
                    "patientuid": mongoose.Types.ObjectId(patientuid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    // "patientuid": ObjectId("611098da4915b000127028f7")
                }
            },
            {
                $lookup: {
                    from: 'referencevalues',
                    localField: 'personalhistories.behaviouruid',
                    foreignField: '_id',
                    as: 'behaviour'
                }
            },

        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}

exports.find_visittype = function (req, res) {
    var ID = req.body.visittypeid;
    var orguid = req.body.orguid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("referencevalues").aggregate([{
                $match: {
                    "statusflag": "A",
                    // "orguid": mongoose.Types.ObjectId(orguid),
                    "_id": mongoose.Types.ObjectId(ID),
                    "domaincode": "VSTTYP",

                }
            },

        ]).toArray((err, docs) => {
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}

exports.emr_eye_try = function (req, res) {
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "patientuid": mongoose.Types.ObjectId(patientuid)

                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5c77565693186b0d84239e17"),

                    // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                    // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                    // "patientuid": ObjectId("5a200ac89318c8bc1eb458c6")
                    // "startdate": { $gte: ISODate("2018-09-09T00:00:00.000Z"), $lte: ISODate("2018-09-09T23:59:59.000Z") }
                    // "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
        },
         {
                $unwind: {
                    path: '$encounter',
                    preserveNullAndEmptyArrays: true
                }
            },
            // {
            //     "$match": {
            //         "encounter.relatedvalue": "OPD",
            //     }
            // },
            {
                $unwind: {
                    path: '$visitcareproviders',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "visitcareproviders.careprovideruid",
                    foreignField: "_id",
                    as: "careprovider"
                }
            },
            {
                $unwind: {
                    path: "$careprovider",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "departments",
                    localField: "visitcareproviders.departmentuid",
                    foreignField: "_id",
                    as: "department"
                }
            },
            {
                $unwind: {
                    path: "$department",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "referencevalues",
                    localField: "careprovider.specialtyuid",
                    foreignField: "_id",
                    as: "specialty"
                }
            },
            {
                $unwind: {
                    path: "$specialty",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "visitcareproviders.visittypeuid",
                    "foreignField": "_id",
                    "as": "visitcareproviders.visittypeuid"
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "department": "$department.name",
                    "careprovider": "$careprovider.name",
                    "specialty": "$specialty.valuedescription",
                    "startdate": 1,
                    "visitid":1,
                    "encounter": "$encounter.relatedvalue",
                    "visittype": "$visitcareproviders.visittypeuid.valuedescription",
                }
            },
        ]).toArray((err, docs) => {
            if (docs && docs.length > 0) {
                console.log('docs', docs);
                async.eachOfSeries(docs, function (episode, index, callback) {
                    if (episode) {
                        async.waterfall([

                            function get1(callb) {

                                getcchpi(episode._id, orguid, function (returnvalue) {
                                    console.log(returnvalue);
                                    if (returnvalue) {
                                        episode.tmp_cchpi = returnvalue;
                                    } else {
                                        episode.tmp_cchpi = [];
                                    }

                                    callb();
                                });
                            },
                            function get2(callb) {
                                getdx(episode._id, orguid, function (returnvalue) {
                                    console.log(returnvalue);
                                    if (returnvalue) {
                                        episode.tmp_dx = returnvalue;
                                    } else {
                                        episode.tmp_dx = [];
                                    }

                                    callb();
                                });
                            },

                        ], function () {
                            callback()
                        })

                    }
                }, function () {
                    if (docs && docs.length > 0) {
                        // console.log('docs', docs);
                        // var sumtable = _.groupBy(docs, function (value) {
                        //     return value.payor;
                        // });
                        // console.log('sumtable', sumtable);
                        // var ret = [];
                        // Object.keys(sumtable).forEach(function (key) {
                        //     var eachkey = sumtable[key];
                        //     var mnewPT = 0;
                        //     var mExistingPT = 0;
                        //     // console.log(eachkey);
                        //     for (var i = 0; i < eachkey.length; i++) {
                        //         mnewPT = mnewPT + eachkey[i].newPT;
                        //         mExistingPT = mExistingPT + eachkey[i].ExistingPT;
                        //     }

                        //     ret.push({
                        //         payor: eachkey[0].payor,
                        //         "new Patient": mnewPT,
                        //         "Existing Patient": mExistingPT,
                        //         Total: mnewPT + mExistingPT,
                        //     });

                        // });

                        // console.log(ret);

                        // var ret2 = _.sortBy(ret, 'Total').reverse();
                        // console.log(ret2);
                        // res.status(200).json({ data: ret2 });
                        res.status(200).json({
                            data: docs
                        });
                    } else {
                        res.status(200).json({
                            data: []
                        });
                        // console.log('nodata');
                    }
                });
            } else {
                res.status(200).json({
                    data: []
                });
                // console.log('nodata');


            }
        });

        function getcchpi(patientvisituid, orguid, callback) {
            mongoose.connection.collection("patientvisits").aggregate([{
                    "$match": {
                        "_id": patientvisituid,
                        "orguid": mongoose.Types.ObjectId(orguid),
                    }
                },
                {
                    "$lookup": {
                        "from": "cchpis",
                        "localField": "_id",
                        "foreignField": "patientvisituid",
                        "as": "cchpis"
                    }
                },
                {
                    $unwind: {
                        path: '$cchpis',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "cchpis.createdby",
                        foreignField: "_id",
                        as: "cchpis.createdby"
                    }
                },
                {
                    $unwind: {
                        path: "$cchpis.createdby",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "cc": "$cchpis.cchpis.chiefcomplaint",
                        "pi": "$cchpis.presentillness",
                        "createdby": "$cchpis.createdby.name",
                    }
                },
            ]).toArray((err, docs) => {
                console.log('getcchpi', docs);
                returnitem = docs;
                callback(returnitem);
            });
        }

        function getdx(patientvisituid, orguid, callback) {
            mongoose.connection.collection("patientvisits").aggregate([{
                    "$match": {
                        "_id": patientvisituid,
                        "orguid": mongoose.Types.ObjectId(orguid),
                    }
                },
                {
                    "$lookup": {
                        "from": "diagnoses",
                        "localField": "_id",
                        "foreignField": "patientvisituid",
                        "as": "diagnoses"
                    }
                },
                {
                    $unwind: {
                        path: '$diagnoses',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "diagnoses.createdby",
                        foreignField: "_id",
                        as: "diagnoses.createdby"
                    }
                },
                {
                    $unwind: {
                        path: "$diagnoses.createdby",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "diagnoses": "$diagnoses.diagnosis",
                        "diagnosistext": "$diagnoses.diagnosistext",
                        "createdby": "$diagnoses.createdby.name",
                    }
                },
                {
                    $unwind: {
                        path: "$diagnoses",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "problems",
                        localField: "diagnoses.problemuid",
                        foreignField: "_id",
                        as: "diagnoses.problemuid"
                    }
                },
                {
                    $unwind: {
                        path: "$diagnoses.problemuid",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "ICD10name": "$diagnoses.problemuid.name",
                        "ICD10code": "$diagnoses.problemuid.code",
                        "diagnosistext": "$diagnosistext",
                        "createdby": "$createdby",
                        "isprimary": "$diagnoses.isprimary",
                    }
                },
            ]).toArray((err, docs) => {
                console.log('getdx', docs);
                returnitem = docs;
                callback(returnitem);
            });
        }
    });
}
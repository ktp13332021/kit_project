var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var md5 = require('md5');
var dbpath = require('../config/db').dbpath;
exports.getvisit = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            $match: {
                // "_id": ObjectId("60f638067c0cbc0014174768"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                "_id": mongoose.Types.ObjectId(patientvisituid),
                "orguid": mongoose.Types.ObjectId(orguid),
                "statusflag": "A",
            }
        },
        { $lookup: { from: 'users', localField: 'visitcareproviders.careprovideruid', foreignField: '_id', as: 'careprovideruid' } },
        { $unwind: { path: '$careprovideruid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'careprovideruid.titleuid', foreignField: '_id', as: 'cptitle' } },
        { $unwind: { path: '$cptitle', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "patients", localField: "patientuid", foreignField: "_id", as: "patient" } },
        { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'patient.titleuid', foreignField: '_id', as: 'patienttitle' } },
        { $unwind: { path: '$patienttitle', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "patientadditionaldetails", localField: "patientuid", foreignField: "patientuid", as: "phone" } },
        { $unwind: { path: "$phone", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "patientimages", localField: "patient.patientimageuid", foreignField: "_id", as: "patientimageuid" } },
        { $unwind: { path: "$patientimageuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "admissionrequests", localField: "_id", foreignField: "patientvisituid", as: "admissionrequests" } },
        { $unwind: { path: "$admissionrequests", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                admissiondate: "$admissionrequests.admissiondate",
                name: {
                    $concat: [
                        { $ifNull: ['$patienttitle.valuedescription', ''] },
                        { $ifNull: ['$patient.firstname', ''] }, ' ',
                        { $ifNull: ['$patient.lastname', ''] }
                    ]
                },
                hn: "$patient.mrn",
                dob: "$patient.dateofbirth",
                phone: "$patient.contact.mobilephone",
                mobilephone: "$phone.addlncontacts.mobilephone",
                patientimage: "$patientimageuid.patientphoto",
                medicaldischargedate: "$medicaldischargedate",
                dr: {
                    $concat: [
                        { $ifNull: ['$cptitle.valuedescription', ''] },
                        { $ifNull: ['$careprovideruid.name', ''] }, ' ',

                    ]
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
exports.getdetailbyHN = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
            $match: {
                "mrn": HN,
                // "orguid": mongoose.Types.ObjectId(orguid),
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
                "address": 1,
                "isvip": 1
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
exports.find_currentmed = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    var mchoose = req.body.mchoose;
    console.log(mchoose);
    if (mchoose == 'C') {
        var matchchoose = {
            "patientorderitems.statusuid.valuedescription": { $nin: ["Cancelled", "Discontinued"] },
            'patientorderitems.iscontinuousorder': true,
            'patientorderitems.closeby': null
        }
    } else if (mchoose == 'D') {
        var matchchoose = {
            "patientorderitems.statusuid.valuedescription": { $nin: ["Cancelled", "Discontinued"] },
            'patientorderitems.iscontinuousorder': false,
            'patientorderitems.closeby': null,
            'patientorderitems.enddate': null
        }
    } else {
    }

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
            $match: {
                "statusflag": "A",
                // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                // "patientvisituid":ObjectId("5a200aa99318c8bc1eb3e389")
                "orguid": mongoose.Types.ObjectId(orguid),
                "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                "isautogenerated": false,
            }
        },
        { $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true } },
        { $match: { "patientorderitems.ordercattype": { "$in": ["MEDICINE"] } } },
        { $lookup: { from: "referencevalues", localField: "patientorderitems.statusuid", foreignField: "_id", as: "patientorderitems.statusuid" } },
        { $unwind: { path: "$patientorderitems.statusuid", preserveNullAndEmptyArrays: true } },

        { $match: matchchoose },

        { $lookup: { from: "ordercategories", localField: "patientorderitems.ordercatuid", foreignField: "_id", as: "ordercatuid" } },
        { $unwind: { path: "$ordercatuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "ordercategories", localField: "patientorderitems.ordersubcatuid", foreignField: "_id", as: "ordersubcatuid" } },
        { $unwind: { path: "$ordersubcatuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "patientorderitems.dosageUOM", foreignField: "_id", as: "dosageUOM" } },
        { $unwind: { path: "$dosageUOM", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "patientorderitems.quantityUOM", foreignField: "_id", as: "quantityUOM" } },
        { $unwind: { path: "$quantityUOM", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "frequencies", localField: "patientorderitems.frequencyuid", foreignField: "_id", as: "frequencyuid" } },
        { $unwind: { path: "$frequencyuid", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                orderitemname: { $ifNull: ['$patientorderitems.orderitemname', ''] },
                dosage: { $ifNull: ['$patientorderitems.dosage', ''] },
                quantityperdose: { $ifNull: ['$patientorderitems.quantityperdose', ''] },
                dosageUOM: { $ifNull: ['$dosageUOM.valuedescription', ''] },
                frequency: { $ifNull: ['$frequencyuid.code', ''] },
                quantity: { $ifNull: ['$patientorderitems.quantity', ''] },
                quantityUOM: { $ifNull: ['$quantityUOM.valuedescription', ''] },
                startdate: { $ifNull: ['$patientorderitems.startdate', ''] },
                ordercatuid: { $ifNull: ['$ordercatuid.description', ''] },
                ordersubcatdesc: { $ifNull: ['$ordersubcatuid.description', ''] },
                ordersubcatname: { $ifNull: ['$ordersubcatuid.name', ''] },
            }
        },
        { "$sort": {  "orderitemname": 1.0 } }
        ]).toArray((err, docs) => {
            console.log('curmed', docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.get_ICD10_byvisit = function (req, res) {
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("diagnoses").aggregate([{
            $match: {
                "orguid": mongoose.Types.ObjectId(orguid),
                "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                // "patientvisituid": ObjectId("60f947d47c0cbc0014184a6c"),
            }
        },
        { $unwind: { path: '$diagnosis', preserveNullAndEmptyArrays: true } },
        { $lookup: { "from": "users", "foreignField": "_id", "localField": "diagnosis.careprovideruid", "as": "careprovideruid" } },
        { $unwind: '$careprovideruid' },
        { $lookup: { "from": "problems", "foreignField": "_id", "localField": "diagnosis.problemuid", "as": "problemuid" } },
        { $unwind: { path: "$problemuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { "from": "departments", "foreignField": "_id", "localField": "departmentuid", "as": "department" } },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                "date": "$diagnosis.onsetdate",
                "ICD10code": "$problemuid.code",
                "ICD10name": "$problemuid.name",
                "ICD10desc": "$problemuid.description",
                "department": "$department.name",
                "primary": "$diagnosis.isprimary",
                "careprovider": "$careprovideruid.name",
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
exports.get_progressnote = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("clinicalnotes").aggregate([{
            $match: {
                // 	"screentype" : "EMR.PROGRESSNOTESLOW",
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid),
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                // "patientvisituid": ObjectId("5f62c46d214936442d2c56ce"),
                // "orguid": ObjectId('59e865c8ab5f11532bab0537'),
            }
        },
        { $unwind: { path: "$auditlog", preserveNullAndEmptyArrays: true } },
        {
            $match: {
                "auditlog.notetype": "FREETEXT",
                "notetext": { $ne: "" },
            }
        },
        { $lookup: { from: "users", localField: "careprovideruid", foreignField: "_id", as: "careprovideruid" } },
        { $unwind: { path: "$careprovideruid", preserveNullAndEmptyArrays: true } },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
//------------------------------------------
exports.this_progressnote = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("clinicalnotes").aggregate([{
            $match: {
                // 	"screentype" : "EMR.PROGRESSNOTESLOW",
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid),
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "createdat": { $gte: new Date(req.body.fromdate), $lte: new Date(req.body.todate) }
                // "createdat": { $gte: ISODate("2021-07-24T00:00:00.000+07:00"), $lte: ISODate("2021-07-24T23:59:59.000+07:00") },
                // "patientvisituid": ObjectId("5f62c46d214936442d2c56ce"),
                // "orguid": ObjectId('59e865c8ab5f11532bab0537'),
            }
        },
        { $unwind: { path: "$auditlog", preserveNullAndEmptyArrays: true } },
        {
            $match: {
                "auditlog.notetype": "FREETEXT",
                "notetext": { $ne: "" },
            }
        },
        { $lookup: { from: "users", localField: "careprovideruid", foreignField: "_id", as: "careprovideruid" } },
        { $unwind: { path: "$careprovideruid", preserveNullAndEmptyArrays: true } },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.this_orders = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
            $match: {
                // 	"screentype" : "EMR.PROGRESSNOTESLOW",
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid),
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "orderdate": { $gte: new Date(req.body.fromdate), $lte: new Date(req.body.todate) }
                // "orderdate": { $gte: ISODate("2021-07-24T00:00:00.000+07:00"), $lte: ISODate("2021-07-24T23:59:59.000+07:00") },
                // "patientvisituid": ObjectId("5f62c46d214936442d2c56ce"),
                // "orguid": ObjectId('59e865c8ab5f11532bab0537'),
            }
        },
        { $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true } },
        { $match: { "patientorderitems.ordercattype": { "$in": ["MEDICINE", "LAB", "XRAY"] } } },
        { $lookup: { from: "referencevalues", localField: "patientorderitems.statusuid", foreignField: "_id", as: "patientorderitems.statusuid" } },
        { $unwind: { path: "$patientorderitems.statusuid", preserveNullAndEmptyArrays: true } },
        
        {
            $match: {
                "patientorderitems.statusuid.valuedescription": { $nin: ["Cancelled", "Discontinued"] },
            }
        },
        
        { $lookup: { from: "ordercategories", localField: "patientorderitems.ordercatuid", foreignField: "_id", as: "ordercatuid" } },
        { $unwind: { path: "$ordercatuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "ordercategories", localField: "patientorderitems.ordersubcatuid", foreignField: "_id", as: "ordersubcatuid" } },
        { $unwind: { path: "$ordersubcatuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "patientorderitems.dosageUOM", foreignField: "_id", as: "dosageUOM" } },
        { $unwind: { path: "$dosageUOM", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "patientorderitems.quantityUOM", foreignField: "_id", as: "quantityUOM" } },
        { $unwind: { path: "$quantityUOM", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "frequencies", localField: "patientorderitems.frequencyuid", foreignField: "_id", as: "frequencyuid" } },
        { $unwind: { path: "$frequencyuid", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                orderitemname: { $ifNull: ['$patientorderitems.orderitemname', ''] },
                dosage: { $ifNull: ['$patientorderitems.dosage', ''] },
                quantityperdose: { $ifNull: ['$patientorderitems.quantityperdose', ''] },
                dosageUOM: { $ifNull: ['$dosageUOM.valuedescription', ''] },
                frequency: { $ifNull: ['$frequencyuid.code', ''] },
                quantity: { $ifNull: ['$patientorderitems.quantity', ''] },
                quantityUOM: { $ifNull: ['$quantityUOM.valuedescription', ''] },
                startdate: { $ifNull: ['$patientorderitems.startdate', ''] },
                ordercatuid: { $ifNull: ['$ordercatuid.description', ''] },
                ordersubcatdesc: { $ifNull: ['$ordersubcatuid.description', ''] },
                ordersubcatname: { $ifNull: ['$ordersubcatuid.name', ''] },
                ordercattype: { $ifNull: ['$patientorderitems.ordercattype', ''] },
            }
        },
        {
            "$group": {
                "_id": { orderitemname: "$orderitemname", frequency: "$frequency" },
                "orderitemname": { "$first": "$orderitemname" },
                "dosage": { "$first": "$dosage" },
                "quantityperdose": { "$first": "$quantityperdose" },
                "dosageUOM": { "$first": "$dosageUOM" },
                "frequency": { "$first": "$frequency" },
                "quantityUOM": { "$first": "$quantityUOM" },
                "startdate": { "$first": "$startdate" },
                "ordercatuid": { "$first": "$ordercatuid" },
                "ordersubcatdesc": { "$first": "$ordersubcatdesc" },
                "ordersubcatname": { "$first": "$ordersubcatname" },
                "ordercattype": { "$first": "$ordercattype" },
                "quantity": { "$sum": "$quantity" },
            }
        },
        { "$sort": { "ordercattype": 1.0, "orderitemname": 1.0 } }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.this_xray = function (req, res) {
    var matchtoday = {};
    if (req.body.mchoose=='today') {
        var matchtoday =  {
            "radiologyresults.resultdate": { $gte: new Date(req.body.fromdate), $lte: new Date(req.body.todate) }
        }
    }
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            "$match": {
                "statusflag": "A",
                "_id": mongoose.Types.ObjectId(req.body.patientvisituid),
                "orguid": mongoose.Types.ObjectId(req.body.orguid),

                // _id: ObjectId("60e97e16de18746fb71a87be"),
                // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
            }
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
                from: "orderitems",
                localField: "patientorders.patientorderitems.orderitemuid",
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
        { $match: matchtoday },

        { $lookup: { "from": "users", "foreignField": "_id", "localField": "radiologyresults.radiologistuid", "as": "radiologistuid" } },
        { $unwind: '$radiologistuid' },
        {
            $project: {
                date: '$radiologyresults.resultdate',
                result: '$radiologyresults.resulttext',
                radiologist: '$radiologistuid.name',
                orderitemcode: '$orderitemuid.code',
                orderitemname: '$orderitemuid.name',
            }
        },
        { "$sort": { "date": -1.0, "orderitemname": 1.0 } }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.this_lab = function (req, res) {
    var matchtoday = {};
    if (req.body.mchoose=='today') {
        var matchtoday =  {
            "resultdate": { $gte: new Date(req.body.fromdate), $lte: new Date(req.body.todate) }
        }
    }
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("labresults").aggregate([{
            $match: {
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(req.body.patientvisituid),
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
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
        { $match: matchtoday },
        {
            $project: {
                date: '$resultdate',
                orderitemcode: '$orderitemuid.code',
                orderitemname: '$orderitemuid.name',
                result: '$resultvalues',
            }
        },
        { "$sort": { "date": -1.0, "orderitemname": 1.0 } }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.get_io = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                $match: {
                    "_id": mongoose.Types.ObjectId(patientvisituid),
                    "orguid": mongoose.Types.ObjectId(orguid),
                }
            },

            {
                $lookup: {
                    from: "referencevalues",
                    localField: "entypeuid",
                    foreignField: "_id",
                    as: "entypeuid"
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
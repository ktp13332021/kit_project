var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var md5 = require('md5');
var dbpath = require('../config/db').dbpath;
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
                "statusflag": "A",
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
                "_id": mongoose.Types.ObjectId(patientvisituid),
                "orguid": mongoose.Types.ObjectId(orguid),
                "statusflag": "A",
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
exports.get_ICD10_byvisit = function (req, res) {
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("diagnoses").aggregate([{
            $match: {
                "statusflag": "A",
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
                "careprovider":"$careprovideruid.name",
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
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                "orguid": mongoose.Types.ObjectId(orguid),
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
        // {
        //     $project: {
        //         patientvisituid: "$patientvisituid",
        //         entypeuid: "$entypeuid",
        //         ordernumber: "$ordernumber",
        //         ordercattype: "$patientorderitems.ordercattype",
        //         orderitemname: "$patientorderitems.orderitemname",
        //         status: "$patientorderitems.statusuid.valuedescription"
        //     }
        // },
        {
            $match: {
                status: {
                    $nin: ["Cancelled"]
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
exports.findxray_byPTVUID = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    // var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo
            .collection("patientvisits")
            .aggregate([
                {
                    $match: {
                        "statusflag": "A",
                        _id: mongoose.Types.ObjectId(patientvisituid),
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
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
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
exports.find_procedure_byPTVUID = function (req, res) {
    var mongoose = require('mongoose')
    // var orguid = req.body.orguid;
    var patientvisituid = req.body.patientvisituid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientprocedures").aggregate([{
            $match: {
                "statusflag": "A",
                // "orguid": mongoose.Types.ObjectId(orguid),
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
exports.find_user_all = function (req, res) {
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    "activeto": null,
                    // 'iscareprovider': true,

                    "orguid": mongoose.Types.ObjectId(orguid),
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
exports.emr_subnode_allergy = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var patientuid = req.body.patientuid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
            $match: {
                "statusflag": "A",
                // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                // "_id":ObjectId("5a200aa99318c8bc1eb3e389")
                "_id": mongoose.Types.ObjectId(patientuid),
                "orguid": mongoose.Types.ObjectId(orguid),
                // "mrn": HN
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
                data: docs
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
                // "entypeuid": mongoose.Types.ObjectId(entypeuid),
                // "orguid": ObjectId("59e865c8ab5f11532bab0537"),
                // "_id":ObjectId("5a200aa99318c8bc1eb3e389")
                "orguid": mongoose.Types.ObjectId(orguid),
                "patientuid": mongoose.Types.ObjectId(patientuid),
                // "startdate": { $gte: ISODate("2018-09-09T00:00:00.000Z"), $lte: ISODate("2018-09-09T23:59:59.000Z") }
                // "startdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
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
                data: docs
            });
            db.close();
        });
    });
}
exports.get_uid = function (req, res) {
    var mongoose = require('mongoose')
    var visitid = req.body.visitid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                $match: {
                    "statusflag": "A",
                    "visitid": visitid,
                    "orguid": mongoose.Types.ObjectId(orguid),
                }
            },
            {
                $lookup: {
                    from: "patients",
                    localField: "patientuid",
                    foreignField: "_id",
                    as: "patients"
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
exports.find_getlabxray_today = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
            $match: {
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                "orguid": mongoose.Types.ObjectId(orguid),
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
                    "$in": ["LAB", "RADIOLOGY"]
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
                status: {
                    $nin: ["Cancelled"]
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
exports.get_progressnote = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("clinicalnotes").aggregate([{
            $match: {
                // 	"screentype" : "EMR.PROGRESSNOTESLOW",
                "statusflag": "A",
                "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("5f62c46d214936442d2c56ce"),
                // "orguid": ObjectId('59e865c8ab5f11532bab0537'),
            }
        },
        // {
        //     $unwind: {
        //         path: "$auditlog",
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        {
            $match: {
                "auditlog.notetype": "FREETEXT",
                "notetext": { $ne: "" },
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

exports.find_currentmed = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    if (req.body.mchoose = 'C') {
        var matchchoose = {
            "patientorderitems.statusuid.valuedescription": { $nin: ["Cancelled", "Discontinued"] },
            'patientorderitems.iscontinuousorder': true,
            'patientorderitems.closeby': null
        }
    } else {
        var matchchoose = {
            "patientorderitems.statusuid.valuedescription": { $nin: ["Cancelled", "Discontinued"] },
            'patientorderitems.iscontinuousorder': false,
            'patientorderitems.closeby': null,
            'patientorderitems.enddate': null
        }
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
                    "statusflag": "A",
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
//------------------------------------------------------------------

exports.find_user_byorg = function (req, res) {
    var orguid = req.body.orguid;
    var userid = req.body.userid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    "activeto": null,
                    // 'iscareprovider': true,
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "_id": mongoose.Types.ObjectId(userid),
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
exports.find_mdname = function (req, res) {
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
                // "patientuid": ObjectId("5a200a6c9318c8bc1eb33390")
            }
        },
        {
            $unwind: {
                path: '$visitcareproviders',
                preserveNullAndEmptyArrays: true
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
            $unwind: {
                path: '$careprovider',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                patientvisituid: "$patientvisituid",
                mdname: "$careprovider.name",
            }
        },
        {
            $match: {
                "mdname": {
                    "$nin": [null, "ไม่ระบุแพทย์"]
                }
            }
        },
        {
            $group: {
                _id: "$mdname"
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
                "statusflag": "A",
                // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
                "orguid": mongoose.Types.ObjectId(orguid),
                "entypeuid": mongoose.Types.ObjectId("59f2dd8ac4a1788835afd8c7"),
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
            .aggregate([
                {
                    $match: {
                        "statusflag": "A",
                        visitid: EN,
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
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(orguid),
                    "activeto": null,
                    "loginid": req.body.loginid,
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
                "statusflag": "A",
                "activeto": null,
                "loginid": req.body.loginid,
                "password": password,
            }
        },]).toArray((err, docs) => {
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
                "statusflag": "A",
                nationalid: nationalid,
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

//-------------------DM
// exports.getdetailbyHN_org = function (req, res) {
//     var mongoose = require('mongoose')
//     // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
//     // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
//     var HN = req.body.HN;
//     var orguid = req.body.orguid;
//     MongoClient.connect(dbpath, (connectErr, db) => {
//         var dbo = db;
//         dbo.collection("patients").aggregate([{
//                 $match: {
//                     "mrn": HN,
//                     "orguid": mongoose.Types.ObjectId(orguid),
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "referencevalues",
//                     foreignField: "_id",
//                     localField: "titleuid",
//                     as: "titleuid"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "referencevalues",
//                     foreignField: "_id",
//                     localField: "genderuid",
//                     as: "genderuid"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "referencevalues",
//                     foreignField: "_id",
//                     localField: "religionuid",
//                     as: "religionuid"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "organisations",
//                     foreignField: "_id",
//                     localField: "orguid",
//                     as: "orguid"
//                 }
//             },
//             {
//                 $lookup: {
//                     from: "patientimages",
//                     foreignField: "_id",
//                     localField: "patientimageuid",
//                     as: "patientimageuid"
//                 }
//             },

//             {
//                 $project: {
//                     "_id": 1,
//                     "firstname": 1,
//                     "lastname": 1,
//                     "patientexisthn": 1,
//                     "titleuid": 1,
//                     "genderuid": 1,
//                     "dateofbirth": 1,
//                     "religionuid": 1,
//                     "contact": 1,
//                     "mrn": 1,
//                     "createdat": 1,
//                     "orguid": 1,
//                     "statusflag": 1,
//                     "patientimageuid": 1,
//                     "address": 1
//                 }
//             }
//         ]).toArray((err, docs) => {
//             console.log(docs);
//             res.status(200).json({
//                 patient: docs
//             });
//             db.close();
//         });
//     });
// }
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
exports.getvisitbyptuid = function (req, res) {
    var mongoose = require('mongoose')
    var ptuid = req.body.ptuid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            $match: {
                statusflag: 'A',
                orguid: mongoose.Types.ObjectId(orguid),
                patientuid: mongoose.Types.ObjectId(ptuid)
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
        },]).toArray((err, docs) => {
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


exports.find_visittype = function (req, res) {
    var ID = req.body.visittypeid;
    var orguid = req.body.orguid;

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("referencevalues").aggregate([{
            $match: {
                "statusflag": "A",
                // "statusflag": "A",
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
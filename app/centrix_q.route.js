var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;
exports.q_regist = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            "$match": {
                // orguid: ObjectId("5faa3d95f71034497f38a208"),
                // "startdate": { $gte: ISODate("2021-11-29T00:00:00.000+07:00"), $lte: ISODate("2021-11-30T23:59:59.000+07:00") }

                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
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
                "from": "patients",
                "localField": "patientuid",
                "foreignField": "_id",
                "as": "patientuid"
            }
        },
        {
            $lookup: {
                from: 'referencevalues',
                localField: 'patientuid.titleuid',
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
            $unwind: {
                path: "$patientuid",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "payors",
                foreignField: "_id",
                localField: "visitpayors.payoruid",
                as: "payoruid"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "visitcareproviders.careprovideruid",
                foreignField: "_id",
                as: "careprovideruid"
            }
        },
        {
            "$project": {
                "patientvisituid": "$_id",
                // "patient": "$patientuid",
                "department": "$department.name",
                "departmentcode": "$department.code",
                name: {
                    $cond: [{
                        $ne: ['$patientuid', null]
                    },
                    {
                        $concat: [{
                            $ifNull: ['$patienttitle.valuedescription', '']
                        },
                        {
                            $ifNull: [{
                                $toString: '$patientuid.firstname'
                            }, '']
                        },
                            ' ',
                        {
                            $ifNull: ['$patientuid.lastname', '']
                        },
                        ]
                    },
                        ''
                    ]
                },
                HN: {
                    $ifNull: ['$patientuid.mrn', '']
                },
                AN: {
                    $ifNull: ['$visitid', '']
                },
                dob: {
                    $ifNull: ["$patient.dateofbirth", '']
                },
                "startdate": 1,
                "payor": "$payoruid.name",
                "careprovider": "$careprovideruid.name",
            }
        },
        {
            $addFields: {
                "recq_regist": false
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
exports.finddepartments = function (req, res) {
    var mongoose = require('mongoose');
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("departments").find({
            "orguid": mongoose.Types.ObjectId(req.body.orguid),
            activeto: null,
        }).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.findopd_byHN = function (req, res) {
    var AN = req.body.AN;
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            "$match": {
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
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
                "from": "patients",
                "localField": "patientuid",
                "foreignField": "_id",
                "as": "patientuid"
            }
        },
        {
            $lookup: {
                from: 'referencevalues',
                localField: 'patientuid.titleuid',
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
            $unwind: {
                path: "$patientuid",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "payors",
                foreignField: "_id",
                localField: "visitpayors.payoruid",
                as: "payoruid"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "visitcareproviders.careprovideruid",
                foreignField: "_id",
                as: "careprovideruid"
            }
        },
        {
            "$project": {
                "patientvisituid": "$_id",
                // "patient": "$patientuid",
                "department": "$department.name",
                "departmentcode": "$department.code",
                name: {
                    $cond: [{
                        $ne: ['$patientuid', null]
                    },
                    {
                        $concat: [{
                            $ifNull: ['$patienttitle.valuedescription', '']
                        },
                        {
                            $ifNull: [{
                                $toString: '$patientuid.firstname'
                            }, '']
                        },
                            ' ',
                        {
                            $ifNull: ['$patientuid.lastname', '']
                        },
                        ]
                    },
                        ''
                    ]
                },
                HN: {
                    $ifNull: ['$patientuid.mrn', '']
                },
                AN: {
                    $ifNull: ['$visitid', '']
                },
                dob: {
                    $ifNull: ["$patient.dateofbirth", '']
                },
                "startdate": 1,
                "payor": "$payoruid.name",
                "careprovider": "$careprovideruid.name",
            }
        },
        {
            $addFields: {
                "recq_regist": false
            }
        },
        {
            "$match": {
                "AN": {
                    '$regex': new RegExp(AN, 'i')
                },
                // "AN": "VN21001334",
            }
        },
        {
            "$sort": {
                "startdate": 1
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
exports.findcaseor = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("orschedules").aggregate([{
            "$match": {
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "scheduledate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                },
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
            $lookup: {
                from: "referencevalues",
                localField: "slots.orstatusuid",
                foreignField: "_id",
                as: "orstatusuid"
            }
        },
        {
            $unwind: {
                path: "$orstatusuid",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$match": {
                "statusuid.valuedescription": {
                    $in: ['Confirmed']
                }
            }
        },
        {
            $lookup: {
                from: 'patients',
                localField: 'slots.patientuid',
                foreignField: '_id',
                as: 'patientuid'
            }
        },
        {
            $unwind: {
                path: '$patientuid',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'referencevalues',
                localField: 'patientuid.titleuid',
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
            $project: {
                statusor: {
                    $ifNull: [
                        '$orstatusuid.locallanguagedesc',
                        {
                            "$ifNull": ["$orstatusuid.valuedescription", ""]
                        }
                    ]
                },
                statusorcolor: {
                    "$ifNull": ["$orstatusuid.relatedvalue", "yellow"]
                },
                status: {
                    $ifNull: ['$statusuid.valuedescription', '']
                },
                operating_room: {
                    $ifNull: ['$orsessions.name', '']
                },
                HN: {
                    $ifNull: ['$patientuid.mrn', '']
                },
                name: {
                    $concat: [{
                        $ifNull: ['$patienttitle.valuedescription', '']
                    },
                    {
                        $ifNull: ['$patientuid.firstname', '']
                    }, ' ',
                    {
                        $ifNull: ['$patientuid.lastname', '']
                    }
                    ]
                },
            }
        },
        {
            "$match": {
                "statusor": {
                    $nin: ['']
                }
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
exports.q_ertriage = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("triagedetails").aggregate([{
            "$match": {
                // orguid: ObjectId("5faa3d95f71034497f38a208"),
                // "createdat": { $gte: ISODate("2021-11-29T00:00:00.000+07:00"), $lte: ISODate("2021-11-30T23:59:59.000+07:00") }

                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                "createdat": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        { $lookup: { from: "referencevalues", localField: "emergencyleveluid", foreignField: "_id", as: "erlevel" } },
        { $unwind: { path: "$erlevel", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "patients", localField: "patientuid", foreignField: "_id", as: "patient" } },
        { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "patient.titleuid", foreignField: "_id", as: "title" } },
        { $unwind: { path: "$title", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "patientvisits", localField: "patientvisituid", foreignField: "_id", as: "patientvisit" } },
        { $unwind: { path: "$patientvisit", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$patientvisit.visitjourneys", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "patient.genderuid", foreignField: "_id", as: "gender" } },
        { $unwind: { path: "$gender", preserveNullAndEmptyArrays: true } },
        {
            $group: {
                _id: {
                    VisitUID: "$patientvisit.visitid",
                    HN: "$patient.mrn",
                    PatientName: {
                        $concat: [
                            { $ifNull: ["$title.valuedescription", ""] }, "",
                            { $ifNull: ["$patient.firstname", ""] }, " ",
                            { $ifNull: ["$patient.middlename", ""] }, " ",
                            { $ifNull: ["$patient.lastname", ""] }
                        ]
                    },
                    DOB: "$patient.dateofbirth",
                    isdobestimated: "$patient.isdobestimated",
                    Gender: "$gender.valuedescription",
                    Visitdate: "$patientvisit.startdate",
                    patientvisituid: "$patientvisit._id"
                },
                Department: { $first: "$patientvisit.visitjourneys.departmentuid" },
                TriageLevelCode: { "$last": "$erlevel.valuecode" },
                TriageLevel: { "$last": "$erlevel.valuedescription" },
                visitstatusuid: { $first: "$patientvisit.visitstatusuid" }

            }
        },
        { $lookup: { from: "departments", localField: "Department", foreignField: "_id", as: "department" } },
        { $unwind: { path: "$department", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "referencevalues", localField: "visitstatusuid", foreignField: "_id", as: "visitstatusuid" } },
        { $unwind: { path: "$visitstatusuid", preserveNullAndEmptyArrays: true } },
        {
            $project:
            {
                _id: 0,
                AN: "$_id.VisitUID",
                TriageLevelCode: "$TriageLevelCode",
                TriageLevel: "$TriageLevel",
                HN: "$_id.HN",
                name: "$_id.PatientName",
                dob: "$_id.DOB",
                // 		isdobestimated:"$_id.isdobestimated",
                gender: "$_id.Gender",
                Visitdate: "$_id.Visitdate",
                department: "$department.name",
                visitstatuscode: "$visitstatusuid.valuecode",
                visitstatus: "$visitstatusuid.valuedescription",
                statusflag: { $ifNull: ['$visitstatusuid.relatedvalue', 'T'] },
                "patientvisituid": 1,
            }
        },
        {
            $addFields: {
                "recq_er": 0
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
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;
exports.opdcase01 = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
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
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.relatedvalue": "OPD"
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
                $unwind: {
                    path: "$patientuid",
                    preserveNullAndEmptyArrays: true
                }
            },
          
            {
                "$project": {
                    "patientvisituid": "$_id",
                    "patientuid": "$patientuid._id",
                    "visitid": 1,
                    name: {
                        $cond: [{
                                $ne: ['$patientuid', null]
                            },
                            {
                                $concat: [{
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
                        $ifNull: ['$patientvisituid.visitid', '']
                    },
                    "startdate": 1,
                    "departmentuid": "$department._id",

                }
            },
            {
                $addFields: {
                    "rec": false
                }
            },
            {
                $addFields: {
                    "rectn": false
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
exports.opdcase = function (req, res) {
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
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
                    "from": "referencevalues",
                    "localField": "entypeuid",
                    "foreignField": "_id",
                    "as": "encounter"
                }
            },
            {
                "$match": {
                    "encounter.relatedvalue": "OPD"
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
                $unwind: {
                    path: "$patientuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "patientvisituid": "$_id",
                    "patientuid": "$patientuid._id",
                    "visitid": 1,
                    name: {
                        $cond: [{
                            $ne: ['$patientuid', null]
                        },
                        {
                            $concat: [{
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
                        $ifNull: ['$patientvisituid.visitid', '']
                    },
                    "startdate": 1,
                    "departmentuid": "$department._id",
                    last: { $arrayElemAt: ["$visitjourneys", -1] }
                }
            },
            {
                "$lookup": {
                    "from": "referencevalues",
                    "localField": "last.statusuid",
                    "foreignField": "_id",
                    "as": "status"
                }
            },
            {
                $unwind: {
                    path: "$status",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "patientvisituid": 1,
                    "patientuid": 1,
                    "visitid": 1,
                    name: 1,
                    HN: 1,
                    AN: 1,
                    "startdate": 1,
                    "departmentuid": 1,
                    status: {
                        $ifNull: ['$status.valuedescription', '']
                    },
                    displayorder: {
                        $ifNull: ['$status.displayorder', '']
                    },
                }
            },
            
            {
                "$match": {
                    "displayorder": { $lt: 7 }
                }
            },
            {
                $addFields: {
                    "rec": false
                }
            },
            {
                $addFields: {
                    "rectn": false
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
exports.findopd_byHN = function (req, res) {
    var HN = req.body.HN;
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
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
                "$unwind": "$department"
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
                "$match": {
                    "encounter.relatedvalue": "OPD"
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
                $unwind: {
                    path: "$patientuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$match": {
                    "patientuid.mrn": HN,
                }
            },
            {
                "$project": {
                    "useruid": "$createdby",
                    "patientvisituid": "$_id",
                    "patientuid": "$patientuid._id",
                    "visitid": 1,
                    name: {
                        $cond: [{
                                $ne: ['$patientuid', null]
                            },
                            {
                                $concat: [{
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
                        $ifNull: ['$patientvisituid.visitid', '']
                    },
                    "startdate": 1,
                    "departmentuid": "$department._id",
                    "careprovideruid": mongoose.Types.ObjectId("6156a38b03bd9d0013da133b"),
                }
            },
            { $addFields: { "rec": false } },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
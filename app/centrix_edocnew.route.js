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
                    "orguid": mongoose.Types.ObjectId(orguid),
                }
            },

            {
                $lookup: {
                    from: 'referencevalues',
                    localField: 'titleuid',
                    foreignField: '_id',
                    as: 'titleuid'
                }
            },
            {
                $unwind: {
                    path: '$titleuid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "patientadditionaldetails",
                    localField: "_id",
                    foreignField: "slots.patientuid",
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
                $lookup: {
                    from: 'referencevalues',
                    localField: 'genderuid',
                    foreignField: '_id',
                    as: 'genderuid'
                }
            },
            {
                $unwind: {
                    path: '$genderuid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'referencevalues',
                    localField: 'religionuid',
                    foreignField: '_id',
                    as: 'religionuid'
                }
            },
            {
                $unwind: {
                    path: '$religionuid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'organisations',
                    localField: 'orguid',
                    foreignField: '_id',
                    as: 'orguid'
                }
            },
            {
                $unwind: {
                    path: '$orguid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'patientimages',
                    localField: 'patientimageuid',
                    foreignField: '_id',
                    as: 'patientimageuid'
                }
            },
            {
                $unwind: {
                    path: '$patientimageuid',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    "_id": 1,
                    "name": {
                        $concat: [{
                                $ifNull: ['$titleuid.valuedescription', '']
                            },
                            {
                                $ifNull: ['$firstname', '']
                            }, ' ',
                            {
                                $ifNull: ['$lastname', '']
                            }
                        ]
                    },
                    "hn": "$mrn",
                    "phone": "$pcontact.mobilephone",
                    "mobilephone": "$phone.addlncontacts.mobilephone",
                    "genderuid": "$genderuid.valuedescription",
                    "dateofbirth": 1,
                    "religionuid": 1,
                    "contact": 1,
                    "createdat": 1,
                    "orguid": "$orguid.name",
                    "patientimageuid": {
                        $ifNull: ['$patientimageuid', '']
                    },
                    "address": 1,
                    "isvip": 1
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
exports.emr_allergy = function (req, res) {
    var mongoose = require('mongoose')
    // var fromdate = req.body.fromdate || moment().utc().startOf('day').toISOString();
    // var todate = req.body.todate || moment().utc().endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("allergies").aggregate([{
                $match: {
                    "statusflag": "A",
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    // "patientuid": ObjectId("6111539f4915b0001270b1c7"),
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "patientuid": mongoose.Types.ObjectId(req.body.patientuid),
                }
            },
            { $lookup: { from: "patients", localField: "patientuid", foreignField: "_id", as: "patient" } },
            { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$otherallergies", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$foodallergies", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$drugallergies", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "users", localField: "createdby", foreignField: "_id", as: "user" } },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "referencevalues", localField: "patient.titleuid", foreignField: "_id", as: "title" } },
            { $unwind: { path: "$title", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "orderresultitems", localField: "foodallergies.resultitemuid", foreignField: "_id", as: "foodallergie" } },
            { $unwind: { path: "$foodallergie", preserveNullAndEmptyArrays: true } },
            {
                $project:
                {
                    _id: 0,
                    HN: "$patient.mrn",
                    PatientName: {
                        $concat: [
                            { $ifNull: ["$title.valuedescription", ""] }, "",
                            { $ifNull: ["$patient.firstname", ""] }, " ",
                            { $ifNull: ["$patient.middlename", ""] }, " ",
                            { $ifNull: ["$patient.lastname", ""] }
                        ]
                    },
                    DrugAllergies: {
                        $concat: [
                            { $ifNull: ["$drugallergies.freetext", ""] }, " ",
                            { $ifNull: ["$drugallergies.tradename", ""] }, " ",
                            { $ifNull: ["$drugallergies.allergenname", ""] }, " ",
                            { $ifNull: ["$drugallergies.druggroupname", ""] }, " ",
                             { $ifNull: ["$drugallergies.symptoms", ""] }, " ",
                            { $ifNull: ["$drugallergies.comments", ""] }
                        ]
                    },
                    FoodAllergies: {
                        $concat: [
                            { $ifNull: ["$foodallergie.name", ""] }, "",
                            { $ifNull: ["$foodallergies.comments", ""] }
                        ]
                    },
                    OtherAllergies: {
                        $concat: [
                            { $ifNull: ["$otherallergies.freetext", ""] }, "",
                            { $ifNull: ["$otherallergies.comments", ""] }
                        ]
                    },
                    // DrugSymptoms: "$drugallergies.symptoms",
                    // DrugComment: "$drugallergies.comments",
                    // FoodAllergies: "$foodallergie.name",
                    // FoodComment: "$foodallergies.comments",
                    // OtherAllergies: "$otherallergies.freetext",
                    // OtherComment: "$otherallergies.comments",
                    CreateDate: "$createdat",
                    UserRecorded: "$user.name",
            
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
exports.find_mdname = function (req, res) {
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
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    // "patientuid": ObjectId("5a200a6c9318c8bc1eb33390")
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
                    "encounter.relatedvalue": "OPD",
                }
            },
            {
                $unwind: {
                    path: '$visitcareproviders',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'visitcareproviders.careprovideruid',
                    foreignField: '_id',
                    as: 'careprovider'
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
                    // patientvisituid: "$_id",
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
exports.find_department = function (req, res) {
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
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    // "patientuid": ObjectId("5a200a6c9318c8bc1eb33390")
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
                    "encounter.relatedvalue": "OPD",
                }
            },
            {
                $unwind: {
                    path: '$visitcareproviders',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'visitcareproviders.departmentuid',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: {
                    path: '$department',
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $project: {
                    // patientvisituid: "$patientvisituid",
                    depname: "$department.name",
                }
            },
            // {
            //     $match: {
            //         "depname": {
            //             "$nin": [null, ""]
            //         }
            //     }
            // },
            {
                $group: {
                    _id: "$depname"
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
    var {
        orguid,patientuid
    } = req.body;
    // var matchpayoruid = {};

    // if (payoruid && payoruid.length > 0) {
    //     var matchpayoruid = {
    //         'payor._id': ObjectId(payoruid),
    //     }
    // };
    // var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    // var todate = moment(req.body.todate).endOf('day').toISOString();
    var patientuid = req.body.patientuid;
    async.waterfall([
        function get0(callback) {
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
                            "from": "referencevalues",
                            "localField": "entypeuid",
                            "foreignField": "_id",
                            "as": "encounter"
                        }
                    },
                    {
                        "$match": {
                            "encounter.relatedvalue": "OPD",
                        }
                    },
                    {
                        "$lookup": {
                            "from": "referencevalues",
                            "localField": "visitcareproviders.visittypeuid",
                            "foreignField": "_id",
                            "as": "visittypeuid"
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "EN": "$visitid",
                            "startdate": 1,
                            "medicaldischargedate": 1,
                            "enddate": 1,
                            "careprovideruid": '$visitcareproviders.careprovideruid',
                            "departmentuid": '$visitcareproviders.departmentuid',
                            "patientuid": "$patientuid",
                            "patientvisituid": "$_id",
                            "visittype": "$visittypeuid.valuedescription"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "users",
                            "localField": "careprovideruid",
                            "foreignField": "_id",
                            "as": "careprovider"
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
                        "$project": {
                            "_id": 0,
                            "EN": 1,
                            "startdate": 1,
                            "medicaldischargedate": 1,
                            "enddate": 1,
                            "careprovider": '$careprovider.name',
                            "department": '$department.name',
                            "patientuid": 1,
                            "patientvisituid": 1,
                            "visittype": 1
                        }
                    },
                
                
                    {
                        "$project": {
                            "_id": 0,
                            "EN": 1,
                            "startdate": 1,
                            "medicaldischargedate": 1,
                            "enddate": 1,
                            "careprovider": 1,
                            "department": 1,
                            "patientuid": 1,
                            "patientvisituid": 1,
                            "visittype": 1,
                
                        }
                    },
                    {
                        $lookup: {
                            "from": "examinations",
                            "foreignField": "patientvisituid",
                            "localField": "patientvisituid",
                            "as": "examinations"
                        }
                    },
                
                    {
                        "$lookup": {
                            "from": "observations",
                            "localField": "patientvisituid",
                            "foreignField": "patientvisituid",
                            "as": "observations"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "medicalhistories",
                            "localField": "patientvisituid",
                            "foreignField": "patientvisituid",
                            "as": "medicalhistories"
                        }
                    },
                
                    {
                        "$project": {
                            "_id": 0,
                            "EN": 1,
                            "startdate": 1,
                            "medicaldischargedate": 1,
                            "enddate": 1,
                            "careprovider": 1,
                            "department": 1,
                            "patientuid": 1,
                            "patientvisituid": 1,
                            "visittype": 1,
                            "examinations": 1,
                            "observations": 1,
                            "medicalhistories": 1,
                
                        }
                    },
                
                
                ]).toArray((err, docs) => {
                    console.log(docs);
                    // res.status(200).json({
                    //     data: docs
                    // });
                    // db.close();
                    callback(null, docs);
                });
            });
        },

        function get10(doc1, callback) {
            // console.log(doc1);
            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_cchpi(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.cchpis = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get11(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_annotation(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_annotation = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get12(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_clinicalnote(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_clinicalnote = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get13(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_procedure(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_procedure = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get14(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_icd10(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_icd10 = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get15(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_diagnosis(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_diagnosis = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get16(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_patientorder(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_patientorder = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get17(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_patientorderother(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_patientorderother = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get18(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_lab(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_lab = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get19(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_xray(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_xray = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get20(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_vitalsign(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_vs = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
        function get21(doc1, callback) {

            if (doc1 && doc1.length > 0) {
                async.eachOfSeries(doc1, function (episode, index, callback2) {

                    get_va(episode.patientvisituid, function (item1) {
                        // console.log(item1);
                        episode.tmp_va = item1;
                        callback2();
                    });
                }, function () {
                    callback(null, doc1);
                });
            } else {
                callback(null, []);
            }
        },
    ], function (err, doc1) {

        res.status(200).json({
            data: doc1
        });
        console.log('nodata');

    });

    function get_cchpi(patientvisituid, callback) {
        mongoose.connection.collection("cchpis").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("61d7b00ff001bd0051efa0e8"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                "statusflag": "A",
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "modifiedby",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$project": {
                "cchpis": 1,
                "presentillness": 1,
                "user": "$user.name",
                "modifiedat": 1,
            }
        },
        {
            $unwind: {
                path: '$cchpis',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$project": {
                "cchpis": "$cchpis.chiefcomplaint",
                "presentillness": 1,
                "user": 1,
                "modifiedat": 1,
            }
        },
        ]).toArray((err, docs) => {
            // console.log(docs);
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function get_annotation(patientvisituid, callback) {
        mongoose.connection.collection("imageannotations").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("61d7b00ff001bd0051efa0e8"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
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
            // console.log(docs);
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function get_clinicalnote(patientvisituid, callback) {
        mongoose.connection.collection("clinicalnotes").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("61d7b00ff001bd0051efa0e8"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
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
            // console.log(docs);
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function get_procedure(patientvisituid, callback) {
        mongoose.connection.collection("patientprocedures").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("61d7b00ff001bd0051efa0e8"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                "statusflag": "A",
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
            // console.log(docs);
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function get_icd10(patientvisituid, callback) {
        // console.log(patientvisituid.toString());
        mongoose.connection.collection("diagnoses").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
            }
        },
        {
            $unwind: {
                path: '$diagnosis',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                "from": "users",
                "foreignField": "_id",
                "localField": "diagnosis.careprovideruid",
                "as": "careprovideruid"
            }
        },
        {
            $unwind: '$careprovideruid'
        },
        {
            $lookup: {
                "from": "problems",
                "foreignField": "_id",
                "localField": "diagnosis.problemuid",
                "as": "problemuid"
            }
        },
        {
            $unwind: {
                path: "$problemuid",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                "from": "departments",
                "foreignField": "_id",
                "localField": "departmentuid",
                "as": "department"
            }
        },
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true
            }
        },
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
        {
            "$sort": {
                "date": -1
            }
        }
        ]).toArray((err, docs) => {
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('-');
            }
        });
    }
    function get_diagnosis(patientvisituid, callback) {
        // console.log(patientvisituid.toString());
        mongoose.connection.collection("patientvisits").aggregate([{
            "$match": {
                "_id": patientvisituid,
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
            }
        },
        {
            $lookup: {
                from: 'diagnoses',
                localField: '_id',
                foreignField: 'patientvisituid',
                as: 'diagnoses'
            }
        },
        {
            $unwind: {
                path: '$diagnoses',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            "$match": {
                "diagnoses": {
                    $nin: [null]
                }
            }
        },

        {
            $unwind: {
                path: '$diagnoses.diagnosis',
                preserveNullAndEmptyArrays: true
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
            $unwind: {
                path: '$diagnoses.diagnosis.problemuid',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$lookup": {
                "from": "referencevalues",
                "localField": "diagnoses.diagnosis.comorbidityuid",
                "foreignField": "_id",
                "as": "comorbidityuid"
            }
        },
        {
            $unwind: {
                path: '$comorbidityuid',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$match": {
                "diagnoses.diagnosis.isprimary": false
            }
        },
        {
            "$project": {
                icd10other: "$diagnoses.diagnosis.problemuid.name",
            }
        },
        ]).limit(5).toArray((err, docs) => {
            // console.log(docs);
            if (docs && docs.length > 0) {
                var mitem = '';
                for (var i = 0; i < docs.length; i++) {
                    if (i == 0) {
                        mitem = docs[i].icd10other || '';
                    } else {
                        mitem = mitem + ',' + (docs[i].icd10other || '');
                    }

                }
                callback(mitem);
            } else {
                callback('-');
            }
        });
    }
    function get_patientorder(patientvisituid, callback) {
        mongoose.connection.collection("patientorders").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("61d7b00ff001bd0051efa0e8"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
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
            // console.log(docs);
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function get_patientorderother(patientvisituid, callback) {
        mongoose.connection.collection("patientorders").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "orguid": mongoose.Types.ObjectId(orguid),
                // "patientvisituid": ObjectId("61d7b00ff001bd0051efa0e8"),
                // "orguid": ObjectId("5faa3d95f71034497f38a208"),
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
            // console.log(docs);
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function get_lab(patientvisituid, callback) {
        // console.log(patientvisituid.toString());
        mongoose.connection.collection("labresults").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
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
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('-');
            }
        });
    }
    function get_xray(patientvisituid, callback) {
        // console.log(patientvisituid.toString());
        mongoose.connection.collection("patientorders").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
                "patientorderitems": {
                    $elemMatch: {
                        ordercattype: {
                            "$in": ["RADIOLOGY"]
                        }
                    }
                },
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
            if (docs && docs.length > 0) {
                callback(docs);
            } else {
                callback('-');
            }
        });
    }
    function get_vitalsign(patientvisituid, callback) {
        // console.log(patientvisituid.toString());
        mongoose.connection.collection("observations").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
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
            if (docs && docs.length > 0) {
                var get_vs = docs;
                var get_vstxt = "";
                var sbp = "";
                var dbp = "";
                var uom = "";
                for (var i = 0; i < get_vs.length; i++) {
                  if (get_vs[i].observationvalue.name == "Systolic BP") {
                    sbp = get_vs[i].observationvalue.resultvalue;
                    uom = get_vs[i].observationvalue.uomuid;
                  } else if (get_vs[i].observationvalue.name == "Diastolic BP") {
                    dbp = get_vs[i].observationvalue.resultvalue;
                  } else if (
                    get_vs[i].observationvalue.name == "O2 saturation level"
                  ) {
                    get_vstxt =
                      get_vstxt +
                      " O sat " +
                      get_vs[i].observationvalue.resultvalue +
                      " " +
                      get_vs[i].observationvalue.uomuid +
                      " , ";
                  } else if (get_vs[i].observationvalue.name == "BMI") {
                    get_vstxt =
                      get_vstxt +
                      " BMI " +
                      get_vs[i].observationvalue.resultvalue +
                      " " +
                      get_vs[i].observationvalue.uomuid +
                      " , ";
                  } else if (get_vs[i].observationvalue.name == "BSA") {
                    get_vstxt =
                      get_vstxt +
                      " BSA " +
                      get_vs[i].observationvalue.resultvalue +
                      " " +
                      get_vs[i].observationvalue.uomuid +
                      " , ";
                  } else if (get_vs[i].observationvalue.name == "MAP") {
                    get_vstxt =
                      get_vstxt +
                      " MAP " +
                      get_vs[i].observationvalue.resultvalue +
                      " " +
                      get_vs[i].observationvalue.uomuid +
                      " , ";
                  } else {
                    get_vstxt =
                      get_vstxt +
                      get_vs[i].observationvalue.name.substring(0, 1) +
                      " " +
                      get_vs[i].observationvalue.resultvalue +
                      " " +
                      get_vs[i].observationvalue.uomuid +
                      " , ";
                  }
                 var item =
                    get_vstxt + " BP " + sbp + "/" + dbp + " " + uom;
                }
                callback(item);
            } else {
                callback('');
            }
        });
    }
    function get_va(patientvisituid, callback) {
        // console.log(patientvisituid.toString());
        mongoose.connection.collection("observations").aggregate([{
            "$match": {
                "patientvisituid": patientvisituid,
                "statusflag": "A",
                "orguid": mongoose.Types.ObjectId(orguid),
                "orderitemuid": mongoose.Types.ObjectId("60f8c4547c0cbc00141808c5"),
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
            if (docs && docs.length > 0) {
            
                callback(docs);
            } else {
                callback('');
            }
        });
    }
    function calage(sTime) {
        if (sTime) {
            var startTime = moment(sTime);
            var endTime = moment(new Date());
            var duration = moment.duration(endTime.diff(startTime));
            var years = duration.years();
            mtime = years;
        } else {
            mtime = 0;
        }
        return mtime;
    }

    function findmonth(item) {
        switch (item) {

            case '01':
                var mtime = 'มกราคม'
                break;
            case '02':
                var mtime = 'กุมภาพันธ์'
                break;
            case '03':
                var mtime = 'มีนาคม'
                break;
            case '04':
                var mtime = 'เมษายน'
                break;
            case '05':
                var mtime = 'พฤษภาคม'
                break;
            case '06':
                var mtime = 'มิถุนายน'
                break;
            case '07':
                var mtime = 'กรกฎาคม'
                break;
            case '08':
                var mtime = 'สิงหาคม'
                break;
            case '09':
                var mtime = 'กันยายน'
                break;
            case '10':
                var mtime = 'ตุลาคม'
                break;
            case '11':
                var mtime = 'พฤศจิกายน'
                break;
            case '12':
                var mtime = 'ธันวาคม'
                break;
            default:
                break;
        }
        return mtime;
    }

    function findyear(item) {
        // console.log(item);
        var mbc = parseInt(item) + 543;
        return mbc;
    }
}
exports.find_appointment_dr = function (req, res) {
    var {
        fromdate,
        todate,
        orguid,
        careprovideruid,
        showallappoint
    } = req.body;
    console.log(todate);
    if (todate == undefined) {
        var fromdate = moment(fromdate).startOf('day').toISOString();
        if (careprovideruid == '' || showallappoint=='true' ) {
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
        if (careprovideruid == '' || showallappoint=='true') {
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
//------------------------------------------------------

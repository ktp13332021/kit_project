var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var md5 = require('md5');
// var dbpath = 'mongodb://incusdba:incus%40123@192.168.9.22,192.168.9.23,192.168.9.24/arcusairdb?replicaSet=set1';
// user: "incusdba",
// pass: "incus@123",
// var dbpath = 'mongodb://incusdba:incus%40123@192.168.9.22,192.168.9.23,192.168.9.24/arcusairdb?authMechanism=SCRAM-SHA-1&authSource=arcusairdb';
// var dbpath = 'mongodb://centrix:abc%40123@demo.humancentric.info/centrixdb';
var dbpath = require('../config/db').dbpath;

exports.singleID_natID = function (req, res) {
    // var mongoose = require('mongoose')

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    nationalid: req.body.nationalid,
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
exports.singleID_hn = function (req, res) {
    // var mongoose = require('mongoose')

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    mrn: req.body.HN,
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
exports.find_natID = function (req, res) {
    // var mongoose = require('mongoose')

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patients").aggregate([{
                $match: {
                    "statusflag": "A",
                    mrn: req.body.HN,
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
exports.get_vitalsign = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("observations").aggregate([

            {
                $match: {
                    
                    "orguid": mongoose.Types.ObjectId(orguid),
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
exports.find_getmed_today = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientorders").aggregate([{
                $match: {
                    "statusflag": "A",
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
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
        dbo.collection("patientvisits").aggregate([{
                $match: {
                    "statusflag": "A",
                    visitid: EN
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
            {
                $unwind: {
                    path: "$patientorders",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$patientorders.patientorderitems",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    "patientorders.patientorderitems.ordercattype": {
                        "$in": ["RADIOLOGY"]
                    }
                }
            },
            {
                $lookup: {
                    from: "radiologyresults",
                    localField: "patientorders.patientorderitems._id",
                    foreignField: "patientorderitemuid",
                    as: "radiologyresults"
                }
            },
            {
                $unwind: {
                    path: "$radiologyresults",
                    preserveNullAndEmptyArrays: true
                }
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
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                data: docs
            });
            db.close();
        });
    });
}
exports.findlab_byvisitID = function (req, res) {
    var mongoose = require('mongoose')
    var patientvisituid = req.body.patientvisituid;
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("labresults").aggregate([{
                $match: {
                    "statusflag": "A",
                    "patientvisituid": mongoose.Types.ObjectId(patientvisituid)
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
// exports.find_getmed_today = function (req, res) {
//     var mongoose = require('mongoose')
//     var patientvisituid = req.body.patientvisituid;
//     MongoClient.connect(dbpath, (connectErr, db) => {
//         var dbo = db;
//         dbo.collection("patientorder").aggregate([
//             {
//                 $match: {
//                     "patientvisituid": mongoose.Types.ObjectId(patientvisituid),
//                 }
//             },
//             {
//                 $unwind: { path: "$patientorderitems", preserveNullAndEmptyArrays: true }
//             },
//             {
//                 $match: {
//                     "patientorderitems.ordercattype": { "$in": ["MEDICINE"] }
//                 }
//             },
//             {
//                 $lookup: { from: "referencevalues", localField: "patientorderitems.statusuid", foreignField: "_id", as: "patientorderitems.statusuid" }
//             },
//             {
//                 $unwind: "$patientorderitems.statusuid"
//             },
//             {
//                 $lookup: { from: "referencevalues", localField: "patientorderitems.quantityUOM", foreignField: "_id", as: "patientorderitems.quantityUOM" }
//             },
//             {
//                 $unwind: "$patientorderitems.quantityUOM"
//             },
//             {
//                 $lookup: { from: "referencevalues", localField: "patientorderitems.dosageUOM", foreignField: "_id", as: "patientorderitems.dosageUOM" }
//             },
//             {
//                 $unwind: "$patientorderitems.dosageUOM"
//             },
//             {
//                 $lookup: { from: "frequencies", localField: "patientorderitems.frequencyuid", foreignField: "_id", as: "patientorderitems.frequencyuid" }
//             },
//             {
//                 $unwind: "$patientorderitems.frequencyuid"
//             },
//             // {
//             //     $project: {
//             //         patientvisituid: "$patientvisituid",
//             //         entypeuid: "$entypeuid",
//             //         ordernumber: "$ordernumber",
//             //         ordercattype: "$patientorderitems.ordercattype",
//             //         orderitemname: "$patientorderitems.orderitemname",
//             //         status: "$patientorderitems.statusuid.valuedescription"
//             //     }
//             // },
//             {
//                 $match:
//                 {
//                     status: { $nin: ["Cancelled"] }
//                 }
//             }
//         ]).toArray((err, docs) => {
//             console.log(docs);
//             res.status(200).json({ patientorder: docs });
//             db.close();
//         });
//     });
// }
exports.singleID_allergy1 = function (req, res) {
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
exports.singleID_allergy = function (req, res) {
    var patientuid = req.body.patientuid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("allergies").aggregate([{
                "$match": {
                    "statusflag": "A",
                    "patientuid": mongoose.Types.ObjectId(patientuid),
                    // "patientuid": ObjectId("5e1fdecef197ff3a93a9b777"),

                }
            },
            {
                $unwind: {
                    path: "$drugallergies",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$match": {
                    "drugallergies.isactive": true,
                }
            },
            {
                $project: {
                    druggroupname: "$drugallergies.druggroupname",
                    freetext: "$drugallergies.freetext",
                    allergenname: "$drugallergies.allergenname",
                    symptoms: "$drugallergies.symptoms",
                    createdon: "$createdat",
                    tradename: "$drugallergies.tradename",

                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
          
            async.waterfall([
                function get1(callback) {
                    ret1 = [];

                    for (i = 0; i < docs.length; i++) {
                        if (docs[i].allergenname != null && docs[i].allergenname.toString() != '' && docs[i].allergenname.toString() != ',') {
                            ret1.push({
                                date: docs[i].cdate || '',
                                allergen: docs[i].allergenname,
                                symptoms: docs[i].symptoms || '',
                            });
                        }
                    }
                    // console.log(ret1);

                    callback();

                },
                function get2(callback) {
                    ret2 = [];

                    for (i = 0; i < docs.length; i++) {
                        if (docs[i].druggroupname && docs[i].druggroupname.toString() != '' && docs[i].druggroupname.toString() != null) {
                            ret2.push({
                                date: docs[i].cdate || '',
                                allergen: docs[i].druggroupname,
                                symptoms: docs[i].symptoms || '',
                            });
                        }

                    }
                    // console.log(ret2);
                    callback();

                },
                function get3(callback) {
                    ret3 = [];

                    for (i = 0; i < docs.length; i++) {
                        if (docs[i].tradename && docs[i].tradename.toString() != '' && docs[i].tradename.toString() != null) {
                            ret3.push({
                                date: docs[i].cdate || '',
                                allergen: docs[i].tradename,
                                symptoms: docs[i].symptoms || '',
                            });
                        }

                    }
                    // console.log(ret3);
                    callback();

                },
                function get4(callback) {
                    ret4 = [];

                    for (i = 0; i < docs.length; i++) {
                        if (docs[i].freetext && docs[i].freetext.toString() != '' && docs[i].freetext.toString() != null) {
                            ret4.push({
                                date: docs[i].cdate || '',
                                allergen: docs[i].freetext,
                                symptoms: docs[i].symptoms || '',
                            });
                        }

                    }
                    // console.log(ret4);
                    callback();

                },
                function get4(callback) {
                    obj = ret1.concat(ret2);
                    obj1 = obj.concat(ret3);
                    obj2 = obj1.concat(ret4);

                    callback();
                },
            ], function () {
                // console.log(obj2);

                obj2.sort(function (a, b) {
                    let AA = a.HN;
                    let BB = b.HN;
                    if (AA < BB) {
                        return -1;
                    } else if (AA > BB) {
                        return 1;
                    }
                    return 0;
                });

                // console.log(obj2);
                ret = [];

                for (i = 0; i < obj2.length; i++) {
                    ret.push({
                        NO: i + 1,
                        date: obj2[i].date || '',
                        allergen: obj2[i].allergen || '',
                        symptoms: obj2[i].symptoms || '',
                    });
                }
            })

            console.log(ret);
            res.status(200).json({
                allergy: ret
            });

        });
    })
}
exports.find_user = function (req, res) {
    var mongoose = require('mongoose')
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    // "orderdate": { $gte: new Date(fromdate), $lte: new Date(todate) }
                    // "orderdate": { $gte: ISODate("2018-08-21T00:00:00Z"), $lte: ISODate("2018-08-21T23:59:59Z") },
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
        }, ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}

exports.find_username = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    "activeto": null,
                    // 'iscareprovider': true,
                    "_id": mongoose.Types.ObjectId(req.body.ID),
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
                data: docs
            });
            db.close();
        });
    });
}

exports.find_user_all = function (req, res) {
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([

            {
                $match: {
                    "statusflag": "A",
                    "activeto": null,
                    'iscareprovider': true,

                }
            },

            // {
            //     $lookup: { from: "referencevalues", localField: "titleuid", foreignField: "_id", as: "titleuid" }
            // },
            // {
            //     $unwind: { path: "$titleuid", preserveNullAndEmptyArrays: true }
            // },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({
                users: docs
            });
            db.close();
        });
    });
}
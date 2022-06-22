var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;

exports.findicd10 = function (req, res) {
    var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    var todate = moment(req.body.todate).endOf('day').toISOString();

    mongoose.connection.collection("patientvisits").aggregate([
        {
            "$match": {
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                // "entypeuid": mongoose.Types.ObjectId(req.body.entypeuid),
                "statusflag": "A",
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
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
            $match: {
                "diagnoses": { $gt: [] },
    
            }
        },
        { "$unwind": { path: "$diagnoses", preserveNullAndEmptyArrays: true } },
    
    
        { $lookup: { from: "problems", foreignField: "_id", localField: "diagnoses.diagnosis.problemuid", as: "problemuid" } },
        { $unwind: { path: '$problemuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'problemuid.codingschemeuid', foreignField: '_id', as: 'codingschemeuid' } },
        { $unwind: { path: '$codingschemeuid', preserveNullAndEmptyArrays: true } },
    
        {
            "$match": {
                "codingschemeuid.valuedescription": { $eq: 'ICD 10' },
            }
        },
        { $lookup: { from: 'patientbills', localField: '_id', foreignField: 'patientvisituid', as: 'patientbills' } },
        { $unwind: { path: '$patientbills', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
                EN: "$visitid",
                diagcode: "$problemuid.code",
                diagname: "$problemuid.name",
                diagdesc: "$problemuid.description",
                diagtext: "$diagnoses.diagnosistext",
                totalbillamount: { $ifNull: ["$patientbills.totalbillamount", 0] },
    
            }
        },
        {
            $addFields:
            {
                case:
                {
                    $cond: {
                        if: { $eq: [{ $ifNull: ["$totalbillamount", 0] }, 0] },
                        then: 0,
                        else: 1
                    }
                }
            }
        },
        {
            "$group": {
                "_id": { "_id": "$diagcode" },
                "diagname": { $first: "$diagname" },
                "billamount": { $sum: "$totalbillamount" },
                "count": { $sum: "$case" },
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
    ]).toArray((err, docs) => {

        if (docs && docs.length > 0) {
            console.log(docs);

            var ret = [];
            Object.keys(docs).forEach(function (key) {
                var eachkey = docs[key];
                ret.push({
                    code: key._id,
                    icd: eachkey.diagname,
                    count: eachkey.count,
                    avg_cost: parseInt(eachkey.billamount/eachkey.count),
                });
            });
            ret = ret.slice(0, 10);
            console.log(ret);
            res.status(200).json({ results: ret });

        } else {
            res.status(200).json({ results: [] });
            console.log('nodata');
        }
    });
}
exports.findicd9 = function (req, res) {
    var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    var todate = moment(req.body.todate).endOf('day').toISOString();

    mongoose.connection.collection("orrecords").aggregate([
        {
            "$match": {
                "orguid": mongoose.Types.ObjectId(req.body.orguid),
                // "entypeuid": mongoose.Types.ObjectId(req.body.entypeuid),
                "statusflag": "A",
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        { $lookup: { from: "patientprocedures", localField: "patientvisituid", foreignField: "patientvisituid", as: "procedureuid" } },
        { $unwind: { path: "$procedureuid", preserveNullAndEmptyArrays: true } },
        { $lookup: { from: "procedures", localField: "procedureuid.procedures.procedureuid", foreignField: "_id", as: "procedureuid" } },
        { $unwind: { path: '$procedureuid', preserveNullAndEmptyArrays: true } },
        {
            "$match": {
                "procedureuid.code": { $nin: [null] },
            }
        },
        { $lookup: { from: 'patientbills', localField: '_id', foreignField: 'patientvisituid', as: 'patientbills' } },
        { $unwind: { path: '$patientbills', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 0,
    
                procedurecode: "$procedureuid.code",
                procedurename: "$procedureuid.name",
                totalbillamount: { $ifNull: ["$patientbills.totalbillamount", 0] },
    
            }
        },
        {
            $addFields:
            {
                case:
                {
                    $cond: {
                        if: { $eq: [{ $ifNull: ["$totalbillamount", 0] }, 0] },
                        then: 0,
                        else: 1
                    }
                }
            }
        },
        {
            "$group": {
                "_id": { "_id": "$procedurecode" },
                "procedurename": { $first: "$procedurename" },
                "billamount": { $sum: "$totalbillamount" },
                "count": { $sum: "$case" },
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
    ]).toArray((err, docs) => {

        if (docs && docs.length > 0) {
            console.log(docs);

            var ret = [];
            Object.keys(docs).forEach(function (key) {
                var eachkey = docs[key];
                ret.push({
                    code: key._id,
                    icd: eachkey.procedurename,
                    count: eachkey.count,
                    avg_cost: parseInt(eachkey.billamount/eachkey.count),
                });
            });

            console.log(ret);
            ret = ret.slice(0, 10);
            res.status(200).json({ results: ret });

        } else {
            res.status(200).json({ results: [] });
            console.log('nodata');
        }
    });
}
exports.or = function (req, res) {
    var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    var todate = moment(req.body.todate).endOf('day').toISOString();
            mongoose.connection.collection("patientforms").aggregate([{
                    "$match": {
                        "orguid": mongoose.Types.ObjectId(req.body.orguid),
                        "createdat": {
                            $gte: new Date(fromdate),
                            $lte: new Date(todate)
                        },
                        "statusflag": "A",
                        // "patientuid" : ObjectId("6122195861bcb00014e0cc0d"),
                        // "orguid": ObjectId("569794170946a3d0d588efe6"),
                        // "createdat": { $gte: ISODate("2021-10-01T00:00:00.000+07:00"), $lte: ISODate("2021-10-30T23:59:59.000+07:00") },
                    }
                },
                {
                    "$lookup": {
                        "from": "formtemplates",
                        "foreignField": "_id",
                        "localField": "templateuid",
                        "as": "templateuid"
                    }
                },
                {
                    $unwind: {
                        path: '$templateuid',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$match": {
                        "templateuid.code":req.body.code,
                        // "templateuid.code":{ $in : ['109','024','025','026','44','16','24']},
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "year": { "$year": [{ "$add": ["$createdat", 420 * 60 * 1000] }] },
                            "month": { "$month": [{ "$add": ["$createdat", 420 * 60 * 1000] }] },
                            "day": { "$dayOfMonth": { "$add": ["$createdat", 420 * 60 * 1000] } }
                
                        },
                        "first": { "$min": "$createdat" },
                        "count": { "$sum": 1 }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "createdat": "$first",
                        "count": "$count"
                    }
                },
                {
                    "$sort": {
                        "createdat": 1.0
                    }
                }
                
            ]).toArray((err, docs) => {
                console.log('docs', docs);
                var ret = [];
                for (i = 0; i < docs.length; i++) {
    
                    ret.push({
                        // No: i + 1,
                        date: moment(docs[i].createdat).format('DD/MM/YYYY'),
                        count: docs[i].count,
                       
                    });
    
                }
    
                res.status(200).json({
                    data: ret
                });
            });

}


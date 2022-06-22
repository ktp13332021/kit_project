var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
// var md5 = require('md5');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;

exports.search_pt_by_dep = function (req, res) {

    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([
            {
                "$match": {
                    // "orguid": ObjectId("5faa3d95f71034497f38a208"),
                    // "startdate": { $gte: ISODate("2022-01-29T00:00:00.000+07:00"), $lte: ISODate("2022-01-29T23:59:59.000+07:00") },
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "startdate": {
                        $gte: new Date(fromdate),
                        $lte: new Date(todate)
                    }
                }
            },
            {
                "$unwind": {
                    path: "$visitcareproviders",
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
                "$unwind": "$department"
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "visitcareproviders.careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovideruid"
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
                    from: 'patients',
                    localField: 'patientuid',
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
            { $addFields: { visitjourney: { $last: "$visitjourneys" } } },
            {
                $lookup: {
                    from: 'referencevalues',
                    localField: 'visitjourney.statusuid',
                    foreignField: '_id',
                    as: 'statusuid'
                }
            },
            {
                "$unwind": {
                    path: "$statusuid",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "visitjourney.departmentuid",
                    "foreignField": "_id",
                    "as": "currentdepartment"
                }
            },
            {
                "$unwind": "$currentdepartment"
            },
            {
                $addFields: {
                    "visitpayors": {
                        $filter: {
                            input: "$visitpayors",
                            as: "visitpayor",
                            cond: {
                                $eq: ["$$visitpayor.orderofpreference", {
                                    $min: "$visitpayors.orderofpreference"
                                }]
                            }
                        }
                    },
                }
            },
            {
                $unwind: {
                    path: '$visitpayors',
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
                $unwind: {
                    path: '$payoruid',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "patientvisituid": "$_id",
                    "patientuid": "$patientuid._id",
                    "department": "$department.name",
                    "currentdepartment": "$currentdepartment.name",
                    "departmentuid": "$department._id",
                    "careprovider": "$careprovideruid.name",
                    "careprovideruid": "$careprovideruid._id",
                    "HN": "$patientuid.mrn",
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
                    dob: {
                        $ifNull: ["$patientuid.dateofbirth", '']
                    },
                    "EN": "$visitid",
                    "visitjourney": "$statusuid.valuedescription",
                    "payor": "$payoruid.name"
                }
            },
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.form_template = function (req, res) {

    // var visitdate = req.body.visitdate;
    // var fromdate = moment(visitdate).startOf('day').toISOString();
    // var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("formtemplates").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",
                    "activeto": null,
                    //  "name" : { $regex : new RegExp('^amoxy', 'i')}
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "code": 1,
                    "name": 1,
                }
            },
            {
                "$sort": {
                    "code": 1
                }
            }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.find_allform = function (req, res) {

    // var visitdate = req.body.visitdate;
    // var fromdate = moment(visitdate).startOf('day').toISOString();
    // var todate = moment(visitdate).endOf('day').toISOString();

    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientforms").aggregate([
            {
                "$match": {
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "statusflag": "A",

                    //  "name" : { $regex : new RegExp('^amoxy', 'i')}
                }
            },
            {
                "$lookup": {
                    "from": "departments",
                    "localField": "departmentuid",
                    "foreignField": "_id",
                    "as": "departmentuid"
                }
            },
            {
                "$unwind": "$departmentuid"
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "careprovideruid",
                    "foreignField": "_id",
                    "as": "careprovideruid"
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
                    from: 'patients',
                    localField: 'patientuid',
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
                "$lookup": {
                    "from": "formtemplates",
                    "localField": "templateuid",
                    "foreignField": "_id",
                    "as": "templateuid"
                }
            },
            {
                "$unwind": "$templateuid"
            },
            {
                "$project": {
                    "_id": 1,
                    "formID": 1,
                    "patientuid": "$patientuid._id",
                    "patientvisituid": 1,
                    "templatecode": "$templateuid.code",
                    "templatename": "$templateuid.name",
                    "department": "$departmentuid.name",
                    "departmentuid": "$departmentuid._id",
                    "careprovider": "$careprovideruid.name",
                    "careprovideruid": "$careprovideruid._id",
                    "HN": "$patientuid.mrn",
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
                    dob: {
                        $ifNull: ["$patientuid.dateofbirth", '']
                    },
                    "EN": "$visitid",
                    "formdate": 1,
                }
            },
            // {
            //     "$sort": {
            //         "code": 1
            //     }
            // }
        ]).toArray((err, docs) => {
            console.log(docs);
            res.status(200).json({ data: docs });
            db.close();
        });
    });
}
exports.query_form = function (req, res) {

    var orguid = req.body.orguid;
    mongoose.connection.collection("patientforms").aggregate([{
        $match: {
            // "orguid": mongoose.Types.ObjectId(orguid),

            statusflag: "A",
            "formtitle": "บันทึกการให้คำปรึกษาด้านยา",
            "patientuid": ObjectId("610bf84702b5f90013c11261"),
            "patientvisituid": ObjectId("610bf84702b5f90013c11267"),
            "orguid": ObjectId("5faa3d95f71034497f38a208"),
        }
    },
    {
        $lookup: {
            from: 'patients',
            localField: 'patientuid',
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
            _id: 0,
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
            date: '$formdate',
            formsections: 1,
            att1: {
                $ifNull: [{
                    $arrayElemAt: ["$formsections.attributes.displaytext", 0]
                }, '']
            },
            data: {
                $ifNull: [{
                    $arrayElemAt: ["$formsections.attributes.datavalue", 0]
                }, '']
            },
        }
    },

    ]).toArray((err, docs) => {
        if (docs && docs.length > 0) {
            for (var i = 0; i < docs.length; i++) {
                var ret = [];
                for (var ii = 0; ii < docs[i].att1.length; ii++) {
                    var t1 = docs[i].att1[ii];
                    var m1 = docs[i].data[ii];
                    var m11 = m1.replace(/\"/g, '');
                    ret.push({
                        // "NO": index + 1,
                        [t1]: m11
                    });
                    docs[i].newdata = ret;
                }
            }
            console.log(docs);
            res.status(200).json({
                results: docs
            });
        } else {
            res.status(200).json({
                results: []
            });
            console.log('nodata');
        }
    });

}
exports.pt_tracking = function (req, res) {
    // var fromdate = moment(req.body.fromdate).startOf('day').toISOString();
    // var todate = moment(req.body.todate).endOf('day').toISOString();
    async.waterfall([
        function get0(callback) {
            mongoose.connection.collection("patients").aggregate([{
                "$match": {
                    "statusflag": "A",
                    "orguid": mongoose.Types.ObjectId(req.body.orguid),
                    "mrn": req.body.HN,
                }
            },
            ]).toArray((err, patient) => {
                callback(null, patient);
            });
        },
        function get1(patient, callback) {
            if (patient && patient.length > 0) {
                mongoose.connection.collection("patientvisits").aggregate([{
                    "$match": {
                        "patientuid": patient[0]._id,
                        "orguid": mongoose.Types.ObjectId(req.body.orguid),
                        "statusflag": "A",
                    }
                },
                {
                    "$sort": {
                        "startdate": -1
                    }
                },
                ]).toArray((err, patientvisit) => {
                    callback(null, patientvisit);
                    console.log(patientvisit[0]._id.toString())
                });
            } else {
                res.status(200).json({
                    data: []
                });
            }
        },
        function get2(patientvisit, callback) {
            if (patientvisit && patientvisit.length > 0) {
                mongoose.connection.collection("patientvisits").aggregate([{
                    "$match": {
                        "_id": patientvisit[0]._id,
                        "orguid": mongoose.Types.ObjectId(req.body.orguid),
                        "statusflag": "A",
                    }
                },
                {
                    "$unwind": {
                        path: "$visitjourneys",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "visitjourneys": 1,

                    }
                },
                {
                    "$lookup": {
                        "from": "departments",
                        "localField": "visitjourneys.departmentuid",
                        "foreignField": "_id",
                        "as": "department"
                    }
                },
                {
                    "$unwind": "$department"
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "visitjourneys.careprovideruid",
                        "foreignField": "_id",
                        "as": "careprovideruid"
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
                        from: 'referencevalues',
                        localField: 'visitjourneys.statusuid',
                        foreignField: '_id',
                        as: 'statusuid'
                    }
                },
                {
                    $unwind: {
                        path: '$statusuid',
                        preserveNullAndEmptyArrays: true
                    }
                },
                ]).toArray((err, docs) => {

                    console.log(docs);
                    // if (docs && docs.length > 0) {
                    //     for (var ii = 0; ii < docs.length; ii++) {
                    //         // var dd = moment(docs[ii].discharge).add(-1, 'days');
                    //         // var d1 = moment(dd).format("YYYY-MM-DD") + "T23:59:59.000+07:00";
                    //         docs[ii].ptday = calptday(docs[ii].admit, docs[ii].discharge);
                    //     }

                    //     console.log('docs', docs);
                    //     var sumtable = _.groupBy(docs, function (value) {
                    //         return value.wardcode;
                    //     });
                    //     console.log('sumtable', sumtable);
                    //     var ret = [];
                    //     Object.keys(sumtable).forEach(function (key) {
                    //         var eachkey = sumtable[key];
                    //         var mptday = 0;
                    //         for (var i = 0; i < eachkey.length; i++) {
                    //             mptday = mptday + eachkey[i].ptday;
                    //         }
                    //         ret.push({
                    //             'wardcode': eachkey[0].wardcode,
                    //             'wardname': eachkey[0].wardname,
                    //             'ptday': mptday
                    //         });
                    //     });
                    //     console.log('ret', ret);

                    //     for (var i = 0; i < wardtemplate.length; i++) {
                    //         for (var j = 0; j < ret.length; j++) {
                    //             if (ret[j].wardcode == wardtemplate[i].wardcode) {
                    //                 wardtemplate[i].ptday = ret[j].ptday;

                    //             }
                    //         }
                    //     }
                    //     var ret2 = [];
                    //     Object.keys(wardtemplate).forEach(function (key) {
                    //         var eachkey = wardtemplate[key];
                    //         ret2.push({
                    //             'หอผู้ป่วย': eachkey.ward,
                    //             'จำนวนวันนอน': eachkey.ptday || 0,
                    //         });
                    //     });

                    //     res.status(200).json({
                    //         results: ret2
                    //     });
                    // } else {
                    //     res.status(200).json({
                    //         results: []
                    //     });
                    //     console.log('nodata');
                    // }
                    // callback(null, docs);
                    res.status(200).json({
                        data: docs
                    });
                });
            } else {
                res.status(200).json({
                    data: []
                });
            }
        },


    ], function (err, result) {

    });

    // function calptday(fromd, tod) {
    //     var startDate = moment(fromd);
    //     var endDate = moment(tod);
    //     var duration = moment.duration(endDate.diff(startDate));
    //     var mhour = duration.asHours();
    //     var mday = parseInt(duration.asDays()+0.5);

    //     var h1 = parseInt(moment(fromd).format('HH'));
    //     var h2 = parseInt(moment(tod).format('HH'));
    //     var totalhour = h2 - h1;

    //     var d1=moment(fromd).format('YYYY/MM/DD');
    //     var d2=moment(tod).format('YYYY/MM/DD');

    //     if (d1 != d2) {
    //         if (totalhour >= 6) {
    //             totalday = mday+1;
    //         } else {
    //             totalday = mday;
    //         }
    //     } else {
    //         totalday = 1;
    //     }

    //     return totalday;
    // }
}


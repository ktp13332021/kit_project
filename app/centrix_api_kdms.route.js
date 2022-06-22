var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;

exports.api1 = function (req, res) {
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            "$match": {
                "orguid": mongoose.Types.ObjectId(orguid),
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
exports.userlogin = function (req, res) {
    var orguid = req.body.orguid;
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("loginsessions").aggregate([{
            "$match": {
                "orguid": mongoose.Types.ObjectId(orguid),
                "statusflag": "A",
                "createdat": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "useruid",
                "foreignField": "_id",
                "as": "users"
            }
        },
        {
            "$unwind": "$users"
        },
        {
            "$lookup": {
                "from": "departments",
                "localField": "departmentuid",
                "foreignField": "_id",
                "as": "departments"
            }
        },
        {
            "$unwind": "$departments"
        },
        {
            "$lookup": {
                "from": "roles",
                "localField": "roleuid",
                "foreignField": "_id",
                "as": "roles"
            }
        },
        {
            "$unwind": "$roles"
        },
        {
            "$project": {
                "_id": 0,
                "Useruid":  "$users.loginid",
                "Password": "",
                "Name": "$users.name",
                "Role": "$roles.name",
                "Department": "$departments.name",
                "Nursestation": "",
                "Doctor": { $cond: { if: { $eq: ["$users.iscareprovider", true] }, then: 'Y', else: 'N' } },
                "Nurse": '',
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
exports.afterregistration = function (req, res) {
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            "$match": {
                "orguid": mongoose.Types.ObjectId(orguid),
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
                // "patientuid.mrn": "01-21-000659",
                "patientuid.mrn": HN ? HN : { $ne: null },
            }
        },
        {
            $unwind: {
                path: "$visitcareproviders",
                preserveNullAndEmptyArrays: true
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
            $unwind: {
                path: "$careprovideruid",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            "$project": {
                // "useruid": "$createdby",
                // "patientvisituid": "$_id",
                // "patientuid": "$patientuid._id",
                // "visitid": 1,
                "patientname": {
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
                    $ifNull: ['$visitid', '']
                },
                "startdate": 1,
                "departmentuid": "$department._id",
                "departmentname": "$department.name",
                "drcode": "$careprovideruid.code",
                "drname": "$careprovideruid.name",
                "medicaldischargedate": 1,
                "patientorders": {
                    $filter: {
                        input: "$patientorders.patientorderitems",
                        as: "patientorder",
                        cond: {
                            $in: ["$$patientorder.ordercattype", ["MEDICINE", "SUPPLY"]]
                        }
                    }
                },
            }
        },
        ]).toArray((err, docs) => {
            console.log(docs);
            var ret = [];
            Object.keys(docs).forEach(function (key) {
                var eachkey = docs[key];
                if (eachkey.medicaldischargedate) {
                    var mstatus = true;
                } else {
                    var mstatus = false;
                }
                if (eachkey.patientorders && eachkey.patientorders != []) {
                    var mcheckorder = true;
                } else {
                    var mcheckorder = false;
                }
                ret.push({
                    "patientname": eachkey.patientname,
                    "HN": eachkey.HN,
                    "AN": eachkey.AN,
                    "startdate": eachkey.startdate,
                    "departmentuid": eachkey.departmentuid,
                    "departmentname": eachkey.departmentname,
                    "drcode": eachkey.drcode,
                    "drname": eachkey.drname,
                    "patientname": eachkey.patientname,
                    "status": mstatus,
                    "checkorder": mcheckorder,
                });

            });
            res.status(200).json({
                data: ret
            });
            db.close();
        });
    });
}

exports.afterregistrationV1 = function (req, res) {
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    var visitdate = req.body.visitdate;

    if (!visitdate) return res.status(500).json({ "error": "visitdate is required" });
    if (!orguid) return res.status(500).json({ "error": "orguid is required" });

    var fromdate = moment(visitdate).startOf('day');
    var todate = moment(visitdate).endOf('day');

    mongoose.connection.collection('patientvisits').aggregate([
        {
            $match: {
                orguid: mongoose.Types.ObjectId(orguid),
                statusflag: 'A',
                startdate: {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        {
            $project: {
                visitid: 1,
                patientuid: 1,
                entypeuid: 1,
                startdate: 1,
                visitstatusuid: 1,
                ismedicaldischarge: { $ne: ['$medicaldischargedate', null] },
                visitcareproviders: {
                    $cond: [
                        { $gt: [{ $size: '$visitcareproviders' }, 1] },
                        {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$visitcareproviders',
                                        cond: {
                                            $eq: ['$$this.isprimarycareprovider', true]
                                        }
                                    }
                                }
                                , 0]
                        },
                        { $arrayElemAt: ['$visitcareproviders', 0] }
                    ]
                }
            }
        },
        { $lookup: { from: 'patients', localField: 'patientuid', foreignField: '_id', as: 'patientuid' } },
        { $unwind: { path: '$patientuid', preserveNullAndEmptyArrays: true } },
        { $match: { 'patientuid.mrn': HN ? HN : { $ne: null } } },
        { $lookup: { from: 'patientimages', localField: 'patientuid.patientimageuid', foreignField: '_id', as: 'patientuid.patientimageuid' } },
        { $unwind: { path: '$patientuid.patientimageuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'patientuid.nationalityuid', foreignField: '_id', as: 'patientuid.nationalityuid' } },
        { $unwind: { path: '$patientuid.nationalityuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'patientuid.titleuid', foreignField: '_id', as: 'patientuid.titleuid' } },
        { $unwind: { path: '$patientuid.titleuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'patientuid.genderuid', foreignField: '_id', as: 'patientuid.genderuid' } },
        { $unwind: { path: '$patientuid.genderuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'entypeuid', foreignField: '_id', as: 'entypeuid' } },
        { $unwind: { path: '$entypeuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'referencevalues', localField: 'visitstatusuid', foreignField: '_id', as: 'visitstatusuid' } },
        { $unwind: { path: '$visitstatusuid', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'departments', localField: 'visitcareproviders.departmentuid', foreignField: '_id', as: 'department' } },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'users', localField: 'visitcareproviders.careprovideruid', foreignField: '_id', as: 'careprovider' } },
        { $unwind: { path: '$careprovider', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'patientorders',
                let: { patientvisituid: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$$patientvisituid', '$patientvisituid'] }
                        }
                    },
                    {
                        $project: {
                            hasmedorder: {
                                $filter: {
                                    input: '$patientorderitems',
                                    cond: {
                                        $in: ['$$this.ordercattype', ['MEDICINE', 'SUPPLY']]
                                    }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            hasmedorder: { $gt: [{ $size: '$hasmedorder' }, 0] }
                        }
                    }

                ],
                as: 'patientorders'
            }
        },
        {
            $lookup: {
                from: 'emergencydetails',
                let: { patientvisituid: '$_id' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$$patientvisituid', '$patientvisituid'] } }
                    },
                    {
                        $count: "totalemergency"
                    },
                    {
                        $project: {
                            isemergency: { $gte: ['$totalemergency', 1] }
                        }
                    }
                ],
                as: 'emergency'
            }
        },
        { $unwind: { path: '$emergency', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'patientadditionaldetails',
                let: { patientuid: '$patientuid._id' },
                pipeline: [
                    {
                        $match: { $expr: { $eq: ['$$patientuid', '$patientuid'] } }
                    },
                    { $unwind: { path: '$aliasnames', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$addlnidentifiers', preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: 'referencevalues', localField: 'aliasnames.aliastypeuid', foreignField: '_id', as: 'aliasnames.aliastypeuid' } },
                    { $unwind: { path: '$aliasnames.aliastypeuid', preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: 'referencevalues', localField: 'addlnidentifiers.idtypeuid', foreignField: '_id', as: 'addlnidentifiers.idtypeuid' } },
                    { $unwind: { path: '$addlnidentifiers.idtypeuid', preserveNullAndEmptyArrays: true } },
                    {
                        $group: {
                            _id: '$id',
                            aliasnames: { $addToSet: '$aliasnames' },
                            moreids: { $addToSet: '$addlnidentifiers' }
                        }
                    },
                    {
                        $project: {
                            en_name: {
                                $arrayElemAt: [{
                                    $filter: {
                                        input: '$aliasnames',
                                        cond: {
                                            $eq: ['$$this.aliastypeuid.valuecode', 'ENAME']
                                        }
                                    }
                                }, 0]
                            },
                            passport: {
                                $arrayElemAt: [{
                                    $filter: {
                                        input: '$moreids',
                                        cond: {
                                            $eq: ['$$this.idtypeuid.valuecode', 'PSPNM']
                                        }
                                    }
                                }, 0]
                            },
                        }
                    },
                    {
                        $project: {
                            en_firstname: '$en_name.firstname',
                            en_midname: '$en_name.middlename',
                            en_lastname: '$en_name.lastname',
                            passport: '$passport.iddetail'
                        }
                    }
                ],
                as: 'patientadditionaldetail'
            }
        },
        { $unwind: { path: '$patientadditionaldetail', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'radiologyresults',
                let: { patientvisituid: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$$patientvisituid', '$patientvisituid'] }
                        }
                    },
                    { $lookup: { from: 'users', localField: 'careprovideruid', foreignField: '_id', as: 'careprovideruid' } },
                    { $unwind: { path: '$careprovideruid', preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: 'departments', localField: 'userdepartmentuid', foreignField: '_id', as: 'userdepartmentuid' } },
                    { $unwind: { path: '$userdepartmentuid', preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: 'orderitems', localField: 'orderitemuid', foreignField: '_id', as: 'orderitemuid' } },
                    { $unwind: { path: '$orderitemuid', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 0,
                            doctor_code: '$careprovideruid.code',
                            department_code: '$userdepartmentuid.code',
                            code: '$orderitemuid.code',
                            name: '$orderitemuid.name',
                            result: '$resulttext',
                            resultdate: '$resultdate',
                        }
                    }
                ],
                as: 'xrays'
            }
        },

    ]).toArray((error, docs) => {
        if (error) return res.status(500).json(error);
        else {
            if (docs && docs.length) {
                var result = [];
                docs.forEach(doc => {
                    var firstname = doc.patientuid ? doc.patientuid.firstname : ""
                    var middlename = doc.patientuid ? doc.patientuid.middlename : ""
                    var lastname = doc.patientuid ? doc.patientuid.lastname : ""
                    var patientname = `${firstname || ''}${middlename ? ' ' + middlename : ''}${lastname ? ' ' + lastname : ''}`

                    var output = {
                        "patientname": patientname,
                        "HN": doc.patientuid.mrn || "",
                        "AN": doc.visitid || "",
                        "startdate": doc.startdate || "",
                        "departmentuid": doc.department ? doc.department._id || '' : '',
                        "departmentname": doc.department ? doc.department.name || '' : '',
                        "drcode": doc.careprovider ? doc.careprovider.code || '' : '',
                        "drname": doc.careprovider ? doc.careprovider.name || '' : '',
                        "status": doc.visitstatusuid ? doc.visitstatusuid.valuecode === 'VSTSTS2' : false,
                        "_status": doc.visitstatusuid ? doc.visitstatusuid.valuedescription : false,
                        "checkorder": (doc.patientorders || []).some(order => order.hasmedorder),
                        encountertype: doc.entypeuid.relatedvalue,
                        ismedicaldischarge: !!doc.ismedicaldischarge,
                        isemergency: doc.emergency ? !!doc.emergency.isemergency : false,
                    };

                    if (doc.patientuid) {
                        var patient = doc.patientuid;
                        output['patient'] = {
                            HN: patient.mrn || "",
                            titlename: patient.titleuid ? patient.titleuid.valuedescription || "" : "",
                            firstname: {
                                en: "",
                                th: patient.firstname || ""
                            },
                            middlename: {
                                en: "",
                                th: patient.middlename || ""
                            },
                            lastname: {
                                en: "",
                                th: patient.lastname || ""
                            },
                            dateofbirth: patient.dateofbirth || "",
                            gender: patient.genderuid ? patient.genderuid.relatedvalue || "" : "",
                            nationality: {
                                en: patient.nationalityuid ? patient.nationalityuid.locallanguagedesc || "" : "",
                                th: patient.nationalityuid ? patient.nationalityuid.valuedescription || "" : "",
                            },
                            nationid: patient.nationalid || "",
                            address: {
                                fulladdress: patient.address ? patient.address.address || "" : "",
                                housenumber: patient.address ? patient.address.housenumber || "" : "",
                                area: patient.address ? patient.address.area || "" : "",
                                city: patient.address ? patient.address.city || "" : "",
                                state: patient.address ? patient.address.state || "" : "",
                                country: patient.address ? patient.address.country || "" : "",
                                zipcode: patient.address ? patient.address.zipcode || "" : "",
                            },
                            contact: {
                                phone: patient.contact ? patient.contact.mobilephone || "" : "",
                                emailid: patient.contact ? patient.contact.emailid || "" : ""
                            },
                            isvip: !!patient.isvip,
                            registereddate: patient.registereddate || "",
                            image: patient.patientimageuid ? patient.patientimageuid.patientphoto || "" : ""
                        }
                        if (doc.patientadditionaldetail) {
                            output['patient']['firstname']['en'] = doc.patientadditionaldetail.en_firstname || "";
                            output['patient']['middlename']['en'] = doc.patientadditionaldetail.en_midname || "";
                            output['patient']['lastname']['en'] = doc.patientadditionaldetail.en_lastname || "";

                            output['patient']['passport'] = doc.patientadditionaldetail.passport || "";
                        }
                    }

                    if (doc.department) {
                        output['department'] = {
                            code: doc.department.code || "",
                            name: {
                                en: doc.department.name || "",
                                th: doc.department.description || ""
                            }
                        }
                    }

                    if (doc.careprovider) {
                        output['careprovider'] = {
                            code: doc.careprovider.code || "",
                            name: {
                                en: doc.careprovider.printname || "",
                                th: doc.careprovider.name || ""
                            }
                        }
                    }

                    // if (doc.xrays && doc.xrays.length) {
                    //     output['xrays'] = [];
                    //     doc.xrays.forEach(xray => {
                    //         var xrayDetail = {
                    //             doctorcode: xray.doctor_code || "",
                    //             deptcode: xray.department_code || "",
                    //             code: xray.code || "",
                    //             name: xray.name || "",
                    //             result: xray.result || "",
                    //             resultdate: xray.resultdate || ""
                    //         }

                    //         output['xrays'].push(xrayDetail)
                    //     })
                    // }

                    result.push(output)

                })

                res.status(200).json(result)

            } else {
                res.status(200).json([])
            }
        }
    })

}

exports.xrayResult = function (req, res) {
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    var visitdate = req.body.visitdate;

    if (!visitdate) return res.status(500).json({ "error": "visitdate is required" });
    if (!orguid) return res.status(500).json({ "error": "orguid is required" });

    var fromdate = moment(visitdate).startOf('day');
    var todate = moment(visitdate).endOf('day');

    mongoose.connection.collection('patientvisits').aggregate([
        {
            $match: {
                orguid: mongoose.Types.ObjectId(orguid),
                statusflag: 'A',
                startdate: {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        { $lookup: { from: 'patients', localField: 'patientuid', foreignField: '_id', as: 'patientuid' } },
        { $unwind: { path: '$patientuid', preserveNullAndEmptyArrays: true } },
        { $match: { 'patientuid.mrn': HN ? HN : { $ne: null } } },
        {
            $lookup: {
                from: 'radiologyresults',
                let: { patientvisituid: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$$patientvisituid', '$patientvisituid'] }
                        }
                    },
                    { $lookup: { from: 'users', localField: 'careprovideruid', foreignField: '_id', as: 'careprovideruid' } },
                    { $unwind: { path: '$careprovideruid', preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: 'departments', localField: 'userdepartmentuid', foreignField: '_id', as: 'userdepartmentuid' } },
                    { $unwind: { path: '$userdepartmentuid', preserveNullAndEmptyArrays: true } },
                    { $lookup: { from: 'orderitems', localField: 'orderitemuid', foreignField: '_id', as: 'orderitemuid' } },
                    { $unwind: { path: '$orderitemuid', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 0,
                            doctor_code: '$careprovideruid.code',
                            doctor_name: '$careprovideruid.name',
                            department_code: '$userdepartmentuid.code',
                            department_name: '$userdepartmentuid.name',
                            code: '$orderitemuid.code',
                            name: '$orderitemuid.name',
                            result: '$resulttext',
                            resultdate: '$resultdate',
                        }
                    }
                ],
                as: 'xrays'
            }
        },
    ]).toArray((error, docs) => {
        if (error) return res.status(500).json(error);
        else {
            if (docs && docs.length) {
                var result = [];
                docs.forEach(doc => {
                    var output = {
                        HN: doc.patientuid.mrn || "",
                        xrays: []
                    }
                    if (doc.xrays && doc.xrays.length) {
                        doc.xrays.forEach(xray => {
                            var xrayDetail = {
                                doctorcode: xray.doctor_code || "",
                                doctorname: xray.doctor_name || "",
                                deptcode: xray.department_code || "",
                                deptname: xray.department_name || "",
                                code: xray.code || "",
                                name: xray.name || "",
                                result: (xray.result || "").replace(/<(.|\n)*?>/g, '').replace(/\r\n/g, '\n'),
                                resultdate: xray.resultdate || "",
                            }

                            output['xrays'].push(xrayDetail)
                        })
                    }

                    result.push(output)

                })

                res.status(200).json(result)

            } else {
                res.status(200).json([])
            }
        }
    })
}

exports.patientlogin = function (req, res) {
    var HN = req.body.HN;
    var orguid = req.body.orguid;
    var visitdate = req.body.visitdate;
    var fromdate = moment(visitdate).startOf('day').toISOString();
    var todate = moment(visitdate).endOf('day').toISOString();
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("patientvisits").aggregate([{
            "$match": {
                "orguid": mongoose.Types.ObjectId(orguid),
                "statusflag": "A",
                "startdate": {
                    $gte: new Date(fromdate),
                    $lte: new Date(todate)
                }
            }
        },
        {
            "$lookup": {
                "from": "patients",
                "localField": "patientuid",
                "foreignField": "_id",
                "as": "patients"
            }
        },

        {
            $unwind: {
                path: "$patients",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'referencevalues',
                localField: 'patients.titleuid',
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
            "$match": {
                "patients.mrn": HN ? HN : { $ne: null },
            }
        },

        {
            "$project": {

                "name": {
                    $cond: [{
                        $ne: ['$patients', null]
                    },
                    {
                        $concat: [{
                            $ifNull: [{
                                $toString: '$patients.firstname'
                            }, '']
                        },
                            ' ',
                        {
                            $ifNull: ['$patients.lastname', '']
                        },
                        ]
                    },
                        ''
                    ]
                },
                HN: {
                    $ifNull: ['$patients.mrn', '']
                },
                VN: {
                    $ifNull: ['$visitid', '']
                },

                dob: {
                    $ifNull: ['$patients.dateofbirth', '']
                },
                ptaddress: {
                    $ifNull: ['$patients.address', '']
                },

                nationalid: {
                    $ifNull: ['$patients.nationalid', '']
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
exports.usertable = function (req, res) {
    var orguid = req.body.orguid;
    MongoClient.connect(dbpath, (connectErr, db) => {
        var dbo = db;
        dbo.collection("users").aggregate([{
            "$match": {
                "orguid": mongoose.Types.ObjectId(orguid),
                "statusflag": "A",
            }
        },
        {
            "$project": {
        
                "useruid": "$_id",
                "username": "$name",
                "role": "$roles",
                "department": "$defaultdepartment.name",
                "nursestation": '',
                "doctor": "$iscareprovider",
                "nurse" :'',
                 
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
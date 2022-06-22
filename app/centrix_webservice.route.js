var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var dbpath = require('../config/db').dbpath;


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
            res.status(200).json(docs);
            db.close();
        });
    });
}
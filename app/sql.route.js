var mysql = require('mysql');
var moment = require('moment');
var mysqlConfig = {
    host: '192.168.80.4',
    // host: '192.168.10.103',
    user: 'centric',
    password: 'A7r@^vbS',
    database: 'hos',
    multipleStatements: true
};
exports.allergy = function (req, res) {
    var HN = req.body.HN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query("SELECT o.seriousness_id ,o.hn,CONCAT(p.pname,p.fname,p.lname) as pt_name, " +
        "  o.report_date,o.agent,o.symptom,o.reporter,o.note,asr.seiousness_name  " +
        "    FROM opd_allergy o  " +
        "    LEFT OUTER JOIN patient p on p.hn=o.hn  " +
        "    left outer join allergy_seriousness asr on asr.seriousness_id = o.seriousness_id " +
        "    WHERE o.hn='" + HN + "'", function (error, results, fields) {
            if (!error) {
                res.status(200).json({ allergy: results });
            } else {
                res.status(500).json({ err: error });
            }
        });
    connection.end();

}
exports.dermo = function (req, res) {
    var HN = req.body.HN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query("" +
        "  SELECT * from patient WHERE hn='" + HN + "'", function (error, results, fields) {
            if (!error) {
                res.status(200).json({ dermo: results });
            } else {
                res.status(500).json({ err: error });
            }
        });
    connection.end();

}
exports.episode = function (req, res) {
    var HN = req.body.HN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query("" +
        "  SELECT v.vn,pt.`name` as pttypeName,  " +
        " sp.`name`,v.vstdate " +
        " FROM vn_stat v  " +
        " LEFT OUTER JOIN patient p on p.hn=v.hn  " +
        " LEFT OUTER JOIN spclty sp on sp.spclty=v.spclty  " +
        " LEFT OUTER JOIN pttype pt on pt.pttype=v.pttype  " +
        " WHERE v.hn='" + HN + "' order by vstdate desc", function (error, results, fields) {
            if (!error) {
                res.status(200).json({ result: results });
            } else {
                res.status(500).json({ err: error });
            }
        });
    connection.end();

}
exports.cc = function (req, res) {
    // var HN = req.body.HN;
    var VN = req.body.VN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query(" " +
        " SELECT o.vn,o.hn,CONCAT(p.pname,p.fname,' ',p.lname) as pt_name, " +
        "  o.vstdate,o.vsttime,o.cc,o.symptom  " +
        "  FROM opdscreen o  " +
        "  LEFT OUTER JOIN patient p on p.hn=o.hn  " +
        " WHERE o.vn='" + VN + "' ", function (error, results, fields) {
            if (!error) {
                res.status(200).json({ cc: results });
            } else {
                res.status(500).json({ err: 'ERRORS.RECORDNOTFOUND' });
            }
        });
    connection.end();
}
exports.diag = function (req, res) {
    // var HN = req.body.HN;
    var VN = req.body.VN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query("SELECT v.vn,v.hn,CONCAT(p.pname,p.fname,' ',p.lname) as pt_name, " +
        "  v.pttype,pt.`name`,v.spclty,s.`name`,v.vstdate,v.pdx,i.`name` as diagnosisName1,i.tname as diagnosisName2  " +
        "  FROM vn_stat v  " +
        "  LEFT OUTER JOIN patient p on p.hn=v.hn  " +
        "  LEFT OUTER JOIN icd101 i on i.`code`=v.pdx  " +
        "  LEFT OUTER JOIN spclty s on s.spclty=v.spclty  " +
        "  LEFT OUTER JOIN pttype pt on pt.pttype=v.pttype  " +
        " WHERE v.vn='" + VN + "' ", function (error, results, fields) {
            if (!error) {
                res.status(200).json({ diag: results });
            } else {
                res.status(500).json({ err: 'ERRORS.RECORDNOTFOUND' });
            }
        });
    connection.end();
}
exports.medday = function (req, res) {
    // var HN = req.body.HN;
    var VN = req.body.VN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query(" " +
        " SELECT	o.*, s.NAME,s.strength,s.units,d.shortlist,s.displaycolor " +
        // " SELECT	o.*, concat(s. NAME,' ',s.strength,' ',s.units) AS NAME,d.shortlist,s.displaycolor " +
        " FROM	opitemrece o " +
        " LEFT OUTER JOIN s_drugitems s ON s.icode = o.icode " +
        " LEFT OUTER JOIN drugusage d ON d.drugusage = o.drugusage " +
        " LEFT OUTER JOIN drugitems i ON i.icode = o.icode " +
        " WHERE 	o.vn ='" + VN + "' " +
        "AND o.hos_guid NOT IN ('') " +
        "AND o.sub_type IN ('1', '3') " +
        "ORDER BY o.item_no "
        , function (error, results, fields) {
            // if (error) throw error;
            // console.log(results);
            if (!error) {
                res.status(200).json({ result: results });
            } else {
                res.status(500).json({ err: 'ERRORS.RECORDNOTFOUND' });
            }
        });
    connection.end();
}
// exports.medday = function (req, res) {
//     // var HN = req.body.HN;
//     var VN = req.body.VN;
//     var connection = mysql.createConnection(mysqlConfig);
//     connection.connect();
//     connection.query("SET NAMES utf8;");
//     connection.query(" " +
//    " SELECT o.vn,o.hn,o.an,CONCAT(pt.pname,pt.fname,' ',pt.lname) as pt_name, " +
//    "  o.icode,o.income,sd.`name` as drugname,sd.strength,sd.units,o.qty,o.sum_price, " +
//    "   dr.name1,dr.name2,dr.name3,o.vstdate,o.vsttime,o.rxdate,o.rxtime,ks.department,p.`name`,i.`name` " + 
//    "  FROM opitemrece o  " +
//    "  LEFT OUTER JOIN s_drugitems sd on sd.icode=o.icode  " +
//    "  LEFT OUTER JOIN drugusage dr on dr.drugusage=o.drugusage  " +
//    "  LEFT OUTER JOIN patient pt on pt.hn=o.hn  " +
//    " LEFT OUTER JOIN income i on i.income=o.income  " +
//    "  LEFT OUTER JOIN pttype p on p.pttype=o.pttype  " +
//    "  LEFT OUTER JOIN kskdepartment ks on ks.depcode=o.dep_code  " +
//    " WHERE o.vn='"+VN+"' and o.income='01'", function (error, results, fields) {
//             // if (error) throw error;
//             // console.log(results);
//             if (!error) {
//                 res.status(200).json({ result: results });
//             } else {
//                 res.status(500).json({ err: 'ERRORS.RECORDNOTFOUND' });
//             }
//         });
//     connection.end();
// }
exports.lab = function (req, res) {
    var VN = req.body.VN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query(" SELECT l.vn,l.hn,CONCAT(pt.pname,pt.fname,' ',pt.lname) as pt_Name,l.lab_order_number,   " +
        "   l1.lab_items_code,l2.lab_items_name,l1.lab_order_result,l1.lab_items_normal_value_ref   " +
        "   ,l.order_date,l.order_time,l.report_date,l.department,sp.`name` as spcltyName,d3.`name` as DoctorName  " +
        "   FROM lab_head l  " +
        "  LEFT OUTER JOIN lab_order l1 on l1.lab_order_number=l.lab_order_number  " +
        "   LEFT OUTER JOIN lab_items l2 on l2.lab_items_code=l1.lab_items_code  " +
        "  LEFT OUTER JOIN spclty sp on sp.spclty=l.spclty  " +
        "   LEFT OUTER JOIN patient pt on pt.hn=l.hn  " +
        "   LEFT OUTER JOIN doctor d3 on d3.`code`=l.doctor_code  " +
        "  WHERE l.vn='" + VN + "'   AND l1.confirm='Y' " +
        "   ORDER BY order_date DESC ", function (error, results, fields) {
            if (!error) {
                console.log(results);
                res.status(200).json({ lab: results });
            } else {
                res.status(500).json({ err: 'ERRORS.RECORDNOTFOUND' });
            }
        });
    connection.end();
}
exports.xray = function (req, res) {
    var VN = req.body.VN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query("SELECT x.xn,x.hn,x.vn,x.an,CONCAT(pt.pname,pt.fname,' ',pt.lname) as pt_name,x2.xray_items_name,  " +
        "    x.report_text,x.request_date,x.request_time,ks.department as departmentName,x1.department  " +
        "    ,x.report_date,dc1.`name` as Request_doctorName, " +
        "    dc.`name` as Report_doctor_name,x.confirm,x.confirm_read_film " +
        "  FROM xray_report x  " +
        "   LEFT OUTER JOIN xray_head x1 on x1.vn=x.vn  " +
        " LEFT OUTER JOIN xray_items x2 on x2.xray_items_code=x.xray_items_code  " +
        "  LEFT OUTER JOIN patient pt on pt.hn=x.hn  " +
        "  LEFT OUTER JOIN doctor dc on dc.`code`=x.report_doctor  " +
        "  LEFT OUTER JOIN doctor dc1 on dc1.`code`=x.request_doctor  " +
        "  LEFT OUTER JOIN kskdepartment ks on ks.depcode=x.request_depcode  " +
        "  WHERE x.vn='" + VN + "' AND x.confirm_read_film='Y' ", function (error, results, fields) {
            if (!error) {
                res.status(200).json({ xray: results });
            } else {
                res.status(500).json({ err: 'ERRORS.RECORDNOTFOUND' });
            }
        });
    connection.end();
}
exports.episode_timeline = function (req, res) {
    var HN = req.body.HN;
    var connection = mysql.createConnection(mysqlConfig);
    connection.connect();
    connection.query("SET NAMES utf8;");
    connection.query("" +
        "  SELECT v.vn,pt.`name` as pttypeName,  " +
        " sp.`name`,v.vstdate " +
        " FROM vn_stat v  " +
        " LEFT OUTER JOIN patient p on p.hn=v.hn  " +
        " LEFT OUTER JOIN spclty sp on sp.spclty=v.spclty  " +
        " LEFT OUTER JOIN pttype pt on pt.pttype=v.pttype  " +
        " WHERE v.hn='" + HN + "' order by vstdate desc", function (error, results, fields) {
            if (!error) {
                console.log('results',results);
                res.status(200).json({ data: results });
            } else {
                res.status(500).json({ err: error });
            }
        });
    connection.end();

}

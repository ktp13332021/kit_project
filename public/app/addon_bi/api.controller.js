var app = angular.module("myApp", ["ngMaterial"]);
app.controller("addonapiController", function ($scope, $location, $http, $timeout, $mdSidenav, $window, $q, $interval, $filter, globalSetting) {
  var vm = this;
  // $scope.token = $location.search()["token"];
  // $scope.orguid = $location.search()["orguid"];
  // console.log($scope.token);
  // console.log($scope.site);
  // $scope.orguid = '5faa3d95f71034497f38a208';
  // $scope.token = '1234';
  // $location.url($location.path());
  // $scope.orguid = globalSetting.setting.orguid['METTA'];
  vm.show_month = false;
  vm.lba_btn = "Monthly";
  $scope.changechart = changechart;
  $scope.refreshdata = refreshdata;
  $scope.mlabel = "DASHBOARD";
  var today = new Date();
  $scope.dtp = {
    // value: new Date(today.getFullYear(), today.getMonth(), 1)
    value: today
  };
  $scope.dtp2 = {
    value: today
  };
  var tick = function () {
    $scope.clock = new Date();
  };
  tick();
  $interval(tick, 1000);
  $scope.opd_chartdaily = opd_chartdaily;
  $scope.daily_bedoccupancy = daily_bedoccupancy;
  $scope.revenue_chart = revenue_chart;
  $scope.chartadmitdc = chartadmitdc;
  $scope.opd_visithour = opd_visithour;
  $scope.opd_bydepartment = opd_bydepartment;
  $scope.find_revenue = find_revenue;
  $scope.find_opd_visithour = find_opd_visithour;
  $scope.find_ward = find_ward;
  $scope.find_opd_bydepart = find_opd_bydepart;
  $scope.find_opddaily = find_opddaily;
  $scope.find_admit = find_admit;
  $scope.find_bedoccupancy = find_bedoccupancy;
  $scope.each_hosp = each_hosp;
  $scope.findorgname = findorgname;
  // $scope.toggleLeft = buildToggler("left");
  // $scope.toggleRight = buildToggler("right");
  // $scope.hidepage = true;


  // $scope.orguid_bangsue = '5bebb874f649ccfbf0865c49';
  // $scope.orguid_putd = '5bf37ed6b304f66fb4c5c560';
  // $scope.orguid_pch = '5ad9ac20c3e29ccd1dc35eb0';
  // $scope.orguid_puth = '5bf38579b304f66fb4c5f3fc';
  // $scope.orguid_psv = '5d09fb1b80256a7b271319a9';
  // $scope.orguid_PCPN = '5e1ecd3eae73b9a94c2636b2';
  // function switch_covid() {
  //   if ($scope.show_covid == true) {
  //     $scope.show_covid = false;
  //   } else {
  //     $scope.show_covid = true;
  //   }

  // }
  getOrguid();
  function getOrguid() {
    $http.get('/org-config').then(function (success) {
      var orgSite = success.data.org
      $scope.orguid = globalSetting.setting.orguid[orgSite];
      $scope.iip = globalSetting.setting.url[orgSite];
console.log($scope.orguid);
      findorgname($scope.orguid);
    })
  }
  

  function findorgname() {
    $http
      .post("/centrix_bi/find_site", {
        orguid: $scope.orguid
      })
      .success(function (data) {
        if (data && data.data.length > 0) {
          $scope.site = data.data;
          console.log("$scope.site", $scope.site);
          $scope.sitename = $scope.site[0].name;
          mapping(today);
        }
      });
  }

  function mapping(mdate) {

    $scope.mlabel = moment(mdate).format("MMMM YYYY");
    $scope.datetime = moment(mdate).format("DD/MM/YYYY  -  HH:mm");
    // $scope.show = "Y";
    //  thbh
    // $scope.orguid = '59e865c8ab5f11532bab0537';
    async.waterfall([
      // function get00(callback) {
      //   $http({
      //     method: "POST",
      //     url: "/centrix_bi/departmentcount",
      //     headers: { "Content-Type": "application/json" },
      //     data: JSON.stringify({
      //       visitdate: moment(mdate).format(),
      //       orguid: $scope.orguid
      //     })
      //   }).success(function (response) {
      //     $scope.departmentcount = response.opddepartmentcounts;
      //     console.log($scope.departmentcount);
      //     for (var i = 0; i < $scope.departmentcount.length; i++) {
      //       if ($scope.departmentcount[i].department == "Mobile Check Up") {
      //         $scope.thbh_chkup_mobile = $scope.departmentcount[i].count;
      //       }
      //       if ($scope.departmentcount[i].department == "Check Up") {
      //         $scope.thbh_chkup = $scope.departmentcount[i].count;
      //       }
      //     }
      //     callback();
      //   });

      // },
      function get0(callback) {
        $scope.opd_main = 0;
        $http({
          method: "POST",
          url: "/centrix_bi/visitcount",
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            visitdate: moment(mdate).format(),
            orguid: $scope.orguid
          })
        }).success(function (response) {
          console.log(response);
          if (response && response.opdvisithourcounts.length > 0) {
            $scope.opd_main = response.opdvisithourcounts[0].count;
          } else {
            $scope.opd_main = "-";
          }
          callback();
        });

      },
      function get1(callback) {
        $http.post('/centrix_bi/warddetail', {
          "orguid": $scope.orguid,
        }).then(function (response) {

          if (response && response.data.data.length > 0) {
            $scope.warddetail = response.data.data;
          } else {
            $scope.warddetail = {};
          }
          console.log('$scope.warddetail', $scope.warddetail);
          callback();
        });



      },
      function get2(callback) {
        $http.post('/centrix_bi/ward', {
          "orguid": $scope.orguid,
        }).then(function (response) {
          // console.log(185,response);
          if (response && response.data.data.length > 0) {

            $scope.warddata = response.data.data;
            console.log('$scope.warddata', $scope.warddata);
            var ward = 0;
            for (var i = 0; i < $scope.warddata.length; i++) {
              ward = ward + $scope.warddata[i].count;
            }
            $scope.total = ward;

            var totalbed = 0;
            for (var ii = 0; ii < $scope.warddetail.length; ii++) {
              totalbed = totalbed + $scope.warddetail[ii].bedcount;
              $scope.warddetail[ii].count = 0;
              for (var ij = 0; ij < $scope.warddata.length; ij++) {
                if ($scope.warddata[ij].ward == $scope.warddetail[ii].wardname) {
                  $scope.warddetail[ii].count = $scope.warddata[ij].count;
                }
              }
            }
            $scope.totalbed = totalbed;
            $scope.caseipd = $filter("orderBy")($scope.warddetail, "displayorder");
            console.log('$scope.caseipd', $scope.caseipd);

          }
          callback();
        });
        // mySplitter.content.load('ipd.html');

      },

    ], function () {
      each_hosp(today);
    })
  }
  //--------------------------------------
  function refreshdata() {
    mapping(new Date())
  }

  function changechart() {
    if (vm.lba_btn == "Monthly") {
      vm.lba_btn = "Realtime";
      vm.show_month = true;
    } else {
      vm.lba_btn = "Monthly";
      vm.show_month = false;
    }

  }

  function each_hosp(mdate) {
    $scope.titlelabel = $scope.orguid;
    async.waterfall(
      [

        function geta1(callback) {
          find_opd_visithour(mdate, $scope.orguid);
          callback();
        },
        function geta2(callback) {
          find_opd_bydepart(mdate, $scope.orguid);
          callback();
        },
        function geta3(callback) {
          find_ward($scope.orguid);
          callback();
        },
        function geta4(callback) {
          find_bedoccupancy(mdate, $scope.orguid);
          callback();
        },
        function geta5(callback) {
          find_admit(mdate, $scope.orguid);
          callback();
        },
        function get25(callback) {
          find_opddaily(mdate, $scope.orguid);
          callback();
        },
        function get1(callback) {
          find_revenue(mdate, $scope.orguid);
          callback();
        },

        // function get27(callback) {
        //   find_opdvisit(mdate, $scope.orguid);
        //   callback();
        // }
      ],

    );
  }
  // OPD
  function find_opd_visithour(mdate, orguid) {
    $http({
      method: "POST",
      url: "/centrix_bi/visithourcount",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        visitdate: moment(mdate).format(),
        orguid: orguid
      })
    }).success(function (response) {
      console.log(response);
      $scope.visithourcount = {};
      if (response && response.opdvisithourcounts.length > 0) {
        $scope.visithourcount = response.opdvisithourcounts;
        $scope.count = 0;

        for (var i = 0; i < $scope.visithourcount.length; i++) {
          $scope.count = $scope.count + $scope.visithourcount[i].count;
          $scope.visithourcount[i].cumu = $scope.count;
          // $scope.visithourcount[i].xlabel = $scope.visithourcount[i].period;
        }

        console.log($scope.visithourcount);
        opd_visithour($scope.visithourcount);
      } else {}
    });
  }

  function opd_visithour(result) {
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        period: result[j].period,
        count: parseFloat(result[j].count),
        cumu: parseFloat(result[j].cumu)
        // department: result[j]._id.department
        // planneddischargedate: moment(result[j].planneddischargedate).format('DD/MM/YYYY')
      });
    }
    console.log(categories);
    var chart = c3.generate({
      bindto: "#opd_visithour",
      size: {
        height: 240,
        width: 450
      },
      // padding: {
      //   top: 10,
      //   right: 80,
      //   bottom: 10,
      //   left: 50
      // },
      data: {
        json: categories,

        keys: {
          value: ["cumu", "count"]
        },
        labels: true,
        types: {
          cumu: "area-spline",
          count: "bar"
        }
        // fillColor: gradient
      },

      color: {
        pattern: ["#2ca9ba", "url(#gradient)", "#B73540", "#B73540"]
      },
      title: {
        text: "OPD"
      },
      legend: {
        show: false
      },

      axis: {
        // rotated: true,
        x: {
          type: "category",
          position: "inner-center",
          // json: categories,
          // categories: ['period'],
          categories: categories.map(function (cat) {
            return cat.period;
          }),
          // show:false
          // tick: {
          // format: function (x) { return x.getFullYear(); }
          //   format: '%D' // format string is also available for category data
          // }
          tick: {
            rotate: 75,
            multiline: false
          }
        }
      },
      oninit: function () {
        d3.select("svg defs")
          .append("linearGradient")
          .attr("id", "gradient")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", 0)
          .attr("y2", 1)
          .html(
            '<stop offset="0%" stop-color="blue" /><stop offset="100%" stop-color="cyan"/>'
          );
      }
    });
  }
  // OPD by department
  function find_opd_bydepart(mdate, orguid) {
    $http({
      method: "POST",
      url: "/centrix_bi/departmentcount",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        visitdate: moment(mdate).format(),
        orguid: orguid
      })
    }).success(function (response) {
      $scope.departmentcount = response.opddepartmentcounts;
      console.log("$scope.departmentcount");
      console.log($scope.departmentcount);
      opd_bydepartment($scope.departmentcount);
      // callback();
    });
  }

  function opd_bydepartment(result) {
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        department: result[j].department,
        count: parseFloat(result[j].count)
        // department: result[j]._id.department
        // planneddischargedate: moment(result[j].planneddischargedate).format('DD/MM/YYYY')
      });
    }
    // console.log(result);

    var chart = c3.generate({
      bindto: "#opd_bydepartment",
      size: {
        height: 260,
        width: 500
      },

      data: {
        json: categories,

        keys: {
          value: ["count"]
        },
        labels: true,
        types: {
          count: "bar"
        }
        // fillColor: gradient
      },

      color: {
        pattern: [ "url(#timeframe-gradient)", "#B73540", "#B73540"]
      },
      title: {
        text: "OPD by department"
      },
      legend: {
        show: false
      },

      axis: {
        // rotated: true,
        x: {
          type: "category",
          position: "inner-center",
          // json: categories,
          // categories: ['period'],
          categories: categories.map(function (cat) {
            return cat.department;
          }),
          // show:false
          // tick: {
          // format: function (x) { return x.getFullYear(); }
          //   format: '%D' // format string is also available for category data
          // }

          tick: {
            // culling: false,
            // rotate: 330
            // fit: true,
            // multiline: true,
            // centered: true
          }
        }
      },
      oninit: function () {
        d3.select("svg")
          .append("linearGradient")
          .attr("id", "timeframe-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("y1", 0)
          .attr("x1", 0)
          .attr("y2", 0)
          .attr("x2", 100)
          .selectAll("stop")
          .data([{
              offset: "0%",
              color: "#a9e6e3",
              opacity: 1
            },
            {
              offset: "100%",
              color: "#4ec1bc",
              opacity: 1
            }
          ])
          .enter()
          .append("stop")
          .attr("offset", function (d) {
            return d.offset;
          })
          .attr("stop-color", function (d) {
            return d.color;
          })
          .attr("stop-opacity", function (d) {
            return d.opacity;
          });

        d3.select("#wardchart .c3-title")
          .style("font-size", "1.2em")
          .style("fill", "green");
      }
    });
  }
  //Ward
  function find_ward(orguid) {
    async.waterfall([

      function get1(callback) {
        $http.post('/centrix_bi/warddetail', {
          "orguid": $scope.orguid,
        }).then(function (response) {

          if (response && response.data.data.length > 0) {
            $scope.warddetail = response.data.data;
          } else {
            $scope.warddetail = {};
          }
          console.log('$scope.warddetail', $scope.warddetail);
          callback();
        });



      },
      function get2(callback) {
        $http.post('/centrix_bi/ward', {
          "orguid": $scope.orguid,
        }).then(function (response) {
          // console.log(185,response);
          if (response && response.data.data.length > 0) {

            $scope.warddata = response.data.data;
            console.log('$scope.warddata', $scope.warddata);
            var ward = 0;
            for (var i = 0; i < $scope.warddata.length; i++) {
              ward = ward + $scope.warddata[i].count;
            }
            $scope.total = ward;

            var totalbed = 0;
            for (var ii = 0; ii < $scope.warddetail.length; ii++) {
              totalbed = totalbed + $scope.warddetail[ii].bedcount;
              $scope.warddetail[ii].count = 0;
              for (var ij = 0; ij < $scope.warddata.length; ij++) {
                if ($scope.warddata[ij].ward == $scope.warddetail[ii].wardname) {
                  $scope.warddetail[ii].count = $scope.warddata[ij].count;
                }
              }
            }
            $scope.totalbed = totalbed;
            $scope.newwarddata = $filter("orderBy")($scope.warddetail, "displayorder");
            console.log('$scope.newwarddata', $scope.newwarddata);
            wardchart($scope.newwarddata);
          }
          callback();
        });


      },

    ], function () {

    })

  }

  function wardchart(result) {
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        occupy: parseFloat(result[j].count),
        room: parseFloat(result[j].bedcount),
        ward: result[j].wardname
      });
    }
    // console.log(result);
    var chart = c3.generate({
      bindto: "#wardchart",
      size: {
        height: 480,
        width: 500
      },

      data: {
        json: categories,
        keys: {
          value: ["occupy", "room"]
        },
        labels: true,

        type: "bar"

        // groups: [
        //     ['occupy','room']
        // ]
      },
      color: {
        pattern: ["#406578", "url(#timeframe-gradient)", "#B73540", "#B73540"]
      },
      title: {
        text: " total IPD  =" + $scope.total + " case"
      },
      legend: {
        show: true
      },
      axis: {
        rotated: true,
        x: {
          type: "category",
          position: "inner-center",
          categories: categories.map(function (cat) {
            return cat.ward;
          }),
          // show:false
          tick: {
            rotate: 75,
            multiline: false
          },
          rotated: true
        }
      },
      oninit: function () {
        d3.select("svg")
          .append("linearGradient")
          .attr("id", "timeframe-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("y1", 0)
          .attr("x1", 0)
          .attr("y2", 0)
          .attr("x2", 100)
          .selectAll("stop")
          .data([{
              offset: "0%",
              color: "#a9e6e3",
              opacity: 1
            },
            {
              offset: "100%",
              color: "#4ec1bc",
              opacity: 1
            }
          ])
          .enter()
          .append("stop")
          .attr("offset", function (d) {
            return d.offset;
          })
          .attr("stop-color", function (d) {
            return d.color;
          })
          .attr("stop-opacity", function (d) {
            return d.opacity;
          });

        d3.select("#wardchart .c3-title")
          .style("font-size", "1.2em")
          .style("fill", "green");
      }

      // oninit: function () {
      //     d3.select("svg defs").append("linearGradient")
      //         .attr("id", "gradient")
      //         .attr("x1", 0)
      //         .attr("x2", 0)
      //         .attr("y1", 0)
      //         .attr("y2", 1)
      //         .html('<stop offset="0%" stop-color="blue" /><stop offset="100%" stop-color="cyan"/>')
      //         ;
      // },
    });
  }
  //IPD in 24
  function find_bedoccupancy(mdate, orguid) {
    $http.post('/centrix_bi/findbedoccupancy', {
      "mdate": mdate,
      "orguid": $scope.orguid,
    }).then(function (response) {

      if (response && response.data.data.length > 0) {
        $scope.wardccupancy = response.data.data;
      } else {
        $scope.wardccupancy = {};
      }
      console.log('$scope.wardccupancy', $scope.wardccupancy);
      daily_bedoccupancy($scope.wardccupancy);
    });
  }

  function daily_bedoccupancy(result) {
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        total: parseFloat(result[j].occupancydetails.length),
        cdate: moment(result[j].dateofoccupancy).format("DD/MM/YYYY")
      });
    }
    // console.log(result);
    var chart = c3.generate({
      bindto: "#daily_bedoccupancy",
      size: {
        height: 240,
        width: 450
      },
      data: {
        json: categories,
        keys: {
          value: ["total"]
        },
        labels: true,

        types: {
          total: "bar"
        }
      },
      color: {
        pattern: ["#2ca9ba", "#99D5DF", "#B73540", "#B73540"]
      },
      title: {
        text: "Bed occupancy"
      },
      legend: {
        show: true
      },

      axis: {
        x: {
          type: "category",
          position: "inner-center",
          categories: categories.map(function (cat) {
            return cat.cdate;
          }),
          // show:false
          // tick: {
          // format: function (x) { return x.getFullYear(); }
          //   format: '%D' // format string is also available for category data
          // }
          tick: {
            rotate: 75,
            multiline: false
          }
        }
      }
    });
  }
  // admit discharge trend
  function find_admit(mdate, orguid) {
    let promiseOne = $http({
      method: "POST",
      url: "/centrix_bi/admissioncount",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        visitdate: moment(mdate).format(),
        orguid: orguid
      })
    }).success(function (response) {
      $scope.admit = response.admissioncount;
      console.log("$scope.admit");
      console.log($scope.admit);
    });

    let promiseTwo = $http({
      method: "POST",
      url: "/centrix_bi/dischargecount",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        visitdate: moment(mdate).format(),
        orguid: orguid
      })
    }).success(function (response) {
      $scope.dc = response.dischargecount;
      console.log("$scope.dc");
      console.log($scope.dc);
    });

    $q.all([promiseOne, promiseTwo]).then(data => {
      // console.log('Both promises have resolved', data);
      for (var i = 0; i < $scope.admit.length; i++) {
        $scope.admit[i].mdate = moment($scope.admit[i].visitdate).format(
          "DD/MM/YYYY"
        );

        for (var j = 0; j < $scope.dc.length; j++) {
          $scope.dc[j].mdate = moment($scope.dc[j].dischargedate).format(
            "DD/MM/YYYY"
          );
          if ($scope.dc[j].mdate == $scope.admit[i].mdate) {
            $scope.admit[i].dccount = $scope.dc[j].dischargecount;
          }
        }
      }
      console.log("new $scope.admit");
      console.log($scope.admit);
      chartadmitdc($scope.admit);
    });
  }

  function chartadmitdc(result) {
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        admitcount: parseFloat(result[j].admitcount),
        dccount: parseFloat(result[j].dccount),
        mdate: moment(result[j].visitdate).format("DD/MM/YYYY")
      });
    }
    // console.log(result);
    var chart = c3.generate({
      bindto: "#chartadmitdc",
      size: {
        height: 240,
        width: 450
      },
      data: {
        json: categories,
        keys: {
          value: ["admitcount", "dccount"]
        },
        labels: true,

        type: "bar"
      },
      color: {
        pattern: ["#217d9e", "#29bdb7", "#B73540"]
      },
      title: {
        text: "admit discharge trend"
      },
      legend: {
        show: true
      },

      axis: {
        x: {
          type: "category",
          position: "inner-center",
          categories: categories.map(function (cat) {
            return cat.mdate;
          }),
          // show:false
          // tick: {
          // format: function (x) { return x.getFullYear(); }
          //   format: '%D' // format string is also available for category data
          // }
          tick: {
            rotate: 75,
            multiline: false
          }
        }
      }
    });
  }
  //OPDdaily
  function find_opddaily(mdate, orguid) {
    $http({
      method: "POST",
      url: "/centrix_bi/opddaily",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        visitdate: moment(mdate).format(),
        orguid: orguid
      })
    }).success(function (response) {
      $scope.opd_daily = response.opdcase;
      console.log("$scope.opd_daily");
      console.log($scope.opd_daily);
      opd_chartdaily($scope.opd_daily);
      // callback();
    });
  }

  function opd_chartdaily(result) {
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        // selfpaycount: (parseFloat(result[j].selfpaycount)),
        // uccount: (parseFloat(result[j].uccount)),
        count: parseFloat(result[j].count),
        visitdate: moment(result[j].visitdate).format("DD/MM/YYYY")
      });
    }
    var chart = c3.generate({
      bindto: "#opd_chartdaily",
      size: {
        height: 240,
        width: 450
      },

      data: {
        json: categories,
        keys: {
          value: ["count"]
        },
        labels: true,

        // type: 'bar',
        types: {
          // selfpaycount: 'bar',
          count: "bar"
          // total: 'spline',
        }
      },
      color: {
        pattern: ["#2ca9ba", "#99D5DF", "#B73540", "#B73540"]
      },
      title: {
        text: "OPD "
      },
      legend: {
        show: true
      },

      axis: {
        x: {
          type: "category",
          position: "inner-center",
          categories: categories.map(function (cat) {
            return cat.visitdate;
          }),
          // show:false
          // tick: {
          // format: function (x) { return x.getFullYear(); }
          //   format: '%D' // format string is also available for category data
          // }
          tick: {
            rotate: 75,
            multiline: false
          }
        }
      }
    });
  }

  //revenue
  function find_revenue(mdate, orguid) {
    $http({
      method: "POST",
      url: "/centrix_bi/revenuesplit",
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        visitdate: moment(mdate).format(),
        orguid: orguid
      })
    }).success(function (response) {
      console.log(response.revenue);
      $scope.revenueipd = response.revenue.ipd;

      $scope.revenueopd = response.revenue.opd;
      // $scope.todaydate =  moment().format('DD/MM/YYYY');
      for (var j = 0; j < $scope.revenueipd.length; j++) {
        $scope.revenueipd[j].tdate = moment($scope.revenueipd[j].revenuedate)
          .local()
          .format("MM/DD/YYYY");
        $scope.revenueipd[j].revenuedate = moment(
          $scope.revenueipd[j].revenuedate
        );
      }
      for (var j = 0; j < $scope.revenueopd.length; j++) {
        $scope.revenueopd[j].tdate = moment($scope.revenueopd[j].revenuedate)
          .local()
          .format("MM/DD/YYYY");
        $scope.revenueopd[j].revenuedate = moment(
          $scope.revenueopd[j].revenuedate
        );
      }
      for (var i = 0; i < $scope.revenueopd.length; i++) {
        $scope.revenueopd[i].totalopd = $scope.revenueopd[i].revenuetotal;
        for (var j = 0; j < $scope.revenueipd.length; j++) {
          if ($scope.revenueipd[j].tdate == $scope.revenueopd[i].tdate) {
            $scope.revenueopd[i].totalipd = $scope.revenueipd[j].revenuetotal;
          }
        }
      }
      console.log("$scope.revenueipd");
      console.log($scope.revenueipd);
      console.log("$scope.revenueopd");
      console.log($scope.revenueopd);
      revenue_chart($scope.revenueopd);
    });
  }

  function revenue_chart(result) {
    result = $filter("orderBy")(result, "revenuedate");
    var categories = [];
    for (var j = 0; j < result.length; j++) {
      categories.push({
        total: parseInt(result[j].totalopd) + parseInt(result[j].totalipd),
        rev_opd: parseInt(result[j].totalopd),
        rev_ipd: parseInt(result[j].totalipd),
        tdate: moment(result[j].tdate).format("DD/MM/YYYY")
      });
    }
    // console.log(result);

    var chart = c3.generate({
      bindto: "#revenue_chart",
      size: {
        height: 240,
        width: 450
      },

      data: {
        json: categories,

        keys: {
          value: ["rev_opd", "rev_ipd", "total"]
        },
        labels: true,
        types: {
          total: "area-spline",
          rev_opd: "bar",
          rev_ipd: "bar"
        }

        // fillColor: gradient
      },

      color: {
        pattern: ["#217d9e", "#29bdb7", "#B73540", "#B73540"]
        // pattern: ["#2ca9ba", "#363FBC", "#B73540", "#B73540"]
        // pattern: ['url(#gradient)', '#2ca9ba', '#B73540', '#B73540']
      },
      title: {
        text: "revenue"
      },
      legend: {
        show: true
      },

      axis: {
        // rotated: true,
        x: {
          type: "category",
          position: "inner-center",
          // json: categories,
          // categories: ['period'],
          categories: categories.map(function (cat) {
            return cat.tdate;
          }),
          // show:false
          // tick: {
          // format: function (x) { return x.getFullYear(); }
          //   format: '%D' // format string is also available for category data
          // }
          tick: {
            rotate: 75,
            multiline: false
          }
        },
        y: {
          // position: 'inner-center',

          tick: {
            rotate: 45,
            multiline: false,
            format: d3.format(".2s")
            //            format: d3.format(",")
          }
        }
      },

      oninit: function () {
        d3.select("svg defs")
          .append("linearGradient")
          .attr("id", "gradient")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", 0)
          .attr("y2", 1)
          .html(
            '<stop offset="0%" stop-color="blue" /><stop offset="100%" stop-color="cyan"/>'
          );
      }
    });
  }


  //------------------backup
  // function find_user_ID(token) {
  //   $http
  //     .post("/local_host/finduser_ID", {
  //       ID: token
  //     })
  //     .success(function (data) {
  //       $scope.pwds = data.pwd;
  //       console.log("$scope.pwds");
  //       console.log($scope.pwds);
  //       if (data.pwd.length == 0) {
  //         window.location = "/";
  //       } else {
  //         console.log($scope.pwds[0].site);
  //         if ($scope.pwds[0].site == "all") {
  //           window.location = "/index#?token=" + $scope.pwds[0]._id + '&site=' + $scope.pwds[0].site;
  //         } else {
  //           choose_site($scope.pwds[0].site);
  //         }
  //       }
  //     });
  // }

  // function find_opdvisit(mdate, orguid) {
  //   console.log(orguid);
  //   $http({
  //     method: "POST",
  //     url: "/centrix_bi/visitcount",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     data: JSON.stringify({
  //       visitdate: moment(mdate).format(),
  //       orguid: orguid
  //     })
  //   }).success(function (response) {
  //     $scope.opd = {};
  //     if (response && response.opdvisithourcounts.length > 0) {
  //       $scope.opd = response.opdvisithourcounts[0].count;
  //     } else {
  //       $scope.opd = "-";
  //     }
  //   });
  // }

  // function compare(mdate) {
  //   closeform();
  //   $scope.show_compare = true;
  //   $scope.havedata = true;
  //   $scope.toggleLeft();
  //   var dmy = $scope.dmy;
  //   async.waterfall(
  //     [
  //       function get0(callback) {
  //         var mlength = moment(dmy)
  //           .endOf("month")
  //           .format("DD");
  //         var mmyy = moment(dmy).format("/MM/YYYY");
  //         $scope.dayinmonth = [];
  //         for (i = 1; i <= mlength; i++) {
  //           var ii = parseInt(i) + 100;
  //           ii = ii.toString().substring(1, 3);
  //           $scope.dayinmonth.push({
  //             date: ii + mmyy,
  //             thbh: null,
  //             bangsue: null
  //           });
  //         }

  //         console.log("$scope.dayinmonth");
  //         console.log($scope.dayinmonth);
  //         mdate = moment(dmy).format("YYYY-MM-DD");
  //         mdate1 = moment(dmy)
  //           .startOf("month")
  //           .format("DD/MM/YYYY");
  //         mdate2 = moment(dmy)
  //           .endOf("month")
  //           .format("DD/MM/YYYY");
  //         console.log(mdate1);
  //         console.log(mdate2);

  //         callback();
  //       },

  //       function get1(callback) {
  //         // find_opd_visithour(mdate, $scope.orguid );
  //         $http({
  //           method: "POST",
  //           url: "/centrix_bi/compare_opd",
  //           headers: {
  //             "Content-Type": "application/json"
  //           },
  //           data: JSON.stringify({
  //             visitdate: moment(mdate).format(),
  //             orguid: $scope.orguid
  //           })
  //         }).success(function (response) {
  //           if (response && response.opd_daily.length > 0) {
  //             $scope.opdthbh = response.opd_daily;
  //             for (var i = 0; i < $scope.opdthbh.length; i++) {
  //               $scope.opdthbh[i].date = moment(
  //                 $scope.opdthbh[i].visitdate
  //               ).format("DD/MM/YYYY");
  //             }
  //             callback();
  //           } else {
  //             $scope.opdthbh = [];
  //           }
  //           console.log("$scope.opdthbh");
  //           console.log($scope.opdthbh);
  //         });
  //       },

  //       function get4(callback) {
  //         $http({
  //           method: "POST",
  //           url: "/centrix_bi/compare_opd",
  //           headers: {
  //             "Content-Type": "application/json"
  //           },
  //           data: JSON.stringify({
  //             visitdate: moment(mdate).format(),
  //             orguid: $scope.orguid_bangsue
  //           })
  //         }).success(function (response) {
  //           if (response && response.opd_daily.length > 0) {
  //             $scope.opdbangsue = response.opd_daily;
  //             for (var i = 0; i < $scope.opdbangsue.length; i++) {
  //               $scope.opdbangsue[i].date = moment(
  //                 $scope.opdbangsue[i].visitdate
  //               ).format("DD/MM/YYYY");
  //             }
  //             callback();
  //           } else {
  //             $scope.opdbangsue = [];
  //           }
  //         });
  //       }
  //     ],
  //     function () {
  //       for (var j = 0; j < $scope.dayinmonth.length; j++) {
  //         if ($scope.opdthbh && $scope.opdthbh.length > 0) {
  //           for (var i = 0; i < $scope.opdthbh.length; i++) {
  //             $scope.dayinmonth[j].thbh = null;
  //             if ($scope.opdthbh[i].date == $scope.dayinmonth[j].date) {
  //               $scope.dayinmonth[j].thbh = $scope.opdthbh[i].total;

  //               break;
  //             }
  //           }
  //         } else {
  //           $scope.dayinmonth[j].thbh = null;
  //         }

  //         if ($scope.opdbangsue && $scope.opdbangsue.length > 0) {
  //           for (var i = 0; i < $scope.opdbangsue.length; i++) {
  //             $scope.dayinmonth[j].Pbangsue = null;
  //             if ($scope.opdbangsue[i].date == $scope.dayinmonth[j].date) {
  //               $scope.dayinmonth[j].Pbangsue = $scope.opdbangsue[i].total;

  //               break;
  //             }
  //           }
  //         } else {
  //           $scope.dayinmonth[j].bangsue = null;
  //         }
  //       }
  //       console.log("$scope.dayinmonth");
  //       console.log($scope.dayinmonth);
  //       $scope.havedata = false;

  //       $scope.showcp = true;
  //       chartcp($scope.dayinmonth);
  //     }
  //   );
  // }

  // function chartcp(result) {
  //   // result = $filter('orderBy')(result, 'revenuedate');
  //   var categories = [];
  //   for (var j = 0; j < result.length; j++) {
  //     categories.push({
  //       thbh: parseInt(result[j].thbh),
  //       bangsue: parseInt(result[j].bangsue),
  //       tdate: moment(result[j].date).format("DD/MM/YYYY")
  //     });
  //   }
  //   // console.log(result);

  //   var chart = c3.generate({
  //     bindto: "#chartcp",
  //     size: {
  //       // height: 240,
  //       width: 3000
  //     },
  //     padding: {
  //       top: 10,
  //       right: 80,
  //       bottom: 10,
  //       left: 50
  //     },

  //     data: {
  //       json: categories,

  //       keys: {
  //         value: [
  //           "thbh",
  //           "PPCH",
  //           "Pbangsue",
  //           "bangsue",
  //           "PUTD",
  //           "PUTH",
  //           "PSV",
  //           "PCPN"
  //         ]
  //       },
  //       labels: true,
  //       types: {
  //         thbh: "spline",
  //         PPCH: "spline",
  //         Pbangsue: "spline",
  //         bangsue: "spline",
  //         PUTD: "spline",
  //         PUTH: "spline",
  //         PSV: "spline"
  //       }

  //       // fillColor: gradient
  //     },

  //     color: {
  //       pattern: [
  //         "#B71C1C",
  //         "#FBC02D",
  //         "#01579B",
  //         "#263238",
  //         "#00BFA5",
  //         "#999FA5",
  //         "#799999",
  //         "#777999"
  //       ]
  //       // pattern: ['url(#gradient)', '#2ca9ba', '#B73540', '#B73540']
  //     },
  //     title: {
  //       text: ""
  //     },
  //     legend: {
  //       show: true
  //     },

  //     axis: {
  //       // rotated: true,
  //       x: {
  //         type: "category",
  //         position: "inner-center",
  //         // json: categories,
  //         // categories: ['period'],
  //         categories: categories.map(function (cat) {
  //           return cat.tdate;
  //         }),
  //         // show:false
  //         // tick: {
  //         // format: function (x) { return x.getFullYear(); }
  //         //   format: '%D' // format string is also available for category data
  //         // }
  //         tick: {
  //           rotate: 75,
  //           multiline: false
  //         }
  //       },
  //       y: {
  //         // position: 'inner-center',

  //         tick: {
  //           rotate: 45,
  //           multiline: false,
  //           format: d3.format(".2s")
  //           //            format: d3.format(",")
  //         }
  //       }
  //     }

  //     // oninit: function () {
  //     //     d3.select("svg defs").append("linearGradient")
  //     //         .attr("id", "gradient")
  //     //         .attr("x1", 0)
  //     //         .attr("x2", 0)
  //     //         .attr("y1", 0)
  //     //         .attr("y2", 1)
  //     //         .html('<stop offset="0%" stop-color="blue" /><stop offset="100%" stop-color="cyan"/>')
  //     //         ;
  //     // },
  //   });
  // }


});
/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 93.67088607594937, "KoPercent": 6.329113924050633};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28615384615384615, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0625, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0625, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.6875, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.5625, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.4375, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.1875, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.375, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0625, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.1875, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.4375, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0625, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.0625, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.03125, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.1875, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [0.875, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.5, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.1875, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [0.75, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.9375, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.25, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.9375, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [0.875, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.25, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 237, 15, 6.329113924050633, 5916.113924050634, 272, 134111, 1310.0, 8296.000000000002, 12395.099999999995, 129209.86000000003, 1.0092923029750702, 74.76164884878928, 1.2950896079623366], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 8, 1, 12.5, 11789.375, 735, 17529, 12787.5, 17529.0, 17529.0, 17529.0, 0.3521281746555746, 0.6990552373563977, 0.715604229939698], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 8, 0, 0.0, 3874.125, 866, 5146, 4301.5, 5146.0, 5146.0, 5146.0, 0.8166598611678236, 9.43026809412005, 0.7854569148121683], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 16, 2, 12.5, 6407.875, 518, 7782, 7139.0, 7782.0, 7782.0, 7782.0, 0.33907644054506536, 0.3309637718015555, 1.4841216860576008], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 8, 0, 0.0, 3923.25, 773, 4899, 4136.0, 4899.0, 4899.0, 4899.0, 0.7659900421294523, 0.5193247917464573, 0.8931563577173496], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 7, 0, 0.0, 890.4285714285714, 408, 1582, 925.0, 1582.0, 1582.0, 1582.0, 1.116249402009249, 26.33541924134907, 1.0508441636102694], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 1, 12.5, 586.25, 398, 1003, 480.5, 1003.0, 1003.0, 1003.0, 0.23537026685104004, 6.1689880365706555, 0.19629512489334786], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 4, 50.0, 102594.99999999999, 303, 134111, 110572.5, 134111.0, 134111.0, 134111.0, 0.04524733323529744, 0.09658140490141737, 0.0438333540716944], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 8, 0, 0.0, 805.5, 487, 2241, 606.5, 2241.0, 2241.0, 2241.0, 0.955794504181601, 84.05064590800478, 0.7812500000000001], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 8, 1, 12.5, 881.375, 359, 1867, 499.5, 1867.0, 1867.0, 1867.0, 0.2953882509323192, 5.931238865247573, 0.245195325480929], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 1, 12.5, 540.25, 366, 723, 538.0, 723.0, 723.0, 723.0, 0.35381009243288664, 26.490882825284153, 0.29058035911724384], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 1, 12.5, 1416.875, 394, 1974, 1521.5, 1974.0, 1974.0, 1974.0, 0.19090345057986924, 4.347085031081468, 0.15399047869040233], "isController": false}, {"data": ["GOTO HOME PAGE", 8, 0, 0.0, 805.5, 487, 2241, 606.5, 2241.0, 2241.0, 2241.0, 0.9513616363420145, 83.66082842787489, 0.7776266500178379], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 8, 0, 0.0, 1525.625, 305, 2175, 1443.0, 2175.0, 2175.0, 2175.0, 0.04477352988912955, 0.8691486593126144, 0.03607242398294128], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 8, 4, 50.0, 104120.625, 608, 136286, 112260.0, 136286.0, 136286.0, 136286.0, 0.0446854978802317, 0.9628219275927364, 0.07929057582849706], "isController": true}, {"data": ["LOGIN PROCESS", 8, 0, 0.0, 3375.1250000000005, 2994, 3931, 3156.0, 3931.0, 3931.0, 3931.0, 0.8650519031141869, 720.9236118620242, 1.5079273897058825], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 8, 0, 0.0, 3703.125, 713, 5125, 3985.5, 5125.0, 5125.0, 5125.0, 0.26198585276395076, 0.12027939358462142, 0.38530341236573223], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 8, 1, 12.5, 1475.375, 335, 2390, 1414.0, 2390.0, 2390.0, 2390.0, 0.1857053320643469, 4.549939319331925, 0.1534245223890991], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 7, 0, 0.0, 674.7142857142858, 587, 784, 660.0, 784.0, 784.0, 784.0, 3.215434083601286, 273.70754622186496, 3.005049236334405], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 1, 12.5, 1041.875, 337, 1309, 1117.5, 1309.0, 1309.0, 1309.0, 0.3469060318286284, 26.192887545531416, 1.0598165598846538], "isController": false}, {"data": ["LOGIN ", 8, 0, 0.0, 3020.7500000000005, 2659, 3618, 2811.0, 3618.0, 3618.0, 3618.0, 0.8966599417171037, 729.3365416946872, 0.8108467832324591], "isController": false}, {"data": ["GET QUOTE", 8, 0, 0.0, 7177.0, 1353, 8365, 8056.5, 8365.0, 8365.0, 8365.0, 0.567335649953904, 0.26025968902914687, 1.1479682292036024], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 8, 0, 0.0, 3509.125, 667, 3984, 3923.5, 3984.0, 3984.0, 3984.0, 0.23772732675621064, 0.10914214794068702, 0.31201711636752644], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 16, 1, 6.25, 3668.0625000000005, 667, 5382, 3665.5, 5216.8, 5382.0, 5382.0, 0.5765557997909985, 6.08807593645274, 1.5551241396706423], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 7, 0, 0.0, 467.1428571428571, 383, 598, 436.0, 598.0, 598.0, 598.0, 3.8674033149171274, 2.3076010013812156, 8.652559564917127], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 8, 1, 12.5, 1416.875, 394, 1974, 1521.5, 1974.0, 1974.0, 1974.0, 0.1909080062045102, 4.347188767748478, 0.15399415344231], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 1, 12.5, 420.75, 312, 888, 365.0, 888.0, 888.0, 888.0, 0.3518339343829712, 1.0248795381080131, 0.2662805655730495], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 1, 12.5, 1011.875, 475, 1475, 1039.5, 1475.0, 1475.0, 1475.0, 1.1816838995568684, 24.880706471565734, 0.9866598966026588], "isController": false}, {"data": ["QUOTE CREATION", 8, 1, 12.5, 28556.0, 4728, 34581, 31879.0, 34581.0, 34581.0, 34581.0, 0.2313409097481276, 13.040290594907606, 1.8142131426939647], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 1, 12.5, 1475.375, 335, 2390, 1414.0, 2390.0, 2390.0, 2390.0, 0.1857053320643469, 4.549939319331925, 0.1534245223890991], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 8, 0, 0.0, 773.8749999999999, 335, 1377, 545.0, 1377.0, 1377.0, 1377.0, 0.2646640420815827, 5.353889941112251, 0.22046721474178715], "isController": false}, {"data": ["LOGIN -0", 8, 0, 0.0, 453.87499999999994, 352, 605, 446.5, 605.0, 605.0, 605.0, 1.3944570332926616, 0.9995424437859508, 0.7884674045668467], "isController": false}, {"data": ["GOTO URL", 8, 0, 0.0, 1491.375, 1110, 2563, 1375.5, 2563.0, 2563.0, 2563.0, 1.0033864291985453, 3.6402154145240186, 0.1411012166060454], "isController": false}, {"data": ["LOGIN -1", 8, 0, 0.0, 2565.25, 2175, 3184, 2360.5, 3184.0, 3184.0, 3184.0, 0.9457382669346259, 768.5785849391182, 0.3204796666272609], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 8, 0, 0.0, 354.375, 313, 506, 337.5, 506.0, 506.0, 506.0, 1.2353304508956147, 24.700577130945028, 1.036278180975911], "isController": false}, {"data": ["APPLICATION CREATION", 8, 1, 12.5, 2340.25, 1963, 2790, 2366.0, 2790.0, 2790.0, 2790.0, 0.324728040266277, 50.035271363553335, 1.7835862026100018], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 1, 12.5, 337.37500000000006, 272, 476, 325.0, 476.0, 476.0, 476.0, 0.3519422814658396, 0.279165154414676, 0.30245039813470587], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 8, 0, 0.0, 8577.75, 1639, 10883, 9357.5, 10883.0, 10883.0, 10883.0, 0.5378874470517043, 17.679832477475966, 1.5875952859207962], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 8, 0, 0.0, 1491.375, 1110, 2563, 1375.5, 2563.0, 2563.0, 2563.0, 0.9921865310678407, 3.5995829715986605, 0.13952623093141509], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 8, 1, 12.5, 8572.375, 2128, 10136, 9373.5, 10136.0, 10136.0, 10136.0, 0.22397670642253206, 10.606850012598688, 0.9967400890307407], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/Total Premium\\\/", 1, 6.666666666666667, 0.4219409282700422], "isController": false}, {"data": ["500\/Internal Server Error", 14, 93.33333333333333, 5.9071729957805905], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 237, 15, "500\/Internal Server Error", 14, "Test failed: text expected to contain \\\/Total Premium\\\/", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["QUOTE ESTIMATION", 8, 1, "Test failed: text expected to contain \\\/Total Premium\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 4, "500\/Internal Server Error", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO PROPERTY PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

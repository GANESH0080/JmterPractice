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

    var data = {"OkPercent": 97.5, "KoPercent": 2.5};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3003048780487805, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.6875, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.4375, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.875, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.125, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.4375, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.25, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.375, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.1875, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.875, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.125, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.9375, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0625, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [0.875, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0625, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 240, 6, 2.5, 6888.666666666665, 282, 131075, 1605.5, 9045.9, 15184.099999999997, 119931.31, 1.0384081203515012, 75.34389071917334, 1.3420546094503794], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 8, 0, 0.0, 11470.5, 6631, 16246, 10746.5, 16246.0, 16246.0, 16246.0, 0.47384943434223775, 1.0406524869691407, 0.9629694070958953], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 8, 0, 0.0, 3663.125, 3081, 4614, 3474.5, 4614.0, 4614.0, 4614.0, 0.6532211970278435, 0.4140044500694048, 0.6315322119702784], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 16, 0, 0.0, 7161.125000000001, 6469, 8020, 7065.0, 8020.0, 8020.0, 8020.0, 1.036001036001036, 0.6232193732193732, 4.534527972027972], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 8, 0, 0.0, 3099.75, 2593, 3765, 2925.0, 3765.0, 3765.0, 3765.0, 0.6724949562878278, 0.46299701580363145, 0.7841396267652992], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 8, 0, 0.0, 732.5, 379, 1765, 423.0, 1765.0, 1765.0, 1765.0, 0.7442552795608894, 17.525067738859427, 0.7006465717741185], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 0, 0.0, 437.5, 368, 497, 428.0, 497.0, 497.0, 497.0, 3.2076984763432237, 94.82758620689654, 2.6751704089815553], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 6, 75.0, 116230.5, 103194, 131075, 119440.5, 131075.0, 131075.0, 131075.0, 0.06082725060827251, 0.18482811549574207, 0.058926399026763984], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 8, 0, 0.0, 1072.125, 577, 1967, 1064.0, 1967.0, 1967.0, 1967.0, 0.9092975676290066, 79.96290882871106, 0.7432442032280063], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 8, 0, 0.0, 557.625, 359, 1492, 395.5, 1492.0, 1492.0, 1492.0, 2.6402640264026402, 59.169373968646866, 2.191625412541254], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 0, 0.0, 710.25, 518, 814, 756.0, 814.0, 814.0, 814.0, 4.4692737430167595, 309.81581703910615, 3.6705656424581004], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 0, 0.0, 1697.0, 1122, 2247, 1711.0, 2247.0, 2247.0, 2247.0, 3.341687552213868, 85.66664055973266, 2.6955409356725144], "isController": false}, {"data": ["GOTO HOME PAGE", 8, 0, 0.0, 1072.125, 577, 1967, 1064.0, 1967.0, 1967.0, 1967.0, 0.9112655199908873, 80.1359690027338, 0.7448527736644265], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 8, 0, 0.0, 1634.875, 1413, 1946, 1535.0, 1946.0, 1946.0, 1946.0, 0.27418857319121226, 5.322277339599685, 0.22090387976831066], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 8, 6, 75.0, 117865.375, 105027, 132704, 120878.5, 132704.0, 132704.0, 132704.0, 0.060100668619938395, 1.3492350663924573, 0.10664347156487115], "isController": true}, {"data": ["LOGIN PROCESS", 8, 0, 0.0, 12806.75, 9292, 16107, 13777.5, 16107.0, 16107.0, 16107.0, 0.49643189574930185, 413.72023347812603, 0.8653622401489297], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 8, 0, 0.0, 3645.75, 3474, 3882, 3629.5, 3882.0, 3882.0, 3882.0, 1.4508523757707652, 0.6659185709104098, 2.133773122959739], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 8, 0, 0.0, 977.375, 929, 1080, 947.5, 1080.0, 1080.0, 1080.0, 4.333694474539545, 119.26547264355362, 3.5803764897074752], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 8, 0, 0.0, 1174.625, 513, 2090, 1058.5, 2090.0, 2090.0, 2090.0, 2.5, 173.30322265625, 2.33642578125], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 0, 0.0, 1814.375, 926, 2480, 1914.0, 2480.0, 2480.0, 2480.0, 2.2142264046498754, 154.81421256573483, 7.023249377248824], "isController": false}, {"data": ["LOGIN ", 8, 0, 0.0, 12436.25, 8941, 15706, 13421.0, 15706.0, 15706.0, 15706.0, 0.5091001654575538, 414.0982961053837, 0.4603776886852488], "isController": false}, {"data": ["GET QUOTE", 8, 0, 0.0, 6785.5, 6243, 7817, 6660.0, 7817.0, 7817.0, 7817.0, 0.4833836858006042, 0.21856117824773413, 0.97809667673716], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 8, 0, 0.0, 3305.125, 3191, 3375, 3326.0, 3375.0, 3375.0, 3375.0, 1.4730252255569876, 0.676095562511508, 1.9333456085435463], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 8, 0, 0.0, 639.0, 384, 1329, 435.5, 1329.0, 1329.0, 1329.0, 3.1670625494853524, 1.8897218923198735, 7.08568388756928], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 16, 0, 0.0, 3349.1875, 2656, 4315, 3313.0, 4198.1, 4315.0, 4315.0, 2.576074706166479, 30.203784112864273, 6.948357752374818], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 8, 0, 0.0, 1697.0, 1122, 2247, 1711.0, 2247.0, 2247.0, 2247.0, 3.340292275574113, 85.63087160751566, 2.6944154488517746], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 0, 0.0, 351.25, 310, 408, 346.0, 408.0, 408.0, 408.0, 3.329171868497711, 9.581122555139409, 2.519636912193092], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 0, 0.0, 535.375, 428, 1184, 441.5, 1184.0, 1184.0, 1184.0, 0.7415647015202076, 17.534583420235446, 0.6191775583982202], "isController": false}, {"data": ["QUOTE CREATION", 8, 0, 0.0, 26288.25, 22628, 30124, 25469.5, 30124.0, 30124.0, 30124.0, 0.2600780234070221, 13.306394262028608, 2.0714808192457737], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 0, 0.0, 977.375, 929, 1080, 947.5, 1080.0, 1080.0, 1080.0, 4.331348132106118, 119.2009001082837, 3.578438007579859], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 8, 0, 0.0, 366.625, 324, 390, 375.5, 390.0, 390.0, 390.0, 3.296250515039143, 66.67423130407911, 2.745802430984755], "isController": false}, {"data": ["LOGIN -0", 8, 0, 0.0, 920.0, 848, 1274, 874.5, 1274.0, 1274.0, 1274.0, 6.2745098039215685, 4.497549019607844, 3.547794117647059], "isController": false}, {"data": ["GOTO URL", 8, 0, 0.0, 2253.0, 1429, 3017, 2264.5, 3017.0, 3017.0, 3017.0, 2.64812975835816, 9.607228566699769, 0.3723932472691162], "isController": false}, {"data": ["LOGIN -1", 8, 0, 0.0, 11512.125, 8075, 14844, 12545.0, 14844.0, 14844.0, 14844.0, 0.538829393143396, 437.8935980332727, 0.18259160099683439], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 8, 0, 0.0, 370.5, 328, 445, 362.5, 445.0, 445.0, 445.0, 1.1156045181982988, 22.306643076279457, 0.9358440245432994], "isController": false}, {"data": ["APPLICATION CREATION", 8, 0, 0.0, 3414.875, 2081, 3990, 3744.0, 3990.0, 3990.0, 3990.0, 1.7053933063312725, 243.1384566190578, 9.566190577701983], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 0, 0.0, 539.0, 282, 1358, 308.5, 1358.0, 1358.0, 1358.0, 3.331945022907122, 1.5097875885047898, 2.8633902540608083], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 8, 0, 0.0, 7496.875, 6396, 8613, 7567.5, 8613.0, 8613.0, 8613.0, 0.47778308647873863, 11.882171412147635, 1.46880972288581], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 8, 0, 0.0, 2253.0, 1429, 3017, 2264.5, 3017.0, 3017.0, 3017.0, 2.568218298555377, 9.31731540930979, 0.3611556982343499], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 8, 0, 0.0, 7755.0, 7630, 7913, 7736.0, 7913.0, 7913.0, 7913.0, 0.8246572518297083, 41.81652503607875, 3.6698858365116998], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 6, 100.0, 2.5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 240, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 6, "500\/Internal Server Error", 6, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

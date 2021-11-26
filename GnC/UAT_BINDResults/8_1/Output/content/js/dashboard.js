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

    var data = {"OkPercent": 98.75, "KoPercent": 1.25};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2347560975609756, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0625, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.0625, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.75, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.875, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.0625, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.75, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.0625, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.0625, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.1875, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.125, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.625, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.375, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.25, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.875, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.0625, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.5625, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.125, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [0.8125, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [0.875, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 240, 3, 1.25, 8094.8708333333325, 281, 148551, 1605.5, 26780.6000000001, 37432.99999999998, 144841.06000000003, 0.9333328148151029, 68.0561671606363, 1.20625367013685], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 8, 0, 0.0, 6480.375, 3888, 11018, 5548.0, 11018.0, 11018.0, 11018.0, 0.4370629370629371, 0.9611970061188811, 0.8882109101835665], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 8, 0, 0.0, 1824.25, 1464, 2266, 1745.5, 2266.0, 2266.0, 2266.0, 0.7388935069733075, 0.46830262307194975, 0.7143599334995844], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 16, 0, 0.0, 4524.25, 2004, 7354, 4707.5, 7354.0, 7354.0, 7354.0, 1.0589013898080741, 0.6369953673064196, 4.6347617471872935], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 8, 0, 0.0, 1936.625, 1489, 2300, 1922.0, 2300.0, 2300.0, 2300.0, 0.7593014426727411, 0.5227612471526196, 0.8853573462414579], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 8, 0, 0.0, 689.625, 389, 1323, 538.0, 1323.0, 1323.0, 1323.0, 0.8294453084499741, 19.56952274494557, 0.7808449974079834], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 0, 0.0, 535.25, 389, 955, 477.5, 955.0, 955.0, 955.0, 1.0887316276537835, 32.183901018984756, 0.9079851660315732], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 3, 37.5, 123952.625, 104758, 148551, 119954.0, 148551.0, 148551.0, 148551.0, 0.05326870064321956, 0.09519049178663223, 0.05160405374811895], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 8, 0, 0.0, 1875.5000000000002, 1372, 2383, 1942.0, 2383.0, 2383.0, 2383.0, 0.7576475044985321, 66.62590488564258, 0.6192880481106166], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 8, 0, 0.0, 578.875, 378, 927, 484.0, 927.0, 927.0, 927.0, 1.0791852151625523, 24.18273324733576, 0.8958080399298529], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 0, 0.0, 1972.1250000000002, 1202, 2887, 1932.0, 2887.0, 2887.0, 2887.0, 0.9450679267572357, 38.3084760779681, 0.7761739515652688], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 0, 0.0, 3065.5000000000005, 2460, 3762, 3153.5, 3762.0, 3762.0, 3762.0, 1.6326530612244898, 41.85427295918367, 1.3169642857142856], "isController": false}, {"data": ["GOTO HOME PAGE", 8, 0, 0.0, 1875.5000000000002, 1372, 2383, 1942.0, 2383.0, 2383.0, 2383.0, 0.7565011820330969, 66.52509973404256, 0.6183510638297873], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 8, 0, 0.0, 2960.625, 1608, 6201, 2058.0, 6201.0, 6201.0, 6201.0, 0.1701331291735783, 20.03068377567947, 0.13707014801582237], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 8, 3, 37.5, 126913.25, 106383, 150718, 122019.0, 150718.0, 150718.0, 150718.0, 0.05250584127484183, 6.275620953358405, 0.09316710312147226], "isController": true}, {"data": ["LOGIN PROCESS", 8, 0, 0.0, 35624.875, 30102, 39240, 36071.0, 39240.0, 39240.0, 39240.0, 0.2038528182652125, 169.88843039700336, 0.35534890683926207], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 8, 0, 0.0, 1574.7500000000002, 1376, 1870, 1573.0, 1870.0, 1870.0, 1870.0, 0.9394081728511039, 0.43117367308595583, 1.3815905354626585], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 8, 0, 0.0, 2344.75, 1208, 4567, 1883.5, 4567.0, 4567.0, 4567.0, 1.3315579227696406, 36.64515021637816, 1.100095705725699], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 8, 0, 0.0, 727.25, 440, 1227, 729.0, 1227.0, 1227.0, 1227.0, 1.0815195349466, 43.839563336487764, 1.0107560497498986], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 0, 0.0, 1185.7500000000002, 817, 1669, 1110.0, 1669.0, 1669.0, 1669.0, 1.0290712631849757, 42.3275903653203, 3.264085412914844], "isController": false}, {"data": ["LOGIN ", 8, 0, 0.0, 34652.25, 29498, 38899, 35112.5, 38899.0, 38899.0, 38899.0, 0.2056502403537184, 167.27437919333693, 0.18596886969486645], "isController": false}, {"data": ["GET QUOTE", 8, 0, 0.0, 3389.3750000000005, 2622, 6160, 2823.0, 6160.0, 6160.0, 6160.0, 0.5016932145992726, 0.22683980308541327, 1.0151448639157155], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 8, 0, 0.0, 1555.6250000000002, 1327, 2169, 1487.5, 2169.0, 2169.0, 2169.0, 0.9449562957713206, 0.43372017481691477, 1.2402551381998583], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 8, 0, 0.0, 457.75, 374, 747, 401.5, 747.0, 747.0, 747.0, 1.1066537557061833, 0.6603178171254669, 2.475921635080924], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 16, 0, 0.0, 1895.6875, 1478, 2446, 1894.5, 2426.4, 2446.0, 2446.0, 1.8001800180018002, 21.104759401721424, 4.855563681368137], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 8, 0, 0.0, 3065.5000000000005, 2460, 3762, 3153.5, 3762.0, 3762.0, 3762.0, 1.6326530612244898, 41.85427295918367, 1.3169642857142856], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 0, 0.0, 354.125, 302, 409, 344.5, 409.0, 409.0, 409.0, 1.142857142857143, 3.2890625, 0.8649553571428571], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 0, 0.0, 752.3749999999999, 415, 1252, 673.0, 1252.0, 1252.0, 1252.0, 0.7684918347742555, 18.171754923150818, 0.6416606628242075], "isController": false}, {"data": ["QUOTE CREATION", 8, 0, 0.0, 15074.625, 12912, 17827, 14599.5, 17827.0, 17827.0, 17827.0, 0.3186108566649408, 16.317060740172845, 2.5376856903898997], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 0, 0.0, 2344.75, 1208, 4567, 1883.5, 4567.0, 4567.0, 4567.0, 1.332001332001332, 36.65735306360306, 1.100462037962038], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 8, 0, 0.0, 445.5, 369, 595, 420.0, 595.0, 595.0, 595.0, 1.0653882008256759, 21.551872128445865, 0.8874766946331069], "isController": false}, {"data": ["LOGIN -0", 8, 0, 0.0, 1039.5, 965, 1093, 1041.5, 1093.0, 1093.0, 1093.0, 7.319304666056725, 5.246454711802379, 4.138552150045745], "isController": false}, {"data": ["GOTO URL", 8, 0, 0.0, 2933.0, 2529, 3334, 2940.5, 3334.0, 3334.0, 3334.0, 2.3995200959808036, 8.705290191961607, 0.3374325134973005], "isController": false}, {"data": ["LOGIN -1", 8, 0, 0.0, 33607.5, 28532, 37840, 34064.5, 37840.0, 37840.0, 37840.0, 0.21138855859426608, 171.7903620029066, 0.0716326463205179], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 8, 0, 0.0, 972.625, 341, 1927, 871.5, 1927.0, 1927.0, 1927.0, 0.8288437629506837, 16.572828170327394, 0.6952898363033568], "isController": false}, {"data": ["APPLICATION CREATION", 8, 0, 0.0, 3911.625, 3024, 5019, 3895.0, 5019.0, 5019.0, 5019.0, 0.7759456838021338, 65.9538676042677, 4.352570320077595], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 0, 0.0, 399.625, 281, 711, 324.5, 711.0, 711.0, 711.0, 1.1353959693443088, 0.5144762986091399, 0.9757309111552653], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 8, 0, 0.0, 4452.5, 3524, 5198, 4663.5, 5198.0, 5198.0, 5198.0, 0.6296237997796317, 15.687562716433181, 1.9356012907287896], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 8, 0, 0.0, 2933.0, 2529, 3334, 2940.5, 3334.0, 3334.0, 3334.0, 2.390200179265013, 8.671478189423365, 0.3361219002091425], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 8, 0, 0.0, 4111.124999999999, 3756, 4883, 3901.5, 4883.0, 4883.0, 4883.0, 0.7471747454936024, 37.88774283179228, 3.325073550014009], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 3, 100.0, 1.25], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 240, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

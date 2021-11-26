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

    var data = {"OkPercent": 94.09282700421942, "KoPercent": 5.9071729957805905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.30615384615384617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.0625, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.125, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [0.875, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.375, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.25, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.4375, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.1875, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.375, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.125, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0625, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.4375, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.4375, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.0625, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.0625, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [0.03125, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.1875, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [0.875, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [0.75, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.4375, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.6875, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.3125, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.9375, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [0.875, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.3125, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 237, 14, 5.9071729957805905, 6185.510548523206, 272, 128463, 1323.0, 8749.800000000001, 11480.799999999988, 122767.54000000002, 1.0334722924770194, 76.09759503066621, 1.3261165493472118], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 8, 1, 12.5, 10351.375, 558, 17340, 11042.5, 17340.0, 17340.0, 17340.0, 0.36003600360036003, 0.7146222434743474, 0.7316747299729973], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 8, 0, 0.0, 3709.125, 1151, 4413, 4051.0, 4413.0, 4413.0, 4413.0, 0.5233889434085706, 6.043634486424599, 0.5033912945698397], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 16, 2, 12.5, 7301.375, 948, 8857, 8296.0, 8857.0, 8857.0, 8857.0, 0.3520429492398073, 0.3436200466456908, 1.5408754868093908], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 8, 0, 0.0, 3465.0, 379, 4144, 3915.0, 4144.0, 4144.0, 4144.0, 0.5373094230640071, 0.36428424508026064, 0.6265111827523675], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 7, 0, 0.0, 441.42857142857144, 353, 645, 424.0, 645.0, 645.0, 645.0, 0.5816368923971749, 13.73330065953469, 0.5475566057332779], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 1, 12.5, 407.625, 358, 463, 407.5, 463.0, 463.0, 463.0, 0.24175027196905596, 6.3364127375951895, 0.20161594947419317], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 3, 37.5, 102744.0, 300, 128463, 114573.5, 128463.0, 128463.0, 128463.0, 0.04732747655810927, 0.08128055025586417, 0.04584849291566835], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 8, 0, 0.0, 1357.875, 704, 3289, 1021.0, 3289.0, 3289.0, 3289.0, 0.6662225183211192, 58.58667463878248, 0.5445588357761493], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 8, 1, 12.5, 1340.8750000000002, 393, 1641, 1405.0, 1641.0, 1641.0, 1641.0, 0.2925794536078704, 5.875089716746516, 0.24286380426434553], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 1, 12.5, 806.1250000000001, 411, 1280, 787.5, 1280.0, 1280.0, 1280.0, 0.3577657528733062, 25.277469352332187, 0.29382909977192434], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 1, 12.5, 1531.0, 347, 2057, 1601.5, 2057.0, 2057.0, 2057.0, 0.1981227865969935, 4.511477384593477, 0.15981388840734045], "isController": false}, {"data": ["GOTO HOME PAGE", 8, 0, 0.0, 1357.875, 704, 3289, 1021.0, 3289.0, 3289.0, 3289.0, 0.6648936170212766, 58.46981292075299, 0.543472614694149], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 8, 0, 0.0, 1618.0, 368, 2266, 1734.5, 2266.0, 2266.0, 2266.0, 0.0469304549320975, 0.9108873614085002, 0.037810180975566834], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 8, 3, 37.5, 104362.0, 668, 130194, 116410.5, 130194.0, 130194.0, 130194.0, 0.046848281839263546, 0.9897500168361012, 0.08312825009955259], "isController": true}, {"data": ["LOGIN PROCESS", 8, 0, 0.0, 9258.25, 5126, 15220, 9049.0, 15220.0, 15220.0, 15220.0, 0.4958780140085539, 413.25863525072833, 0.8643967334035828], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 8, 0, 0.0, 3187.75, 844, 3773, 3485.0, 3773.0, 3773.0, 3773.0, 0.2603149811271639, 0.11951228564688272, 0.3828460562280359], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 8, 1, 12.5, 898.6249999999999, 333, 1185, 908.0, 1185.0, 1185.0, 1185.0, 0.19558945772822844, 4.792108844005183, 0.16159050902156374], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 7, 0, 0.0, 814.5714285714286, 671, 1042, 741.0, 1042.0, 1042.0, 1042.0, 2.3155805491233874, 185.942927141912, 2.1640728374131655], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 1, 12.5, 1106.0, 341, 1435, 1155.5, 1435.0, 1435.0, 1435.0, 0.34490191851692176, 24.58626084554861, 1.053693886074585], "isController": false}, {"data": ["LOGIN ", 8, 0, 0.0, 8792.5, 4790, 14781, 8716.5, 14781.0, 14781.0, 14781.0, 0.5097489486427934, 414.6260115330699, 0.46096438129221357], "isController": false}, {"data": ["GET QUOTE", 8, 0, 0.0, 6241.25, 1306, 7266, 6930.5, 7266.0, 7266.0, 7266.0, 0.4293918737587891, 0.19697932880682734, 0.8688476195587999], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 8, 0, 0.0, 3465.75, 700, 3974, 3949.5, 3974.0, 3974.0, 3974.0, 0.23976503027033505, 0.1100776707576575, 0.3146916022298148], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 16, 1, 6.25, 3979.3125, 781, 5328, 3723.5, 5288.8, 5328.0, 5328.0, 0.5688686624475575, 6.007147523643604, 1.5343898883595248], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 7, 0, 0.0, 400.1428571428571, 367, 470, 388.0, 470.0, 470.0, 470.0, 2.7058368766911483, 1.6145179020100502, 6.053781527831465], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 8, 1, 12.5, 1531.0, 347, 2057, 1601.5, 2057.0, 2057.0, 2057.0, 0.1981227865969935, 4.511477384593477, 0.15981388840734045], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 1, 12.5, 317.0, 305, 336, 318.5, 336.0, 336.0, 336.0, 0.3588570403265599, 1.0453375919571166, 0.27159590454402727], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 1, 12.5, 678.25, 385, 2161, 431.0, 2161.0, 2161.0, 2161.0, 0.6645622196378136, 13.990933009013125, 0.5548834939358698], "isController": false}, {"data": ["QUOTE CREATION", 8, 1, 12.5, 24832.625, 5556, 32398, 26984.0, 32398.0, 32398.0, 32398.0, 0.23226780477891007, 13.095628556600762, 1.8214820046889064], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 1, 12.5, 898.6249999999999, 333, 1185, 908.0, 1185.0, 1185.0, 1185.0, 0.19559423974963938, 4.79222600761595, 0.1615944597931591], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 8, 0, 0.0, 384.37500000000006, 302, 456, 412.0, 456.0, 456.0, 456.0, 0.2639044665830969, 5.338427840684172, 0.21983448241736492], "isController": false}, {"data": ["LOGIN -0", 8, 0, 0.0, 649.0000000000001, 356, 910, 680.5, 910.0, 910.0, 910.0, 3.587443946188341, 2.571468609865471, 2.0284473094170403], "isController": false}, {"data": ["GOTO URL", 8, 0, 0.0, 1665.875, 1168, 2759, 1355.0, 2759.0, 2759.0, 2759.0, 1.7478697837011141, 6.341148678173476, 0.2457941883329692], "isController": false}, {"data": ["LOGIN -1", 8, 0, 0.0, 8141.875, 3993, 14305, 8215.5, 14305.0, 14305.0, 14305.0, 0.5370569280343717, 436.453158566058, 0.1819909707303974], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 8, 0, 0.0, 465.75, 319, 1155, 341.0, 1155.0, 1155.0, 1155.0, 0.7059654076950229, 14.115861057183198, 0.5922112160254147], "isController": false}, {"data": ["APPLICATION CREATION", 8, 1, 12.5, 2528.75, 1362, 3269, 2551.5, 3269.0, 3269.0, 3269.0, 0.330169211721007, 48.087380378146925, 1.8134721290755262], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 1, 12.5, 299.625, 272, 354, 297.0, 354.0, 354.0, 354.0, 0.3590986623574827, 0.28484168798814974, 0.30860041296346175], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 8, 0, 0.0, 7561.75, 1531, 8856, 8514.5, 8856.0, 8856.0, 8856.0, 0.41433602651750573, 13.625494856406672, 1.222928562642428], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 8, 0, 0.0, 1665.875, 1168, 2759, 1355.0, 2759.0, 2759.0, 2759.0, 1.716001716001716, 6.225533569283569, 0.24131274131274133], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 8, 1, 12.5, 7445.5, 2365, 8319, 8136.5, 8319.0, 8319.0, 8319.0, 0.22825838849577723, 10.809728800502167, 1.0157944105227117], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/Total Premium\\\/", 1, 7.142857142857143, 0.4219409282700422], "isController": false}, {"data": ["500\/Internal Server Error", 13, 92.85714285714286, 5.485232067510548], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 237, 14, "500\/Internal Server Error", 13, "Test failed: text expected to contain \\\/Total Premium\\\/", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["QUOTE ESTIMATION", 8, 1, "Test failed: text expected to contain \\\/Total Premium\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 8, 3, "500\/Internal Server Error", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO PROPERTY PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO RISK QUILIFIER POPUP ", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SHOW RISK QUILIFIER POPUP", 8, 1, "500\/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

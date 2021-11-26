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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4451219512195122, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SAVE COVERAGE PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.75, 500, 1500, "SEARCH PROPERTY ADDRESS-2"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO COVERAGE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CLICK GNERATE POLICY BUTTON"], "isController": false}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.75, 500, 1500, "GOTO PROPERTY PAGE"], "isController": false}, {"data": [0.75, 500, 1500, "GOTO POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO APPLICATION SUMMARY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO VIEW POLICY PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "CREATE POLICY USING GENERATE QUOTE BUTTON"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.5, 500, 1500, "SAVE PROPERTY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION FORM SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-1"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.5, 500, 1500, "GET QUOTE"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE OCCUPANCY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "SAVE RISK QUILIFIER POPUP-0"], "isController": false}, {"data": [0.5, 500, 1500, "SAVE POLICY HOLDER PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "APPLICATION SUMMARY PAGE"], "isController": true}, {"data": [1.0, 500, 1500, "GOTO RISK QUILIFIER POPUP "], "isController": false}, {"data": [1.0, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GOTO APPLICATION FORM SUMMARY PAGE"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO OCCUPANCY PAGE"], "isController": false}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [1.0, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.0, 500, 1500, "APPLICATION CREATION"], "isController": true}, {"data": [1.0, 500, 1500, "SHOW RISK QUILIFIER POPUP"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "SAVE PROPERTY AND OCCUPANCY PAGE"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60, 0, 0.0, 3325.4166666666674, 336, 56550, 738.5, 7071.899999999998, 10344.499999999996, 56550.0, 0.4934778675176418, 33.42461174600694, 0.637778378061619], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 2, 0, 0.0, 4732.5, 1965, 7500, 4732.5, 7500.0, 7500.0, 7500.0, 0.2320454809142592, 0.5102054690219283, 0.47156899002204433], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 2, 0, 0.0, 533.5, 530, 537, 533.5, 537.0, 537.0, 537.0, 0.2801120448179272, 0.17753195028011207, 0.27081144957983194], "isController": false}, {"data": ["SAVE COVERAGE PAGE", 4, 0, 0.0, 6599.5, 6009, 7190, 6599.5, 7190.0, 7190.0, 7190.0, 0.2983738624496494, 0.17949052662986723, 1.305968409667313], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 2, 0, 0.0, 750.5, 714, 787, 750.5, 787.0, 787.0, 787.0, 0.27333606669400023, 0.18818547560475604, 0.31871412464124643], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-2", 2, 0, 0.0, 469.0, 437, 501, 469.0, 501.0, 501.0, 501.0, 0.281214848143982, 6.614865280511811, 0.26473741563554554], "isController": false}, {"data": ["GOTO COVERAGE PAGE", 2, 0, 0.0, 468.0, 444, 492, 468.0, 492.0, 492.0, 492.0, 1.2360939431396785, 36.539009386588376, 1.0308830346106304], "isController": false}, {"data": ["CLICK GNERATE POLICY BUTTON", 2, 0, 0.0, 55611.5, 54673, 56550, 55611.5, 56550.0, 56550.0, 56550.0, 0.03536693191865605, 0.018944103669319187, 0.03426171529619806], "isController": false}, {"data": ["GO TO GENERATE QUOTE PAGE", 2, 0, 0.0, 691.5, 536, 847, 691.5, 847.0, 847.0, 847.0, 0.2812939521800281, 24.736698971518987, 0.2299248417721519], "isController": true}, {"data": ["GOTO PROPERTY PAGE", 2, 0, 0.0, 460.0, 399, 521, 460.0, 521.0, 521.0, 521.0, 1.1933174224343677, 26.742429892601432, 0.9905466885441527], "isController": false}, {"data": ["GOTO POLICY HOLDER PAGE", 2, 0, 0.0, 485.0, 467, 503, 485.0, 503.0, 503.0, 503.0, 1.2322858903265559, 27.02364448552064, 1.0120629235982748], "isController": false}, {"data": ["GOTO APPLICATION SUMMARY PAGE", 2, 0, 0.0, 900.0, 889, 911, 900.0, 911.0, 911.0, 911.0, 2.1953896816684964, 56.280443880351264, 1.7708905049396266], "isController": false}, {"data": ["GOTO HOME PAGE", 2, 0, 0.0, 691.5, 536, 847, 691.5, 847.0, 847.0, 847.0, 0.28125439459991564, 24.73322031887217, 0.22989250808606385], "isController": false}, {"data": ["GOTO VIEW POLICY PAGE", 2, 0, 0.0, 717.5, 615, 820, 717.5, 820.0, 820.0, 820.0, 0.8136696501220504, 15.791865846216435, 0.6555443958502848], "isController": false}, {"data": ["CREATE POLICY USING GENERATE QUOTE BUTTON", 2, 0, 0.0, 56329.0, 55493, 57165, 56329.0, 57165.0, 57165.0, 57165.0, 0.03497420652268952, 0.6975202467867447, 0.0620587238786395], "isController": true}, {"data": ["LOGIN PROCESS", 2, 0, 0.0, 7766.5, 4638, 10895, 7766.5, 10895.0, 10895.0, 10895.0, 0.1835367532348353, 152.9572717835184, 0.3199346723868955], "isController": true}, {"data": ["SAVE PROPERTY PAGE", 2, 0, 0.0, 807.5, 733, 882, 807.5, 882.0, 882.0, 882.0, 0.9852216748768472, 0.452201354679803, 1.4489685960591134], "isController": false}, {"data": ["APPLICATION FORM SUMMARY PAGE", 2, 0, 0.0, 875.0, 874, 876, 875.0, 876.0, 876.0, 876.0, 2.232142857142857, 61.42970493861607, 1.8441336495535714], "isController": true}, {"data": ["SAVE RISK QUILIFIER POPUP-1", 2, 0, 0.0, 435.5, 418, 453, 435.5, 453.0, 453.0, 453.0, 1.2135922330097086, 26.6136984223301, 1.1341872724514563], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP", 2, 0, 0.0, 829.0, 804, 854, 829.0, 854.0, 854.0, 854.0, 0.9832841691248771, 22.149820243362832, 3.11885447394297], "isController": false}, {"data": ["LOGIN ", 2, 0, 0.0, 7341.0, 4284, 10398, 7341.0, 10398.0, 10398.0, 10398.0, 0.19234468166955182, 156.4517365118292, 0.1739366945566455], "isController": false}, {"data": ["GET QUOTE", 2, 0, 0.0, 794.0, 788, 800, 794.0, 800.0, 800.0, 800.0, 0.26874496103198064, 0.12151261421660843, 0.5437886320881483], "isController": false}, {"data": ["SAVE OCCUPANCY PAGE", 2, 0, 0.0, 802.5, 700, 905, 802.5, 905.0, 905.0, 905.0, 0.984251968503937, 0.4517562746062992, 1.2918307086614174], "isController": false}, {"data": ["SAVE RISK QUILIFIER POPUP-0", 2, 0, 0.0, 392.5, 385, 400, 392.5, 400.0, 400.0, 400.0, 1.2658227848101267, 0.755290743670886, 2.83203125], "isController": false}, {"data": ["SAVE POLICY HOLDER PAGE", 4, 0, 0.0, 951.0, 698, 1219, 943.5, 1219.0, 1219.0, 1219.0, 1.685630004214075, 19.763353350189632, 4.54659186683523], "isController": false}, {"data": ["APPLICATION SUMMARY PAGE", 2, 0, 0.0, 900.0, 889, 911, 900.0, 911.0, 911.0, 911.0, 2.1953896816684964, 56.280443880351264, 1.7708905049396266], "isController": true}, {"data": ["GOTO RISK QUILIFIER POPUP ", 2, 0, 0.0, 356.0, 336, 376, 356.0, 376.0, 376.0, 376.0, 1.3192612137203166, 3.7967410125329817, 0.9984642974934037], "isController": false}, {"data": ["GOTO QUOTE PAGE", 2, 0, 0.0, 424.5, 409, 440, 424.5, 440.0, 440.0, 440.0, 0.28236622899901176, 6.676830747917549, 0.23576477128335452], "isController": false}, {"data": ["QUOTE CREATION", 2, 0, 0.0, 7705.5, 5001, 10410, 7705.5, 10410.0, 10410.0, 10410.0, 0.1734304543877905, 8.869511197103712, 1.3813464706902532], "isController": true}, {"data": ["GOTO APPLICATION FORM SUMMARY PAGE", 2, 0, 0.0, 875.0, 874, 876, 875.0, 876.0, 876.0, 876.0, 2.229654403567447, 61.36122143255295, 1.8420777591973243], "isController": false}, {"data": ["GOTO OCCUPANCY PAGE", 2, 0, 0.0, 404.5, 386, 423, 404.5, 423.0, 423.0, 423.0, 1.1634671320535195, 23.53237256399069, 0.9691772105875509], "isController": false}, {"data": ["LOGIN -0", 2, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 1.8814675446848543, 1.3486300564440263, 1.0638376058325494], "isController": false}, {"data": ["GOTO URL", 2, 0, 0.0, 3261.5, 3066, 3457, 3261.5, 3457.0, 3457.0, 3457.0, 0.5785363031530228, 2.0988890295053517, 0.08135666763089384], "isController": false}, {"data": ["LOGIN -1", 2, 0, 0.0, 6271.0, 3214, 9328, 6271.0, 9328.0, 9328.0, 9328.0, 0.2144082332761578, 174.2443784841338, 0.07265591498713551], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 2, 0, 0.0, 425.5, 354, 497, 425.5, 497.0, 497.0, 497.0, 0.3021604471974618, 6.041733551140656, 0.25347248451427706], "isController": false}, {"data": ["APPLICATION CREATION", 2, 0, 0.0, 2055.5, 2014, 2097, 2055.5, 2097.0, 2097.0, 2097.0, 0.6220839813374806, 29.727595256609643, 3.48950233281493], "isController": true}, {"data": ["SHOW RISK QUILIFIER POPUP", 2, 0, 0.0, 385.5, 371, 400, 385.5, 400.0, 400.0, 400.0, 1.3227513227513228, 0.5993716931216931, 1.136739417989418], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS", 2, 0, 0.0, 1754.5, 1682, 1827, 1754.5, 1827.0, 1827.0, 1827.0, 0.23932033026205576, 5.94584816620797, 0.7357230465478043], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 2, 0, 0.0, 3261.5, 3066, 3457, 3261.5, 3457.0, 3457.0, 3457.0, 0.561955605507165, 2.038735424276482, 0.07902500702444507], "isController": true}, {"data": ["SAVE PROPERTY AND OCCUPANCY PAGE", 2, 0, 0.0, 2482.5, 2468, 2497, 2482.5, 2497.0, 2497.0, 2497.0, 0.5486968449931413, 27.821180555555557, 2.4418081275720165], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

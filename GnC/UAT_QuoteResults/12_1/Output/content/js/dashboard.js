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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.19791666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.4583333333333333, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.625, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 144, 0, 0.0, 3807.7222222222204, 300, 17087, 1990.5, 11002.5, 15036.5, 16861.100000000006, 3.9341037619867225, 594.404029809715, 4.154906189383384], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 12, 0, 0.0, 4663.25, 1722, 8977, 4472.5, 8531.800000000001, 8977.0, 8977.0, 0.9746588693957114, 2.1418223836500974, 1.9807276437621832], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 12, 0, 0.0, 973.0000000000001, 501, 1960, 783.0, 1953.7, 1960.0, 1960.0, 1.008233910267182, 23.83437723176777, 0.9235580154595867], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 12, 0, 0.0, 3425.416666666667, 2417, 4510, 3258.5, 4502.8, 4510.0, 4510.0, 0.7664303506418855, 0.4468348821613336, 0.8987842897745417], "isController": false}, {"data": ["GOTO QUOTE PAGE", 12, 0, 0.0, 1083.5833333333333, 491, 4015, 674.5, 3384.7000000000025, 4015.0, 4015.0, 1.028630207440425, 24.315535664537972, 0.8588660423452769], "isController": false}, {"data": ["QUOTE CREATION", 12, 0, 0.0, 11216.5, 7074, 16420, 10985.5, 15885.700000000003, 16420.0, 16420.0, 0.6074104069649726, 30.6809976241395, 4.239317327647297], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 12, 0, 0.0, 1259.0833333333333, 455, 3473, 1060.0, 3045.5000000000014, 3473.0, 3473.0, 0.9113001215066828, 80.13864102369381, 0.7448810563487243], "isController": true}, {"data": ["LOGIN -0", 12, 0, 0.0, 1140.5833333333333, 491, 2021, 866.0, 1962.5000000000002, 2021.0, 2021.0, 4.484304932735426, 3.2143357623318383, 2.5355591367713], "isController": false}, {"data": ["GOTO URL", 12, 0, 0.0, 3074.5, 2466, 3750, 3071.0, 3682.8, 3750.0, 3750.0, 3.1923383878691145, 11.58157920989625, 0.44892258579409416], "isController": false}, {"data": ["LOGIN -1", 12, 0, 0.0, 11392.333333333332, 4866, 16585, 10761.5, 16128.7, 16585.0, 16585.0, 0.719640179910045, 584.8341454272863, 0.24386244377811092], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 12, 0, 0.0, 675.0, 300, 1296, 728.5, 1159.5000000000005, 1296.0, 1296.0, 1.0925976509150503, 21.84661806883365, 0.9165443184922152], "isController": false}, {"data": ["GOTO HOME PAGE", 12, 0, 0.0, 1259.0833333333333, 455, 3473, 1060.0, 3045.5000000000014, 3473.0, 3473.0, 0.9122700319294511, 80.22393378440019, 0.7456738444579596], "isController": false}, {"data": ["LOGIN PROCESS", 12, 0, 0.0, 13211.333333333332, 7481, 17818, 12574.0, 17589.4, 17818.0, 17818.0, 0.6729097740144676, 560.7947257191723, 1.1729921353670163], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 12, 0, 0.0, 4399.500000000001, 3069, 5479, 4340.0, 5459.5, 5479.0, 5479.0, 0.7310832216400633, 17.7088370636347, 1.527016761605946], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 12, 0, 0.0, 3074.5000000000005, 2466, 3750, 3071.0, 3682.8, 3750.0, 3750.0, 3.0557677616501144, 11.086110580595875, 0.4297173414820474], "isController": true}, {"data": ["LOGIN ", 12, 0, 0.0, 12536.25, 6820, 17087, 12003.5, 16922.0, 17087.0, 17087.0, 0.6979990693345742, 567.7472625349, 0.6311983771521638], "isController": false}, {"data": ["GET QUOTE", 12, 0, 0.0, 1070.1666666666665, 678, 1948, 980.0, 1827.4000000000005, 1948.0, 1948.0, 1.003428380299356, 0.4536985742955097, 2.0303746132619787], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 144, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

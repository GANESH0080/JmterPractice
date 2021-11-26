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

    var data = {"OkPercent": 95.66666666666667, "KoPercent": 4.333333333333333};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.165, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.38, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.4, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.18, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.28, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.9, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.28, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.04, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.04, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 300, 13, 4.333333333333333, 4978.829999999995, 281, 26198, 2006.5, 19610.500000000004, 21005.5, 23406.36, 6.245836109260494, 972.4535246359198, 6.6084687031562295], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 25, 0, 0.0, 3332.48, 550, 8923, 2665.0, 7276.000000000004, 8743.0, 8923.0, 1.7116253594413255, 2.254130365945502, 3.478410520505272], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 25, 0, 0.0, 1245.64, 629, 2331, 1276.0, 1781.2000000000003, 2186.3999999999996, 2331.0, 1.5264379045060448, 87.12812156551472, 1.4067675578519965], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 25, 0, 0.0, 1719.32, 312, 4561, 1417.0, 3375.8000000000006, 4257.099999999999, 4561.0, 1.5399778243193298, 0.9150235424109892, 1.8151887050326474], "isController": false}, {"data": ["GOTO QUOTE PAGE", 25, 13, 52.0, 1227.48, 378, 4503, 919.0, 2508.000000000003, 4161.9, 4503.0, 1.5039403236479576, 19.346018599981953, 1.255731422577152], "isController": false}, {"data": ["QUOTE CREATION", 25, 13, 52.0, 10304.359999999999, 4938, 16977, 10434.0, 15231.2, 16564.5, 16977.0, 1.1032169807157672, 79.7996919956092, 7.7125209611226335], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 25, 0, 0.0, 1589.24, 1101, 2968, 1474.0, 2269.8, 2772.3999999999996, 2968.0, 1.8699977560026928, 164.44782180323884, 1.5285040251701698], "isController": true}, {"data": ["LOGIN -0", 25, 0, 0.0, 1961.6799999999998, 1845, 2188, 1906.0, 2168.2, 2182.6, 2188.0, 11.195700850873266, 8.025043383340797, 6.330381633452754], "isController": false}, {"data": ["GOTO URL", 25, 0, 0.0, 3152.879999999999, 2688, 3486, 3164.0, 3476.2, 3485.4, 3486.0, 7.169486664754803, 26.01039351519931, 1.0082090622311441], "isController": false}, {"data": ["LOGIN -1", 25, 0, 0.0, 18607.64, 7924, 24232, 18698.0, 21140.2, 23333.8, 24232.0, 1.0301207301495734, 837.1541691561251, 0.34907411461123244], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 25, 0, 0.0, 585.84, 281, 5246, 332.0, 795.6000000000008, 3980.899999999997, 5246.0, 1.4440016172818113, 28.872981556489346, 1.2113255754346446], "isController": false}, {"data": ["GOTO HOME PAGE", 25, 0, 0.0, 1589.24, 1101, 2968, 1474.0, 2269.8, 2772.3999999999996, 2968.0, 1.8747656542932134, 164.8671113376453, 1.5324012232845894], "isController": false}, {"data": ["LOGIN PROCESS", 25, 0, 0.0, 21165.2, 15107, 27227, 20923.0, 23609.2, 26169.199999999997, 27227.0, 0.9182061923825614, 765.2217424913689, 1.6005840365262423], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 25, 0, 0.0, 2966.0800000000004, 1319, 6893, 2890.0, 4971.4000000000015, 6444.499999999999, 6893.0, 1.34654745233222, 77.66017813139611, 2.8281704459765162], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 25, 0, 0.0, 3152.879999999999, 2688, 3486, 3164.0, 3476.2, 3485.4, 3486.0, 6.839945280437757, 24.814840543775652, 0.9618673050615596], "isController": true}, {"data": ["LOGIN ", 25, 0, 0.0, 20579.359999999997, 9861, 26198, 20633.0, 23309.6, 25360.999999999996, 26198.0, 0.9542713184212536, 776.1972079214062, 0.8629445711504695], "isController": false}, {"data": ["GET QUOTE", 25, 0, 0.0, 2778.32, 1227, 5507, 2456.0, 4991.000000000001, 5465.6, 5507.0, 1.440175125295236, 0.6906652348925628, 2.9141043550895787], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 13, 100.0, 4.333333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 300, 13, "500\/Internal Server Error", 13, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO QUOTE PAGE", 25, 13, "500\/Internal Server Error", 13, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

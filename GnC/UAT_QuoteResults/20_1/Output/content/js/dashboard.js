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

    var data = {"OkPercent": 93.33333333333333, "KoPercent": 6.666666666666667};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.284375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.5, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.775, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.125, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.475, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.375, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.9, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.475, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.3, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.225, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 240, 16, 6.666666666666667, 4312.737500000002, 287, 23901, 1280.5, 18570.0, 21226.949999999997, 23562.33, 5.842685687854518, 924.1696140023614, 6.1848403607858415], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 20, 0, 0.0, 1487.75, 503, 8818, 650.0, 4673.900000000003, 8618.199999999997, 8818.0, 1.6015374759769379, 1.3509062449951954, 3.2546869995195387], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 20, 0, 0.0, 910.25, 458, 1675, 823.0, 1411.8000000000002, 1662.35, 1675.0, 1.678556441460344, 126.0272142519933, 1.552009022240873], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 20, 0, 0.0, 790.3000000000001, 303, 2646, 373.5, 2596.800000000001, 2645.85, 2646.0, 1.6490765171503958, 0.9897679955474934, 1.9437845275395778], "isController": false}, {"data": ["GOTO QUOTE PAGE", 20, 16, 80.0, 442.85, 314, 715, 401.0, 613.0000000000002, 710.3499999999999, 715.0, 1.8150467374534893, 12.81043680234141, 1.515493125510482], "isController": false}, {"data": ["QUOTE CREATION", 20, 16, 80.0, 5126.0, 3273, 13894, 4249.5, 9381.200000000004, 13676.499999999996, 13894.0, 1.2076565424793189, 101.53572870750558, 8.44628381438319], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 20, 0, 0.0, 1002.3, 608, 1744, 939.0, 1214.4, 1717.6999999999996, 1744.0, 1.96811651249754, 173.07614688914583, 1.6087046103129303], "isController": true}, {"data": ["LOGIN -0", 20, 0, 0.0, 1485.8999999999999, 1421, 1606, 1484.5, 1550.1000000000001, 1603.3, 1606.0, 12.437810945273633, 8.915384017412935, 7.032707555970148], "isController": false}, {"data": ["GOTO URL", 20, 0, 0.0, 3296.5499999999993, 2839, 3628, 3318.5, 3604.1, 3627.05, 3628.0, 5.512679162072767, 19.999612389746417, 0.7752205071664829], "isController": false}, {"data": ["LOGIN -1", 20, 0, 0.0, 18624.800000000003, 13328, 22472, 18649.5, 22173.8, 22458.0, 22472.0, 0.8891259891526629, 722.5711578643194, 0.3012956232773184], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 20, 0, 0.0, 403.25000000000006, 287, 721, 338.0, 605.9, 715.3, 721.0, 2.1231422505307855, 42.452478105095544, 1.7810343683651806], "isController": false}, {"data": ["GOTO HOME PAGE", 20, 0, 0.0, 1002.3, 608, 1744, 939.0, 1214.4, 1717.6999999999996, 1744.0, 1.9821605550049552, 174.3111798500991, 1.6201839692765114], "isController": false}, {"data": ["LOGIN PROCESS", 20, 0, 0.0, 20516.750000000004, 15090, 24188, 20466.0, 24040.7, 24181.9, 24188.0, 0.8244023083264633, 687.0467397464962, 1.4370684769167352], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 20, 0, 0.0, 1701.8000000000002, 1034, 3179, 1382.5, 3131.000000000001, 3178.65, 3179.0, 1.5796540557617882, 119.549653586802, 3.322518462206777], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 20, 0, 0.0, 3296.5499999999997, 2839, 3628, 3318.5, 3604.1, 3627.05, 3628.0, 5.288207297726071, 19.185244249074564, 0.7436541512427287], "isController": true}, {"data": ["LOGIN ", 20, 0, 0.0, 20113.499999999996, 14767, 23901, 20144.0, 23620.3, 23887.9, 23901.0, 0.8343414959743023, 678.647180447207, 0.7544924074923867], "isController": false}, {"data": ["GET QUOTE", 20, 0, 0.0, 1493.5999999999997, 872, 2172, 1518.0, 1961.1000000000001, 2161.7999999999997, 2172.0, 1.7155601303825698, 0.84806302539029, 3.4713287013209815], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500\/Internal Server Error", 16, 100.0, 6.666666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 240, 16, "500\/Internal Server Error", 16, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GOTO QUOTE PAGE", 20, 16, "500\/Internal Server Error", 16, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

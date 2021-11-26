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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22916666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.3888888888888889, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 216, 0, 0.0, 3406.0925925925912, 286, 14551, 2386.5, 9443.800000000001, 10814.649999999994, 14281.029999999977, 6.0143676560672725, 908.7171295925683, 6.3555146495795505], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 18, 0, 0.0, 5139.944444444444, 1987, 9875, 4795.0, 9869.6, 9875.0, 9875.0, 1.1658786190815467, 2.556748028531641, 2.3693294983483386], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 18, 0, 0.0, 1297.7777777777778, 536, 4239, 831.5, 3467.700000000001, 4239.0, 4239.0, 1.3175230566534915, 31.152501006441224, 1.2068717061923584], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 18, 0, 0.0, 2705.3333333333335, 2006, 3505, 2724.5, 3268.3, 3505.0, 3505.0, 1.3858946720049274, 0.8079874210809979, 1.6301856762011089], "isController": false}, {"data": ["GOTO QUOTE PAGE", 18, 0, 0.0, 1346.3333333333335, 467, 5821, 1044.5, 2419.9000000000055, 5821.0, 5821.0, 1.3028372900984366, 30.805047702844526, 1.08781824515055], "isController": false}, {"data": ["QUOTE CREATION", 18, 0, 0.0, 12293.333333333334, 10678, 15579, 11892.0, 15327.0, 15579.0, 15579.0, 0.8513858669946079, 43.009859669141996, 5.945151017524359], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 18, 0, 0.0, 848.6111111111111, 458, 1422, 787.5, 1386.9, 1422.0, 1422.0, 1.8043303929430634, 158.67133855628506, 1.474828651263031], "isController": true}, {"data": ["LOGIN -0", 18, 0, 0.0, 1481.5, 1420, 1579, 1466.0, 1572.7, 1579.0, 1579.0, 11.166253101736972, 8.003935328784118, 6.313731001861042], "isController": false}, {"data": ["GOTO URL", 18, 0, 0.0, 2770.1666666666665, 2355, 3070, 2792.5, 3067.3, 3070.0, 3070.0, 5.863192182410423, 21.271248982084693, 0.8245114006514659], "isController": false}, {"data": ["LOGIN -1", 18, 0, 0.0, 8816.944444444443, 4137, 13085, 9155.5, 13074.2, 13085.0, 13085.0, 1.373311970702678, 1116.057378690776, 0.4653703650720989], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 18, 0, 0.0, 358.8333333333334, 286, 719, 317.0, 520.1000000000004, 719.0, 719.0, 1.935067727370458, 38.69190597452161, 1.6232648220812729], "isController": false}, {"data": ["GOTO HOME PAGE", 18, 0, 0.0, 848.6111111111111, 458, 1422, 787.5, 1386.9, 1422.0, 1422.0, 1.8059596669007725, 158.81461557514797, 1.4761603917929165], "isController": false}, {"data": ["LOGIN PROCESS", 18, 0, 0.0, 10659.555555555555, 6035, 14905, 11018.0, 14837.5, 14905.0, 14905.0, 1.2053033346725592, 1004.4849682352351, 2.1010414574126157], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 18, 0, 0.0, 4004.0555555555566, 2704, 7481, 3568.0, 6946.400000000001, 7481.0, 7481.0, 1.0995723885155773, 26.64017161728772, 2.3006189867135003], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 18, 0, 0.0, 2770.166666666667, 2355, 3070, 2792.5, 3067.3, 3070.0, 3070.0, 5.571030640668524, 20.211307451253482, 0.7834261838440112], "isController": true}, {"data": ["LOGIN ", 18, 0, 0.0, 10300.666666666668, 5634, 14551, 10696.0, 14528.5, 14551.0, 14551.0, 1.2346525824816517, 1004.2572471534398, 1.1164924720488374], "isController": false}, {"data": ["GET QUOTE", 18, 0, 0.0, 1802.9444444444443, 929, 5978, 1254.5, 4149.200000000003, 5978.0, 5978.0, 1.2548800892359173, 0.5673920715978806, 2.539171430563302], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 216, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

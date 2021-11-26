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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22265625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0625, 500, 1500, "QUOTE ESTIMATION"], "isController": false}, {"data": [0.625, 500, 1500, "SEARCH PROPERTY ADDRESS-1"], "isController": false}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS-0"], "isController": false}, {"data": [0.4375, 500, 1500, "GOTO QUOTE PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "QUOTE CREATION"], "isController": true}, {"data": [0.5, 500, 1500, "GO TO GENERATE QUOTE PAGE"], "isController": true}, {"data": [0.5, 500, 1500, "LOGIN -0"], "isController": false}, {"data": [0.0, 500, 1500, "GOTO URL"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN -1"], "isController": false}, {"data": [0.6875, 500, 1500, "GOTO APPLICATION STATUS"], "isController": false}, {"data": [0.5, 500, 1500, "GOTO HOME PAGE"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN PROCESS"], "isController": true}, {"data": [0.0, 500, 1500, "SEARCH PROPERTY ADDRESS"], "isController": false}, {"data": [0.0, 500, 1500, "GO TO TEST.COGITATE.US\/GnC\/POS"], "isController": true}, {"data": [0.0, 500, 1500, "LOGIN "], "isController": false}, {"data": [0.25, 500, 1500, "GET QUOTE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 96, 0, 0.0, 5425.822916666671, 311, 24192, 2028.0, 21409.8, 22502.7, 24192.0, 2.0715549609425574, 312.9213746439515, 2.18720329290924], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["QUOTE ESTIMATION", 8, 0, 0.0, 3892.9999999999995, 1160, 7691, 3074.0, 7691.0, 7691.0, 7691.0, 0.7653305271214005, 1.3667016944896202, 1.555325026308237], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-1", 8, 0, 0.0, 813.0, 467, 1384, 720.0, 1384.0, 1384.0, 1384.0, 1.5695507161075142, 37.105543089072, 1.437732980184422], "isController": false}, {"data": ["SEARCH PROPERTY ADDRESS-0", 8, 0, 0.0, 3178.0, 2215, 4196, 3386.0, 4196.0, 4196.0, 4196.0, 1.1656709893632522, 0.6795952936033804, 1.3648823400845111], "isController": false}, {"data": ["GOTO QUOTE PAGE", 8, 0, 0.0, 1600.5, 419, 4644, 700.5, 4644.0, 4644.0, 4644.0, 0.8866230743655104, 20.961189460268205, 0.7402956333813587], "isController": false}, {"data": ["QUOTE CREATION", 8, 0, 0.0, 11436.875, 10205, 12588, 11458.0, 12588.0, 12588.0, 12588.0, 0.5383942391816408, 26.9753784532943, 3.756666834914866], "isController": true}, {"data": ["GO TO GENERATE QUOTE PAGE", 8, 0, 0.0, 1156.0, 936, 1474, 1058.5, 1474.0, 1474.0, 1474.0, 1.721170395869191, 151.3594136591007, 1.4068550989672979], "isController": true}, {"data": ["LOGIN -0", 8, 0, 0.0, 729.625, 571, 933, 732.0, 933.0, 933.0, 933.0, 8.447729672650475, 6.0553062302006335, 4.776597148891236], "isController": false}, {"data": ["GOTO URL", 8, 0, 0.0, 3909.25, 3514, 4182, 3950.0, 4182.0, 4182.0, 4182.0, 1.8730976352142357, 6.7954665183797704, 0.2634043549520019], "isController": false}, {"data": ["LOGIN -1", 8, 0, 0.0, 21334.625, 19667, 23525, 21160.0, 23525.0, 23525.0, 23525.0, 0.3387964256977089, 275.33164993859316, 0.11480699191123533], "isController": false}, {"data": ["GOTO APPLICATION STATUS", 8, 0, 0.0, 484.62499999999994, 311, 677, 533.5, 677.0, 677.0, 677.0, 1.8819101387908728, 37.62901376146789, 1.5786726652552339], "isController": false}, {"data": ["GOTO HOME PAGE", 8, 0, 0.0, 1156.0, 936, 1474, 1058.5, 1474.0, 1474.0, 1474.0, 1.7134289997858214, 150.67863668612125, 1.4005274148639968], "isController": false}, {"data": ["LOGIN PROCESS", 8, 0, 0.0, 22552.5, 20792, 24503, 22341.5, 24503.0, 24503.0, 24503.0, 0.326224360804143, 271.87136820535824, 0.5686625820658158], "isController": true}, {"data": ["SEARCH PROPERTY ADDRESS", 8, 0, 0.0, 3992.0, 2683, 5581, 4098.0, 5581.0, 5581.0, 5581.0, 1.035866891104493, 25.092712109931373, 2.161765181924123], "isController": false}, {"data": ["GO TO TEST.COGITATE.US\/GnC\/POS", 8, 0, 0.0, 3909.25, 3514, 4182, 3950.0, 4182.0, 4182.0, 4182.0, 1.813236627379873, 6.578294990933817, 0.25498640072529466], "isController": true}, {"data": ["LOGIN ", 8, 0, 0.0, 22067.875, 20254, 24192, 21894.0, 24192.0, 24192.0, 24192.0, 0.330455615680119, 268.79014519393616, 0.29882998058573257], "isController": false}, {"data": ["GET QUOTE", 8, 0, 0.0, 1951.375, 671, 4768, 1251.5, 4768.0, 4768.0, 4768.0, 0.8445054365037475, 0.38184181357542485, 1.7088039691755514], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 96, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
